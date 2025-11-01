const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { getRedisClient } = require('../config/redis');
const RawSnapshot = require('../models/RawSnapshot');

// GET /api/v1/status
router.get('/', async (req, res, next) => {
  try {
    // Check MongoDB
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    // Check Redis
    let redisStatus = 'disconnected';
    try {
      const client = getRedisClient();
      if (client) {
        await client.ping();
        redisStatus = 'connected';
      }
    } catch (error) {
      redisStatus = 'error';
    }

    // Get last successful fetch
    const lastSnapshot = await RawSnapshot.findOne({ fetch_status: 'success' })
      .sort({ fetched_at: -1 })
      .select('fetched_at state')
      .lean();

    // Get upstream API status (basic check)
    const upstreamStatus = {
      status: 'unknown',
      last_check: null
    };

    res.json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: mongoStatus,
        redis: redisStatus,
        upstream_api: upstreamStatus
      },
      data: {
        last_successful_fetch: lastSnapshot?.fetched_at || null,
        state: lastSnapshot?.state || process.env.STATE_CODE || 'unknown'
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

