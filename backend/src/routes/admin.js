const express = require('express');
const router = express.Router();

// Middleware to check admin token
const authenticateAdmin = (req, res, next) => {
  const token = req.headers['x-admin-token'] || req.query.token;
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken || token !== adminToken) {
    return res.status(401).json({ error: 'Unauthorized. Valid admin token required.' });
  }

  next();
};

// POST /api/v1/admin/refresh?district=ID
router.post('/refresh', authenticateAdmin, async (req, res, next) => {
  try {
    const districtId = req.query.district || req.body.district;

    if (!districtId) {
      return res.status(400).json({ error: 'District ID is required' });
    }

    // Trigger worker to refresh this district
    // In production, you might use a message queue
    const fetchWorker = require('../../worker/src/services/fetchService');
    
    try {
      await fetchWorker.fetchDistrictData(districtId);
      res.json({ 
        success: true, 
        message: `Refresh triggered for district ${districtId}` 
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to refresh district data', 
        message: error.message 
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

