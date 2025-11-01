const express = require('express');
const router = express.Router();
const District = require('../models/District');
const DistrictMetric = require('../models/DistrictMetric');
const { getRedisClient } = require('../config/redis');

// Cache helper
const cacheKey = (key) => `mgnrega:${key}`;
const CACHE_TTL = 3600; // 1 hour

async function getCached(key) {
  try {
    const client = getRedisClient();
    if (!client) return null;
    const cached = await client.get(cacheKey(key));
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

async function setCached(key, data) {
  try {
    const client = getRedisClient();
    if (!client) return;
    await client.setEx(cacheKey(key), CACHE_TTL, JSON.stringify(data));
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

// GET /api/v1/districts?state=STATE_CODE
router.get('/', async (req, res, next) => {
  try {
    const state = req.query.state || process.env.STATE_CODE;
    if (!state) {
      return res.status(400).json({ error: 'State code is required' });
    }

    const cacheKeyStr = `districts:${state}`;
    const cached = await getCached(cacheKeyStr);
    if (cached) {
      return res.json(cached);
    }

    const districts = await District.find({ state })
      .select('district_id name_en name_hi')
      .sort({ name_en: 1 })
      .lean();

    const result = {
      state,
      districts: districts.map(d => ({
        id: d.district_id,
        name_en: d.name_en,
        name_hi: d.name_hi
      }))
    };

    await setCached(cacheKeyStr, result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/districts/:id/summary?month=YYYY-MM
router.get('/:id/summary', async (req, res, next) => {
  try {
    const { id } = req.params;
    const month = req.query.month;

    let metric;
    if (month) {
      metric = await DistrictMetric.findOne({ district_id: id, month })
        .populate('source_snapshot_id', 'fetched_at')
        .lean();
    } else {
      // Get latest month
      metric = await DistrictMetric.findOne({ district_id: id })
        .sort({ month: -1 })
        .populate('source_snapshot_id', 'fetched_at')
        .lean();
    }

    if (!metric) {
      return res.status(404).json({ error: 'No data found for this district' });
    }

    const district = await District.findOne({ district_id: id })
      .select('name_en name_hi')
      .lean();

    res.json({
      district_id: id,
      district_name: district?.name_en || '',
      district_name_hi: district?.name_hi || '',
      month: metric.month,
      metrics: metric.metrics,
      last_updated: metric.source_snapshot_id?.fetched_at || metric.updatedAt
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/districts/:id/metrics?from=YYYY-MM&to=YYYY-MM
router.get('/:id/metrics', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { from, to } = req.query;

    const query = { district_id: id };
    if (from || to) {
      query.month = {};
      if (from) query.month.$gte = from;
      if (to) query.month.$lte = to;
    }

    const metrics = await DistrictMetric.find(query)
      .select('month metrics')
      .sort({ month: 1 })
      .lean();

    // Transform to time series format
    const timeSeries = {
      district_id: id,
      months: metrics.map(m => ({
        month: m.month,
        ...m.metrics
      }))
    };

    res.json(timeSeries);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

