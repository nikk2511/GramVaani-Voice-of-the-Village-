const express = require('express');
const router = express.Router();
const DistrictMetric = require('../models/DistrictMetric');
const District = require('../models/District');
const { getRedisClient } = require('../config/redis');

// GET /api/v1/compare?district1=ID&district2=ID&metric=expenditure&from=YYYY-MM&to=YYYY-MM
router.get('/', async (req, res, next) => {
  try {
    const { district1, district2, metric = 'expenditure', from, to } = req.query;

    if (!district1 || !district2) {
      return res.status(400).json({ 
        error: 'Both district1 and district2 parameters are required' 
      });
    }

    const validMetrics = ['people_benefited', 'expenditure', 'persondays', 
                         'works_started', 'works_completed', 'average_persondays'];
    if (!validMetrics.includes(metric)) {
      return res.status(400).json({ 
        error: `Invalid metric. Must be one of: ${validMetrics.join(', ')}` 
      });
    }

    const query = { district_id: { $in: [district1, district2] } };
    if (from || to) {
      query.month = {};
      if (from) query.month.$gte = from;
      if (to) query.month.$lte = to;
    }

    const metrics = await DistrictMetric.find(query)
      .select('district_id month metrics')
      .sort({ month: 1 })
      .lean();

    // Get district names
    const districts = await District.find({ 
      district_id: { $in: [district1, district2] } 
    }).select('district_id name_en name_hi').lean();

    const districtMap = {};
    districts.forEach(d => {
      districtMap[d.district_id] = {
        name_en: d.name_en,
        name_hi: d.name_hi
      };
    });

    // Group by district
    const series = {
      district1: {
        id: district1,
        name: districtMap[district1]?.name_en || '',
        name_hi: districtMap[district1]?.name_hi || '',
        data: []
      },
      district2: {
        id: district2,
        name: districtMap[district2]?.name_en || '',
        name_hi: districtMap[district2]?.name_hi || '',
        data: []
      }
    };

    metrics.forEach(m => {
      const point = {
        month: m.month,
        value: m.metrics[metric] || 0
      };

      if (m.district_id === district1) {
        series.district1.data.push(point);
      } else if (m.district_id === district2) {
        series.district2.data.push(point);
      }
    });

    res.json({
      metric,
      comparison: series
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

