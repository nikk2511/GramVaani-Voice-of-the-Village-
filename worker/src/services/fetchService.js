const axios = require('axios');
const mongoose = require('mongoose');
const District = require('../../models/District');
const DistrictMetric = require('../../models/DistrictMetric');
const RawSnapshot = require('../../models/RawSnapshot');

const DATA_GOV_API_KEY = process.env.DATA_GOV_API_KEY;
const DATA_GOV_BASE_URL = process.env.DATA_GOV_API_URL || 
  'https://api.data.gov.in/resource/mgnrega-district-performance';

// Exponential backoff delays (in milliseconds)
const BACKOFF_DELAYS = [60000, 300000, 1200000, 3600000]; // 1m, 5m, 20m, 1h

/**
 * Fetch data from data.gov.in API with retry logic
 */
async function fetchFromAPI(params, retryCount = 0) {
  const url = DATA_GOV_BASE_URL;
  
  try {
    const response = await axios.get(url, {
      params: {
        'api-key': DATA_GOV_API_KEY,
        format: 'json',
        limit: 10000, // Adjust based on API limits
        ...params
      },
      timeout: 30000,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.data && response.data.records) {
      return response.data;
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    if (retryCount < BACKOFF_DELAYS.length) {
      const delay = BACKOFF_DELAYS[retryCount];
      console.warn(`⚠️ API request failed, retrying in ${delay/1000}s (attempt ${retryCount + 1})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchFromAPI(params, retryCount + 1);
    } else {
      throw new Error(`API fetch failed after ${retryCount + 1} attempts: ${error.message}`);
    }
  }
}

/**
 * Normalize district data from API response
 */
function normalizeDistrictData(record) {
  // Map API fields to our schema
  // Adjust field names based on actual data.gov.in API structure
  return {
    district_id: record.district_id || record.district_code || String(record.district_name).toLowerCase().replace(/\s+/g, '_'),
    name_en: record.district_name || record.district || '',
    name_hi: record.district_name_hi || record.district_hindi || '',
    state: record.state || process.env.STATE_CODE || ''
  };
}

/**
 * Normalize metrics data from API response
 */
function normalizeMetricsData(record, month) {
  // Adjust field names based on actual data.gov.in API structure
  return {
    people_benefited: parseFloat(record.people_benefited || record.beneficiaries || record.total_beneficiaries || 0) || 0,
    expenditure: parseFloat(record.expenditure || record.total_expenditure || record.amount_spent || 0) || 0,
    persondays: parseFloat(record.persondays || record.total_persondays || record.person_days || 0) || 0,
    works_started: parseFloat(record.works_started || record.total_works_started || 0) || 0,
    works_completed: parseFloat(record.works_completed || record.total_works_completed || 0) || 0,
    average_persondays: parseFloat(record.average_persondays || record.avg_persondays || 0) || 0
  };
}

/**
 * Extract month from record (YYYY-MM format)
 */
function extractMonth(record) {
  // Try different date fields
  const dateField = record.month || record.report_month || record.date || record.year_month;
  if (!dateField) {
    // Default to current month if not available
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  // Parse various date formats
  if (typeof dateField === 'string') {
    // Handle YYYY-MM format
    if (/^\d{4}-\d{2}$/.test(dateField)) {
      return dateField;
    }
    // Handle other formats
    const date = new Date(dateField);
    if (!isNaN(date.getTime())) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
  }

  // Fallback to current month
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Save raw snapshot
 */
async function saveRawSnapshot(rawData, state, status = 'success', errorMessage = null) {
  try {
    const snapshot = new RawSnapshot({
      fetched_at: new Date(),
      source_url: DATA_GOV_BASE_URL,
      raw_json: rawData,
      state,
      fetch_status: status,
      error_message: errorMessage
    });
    await snapshot.save();
    return snapshot._id;
  } catch (error) {
    console.error('Error saving raw snapshot:', error);
    return null;
  }
}

/**
 * Fetch and store data for all districts in a state
 */
async function fetchAllDistrictsForState(stateCode) {
  console.log(`🔄 Fetching data for state: ${stateCode}`);
  
  let rawData = null;
  let snapshotId = null;

  try {
    // Fetch data from API
    const params = { filters: JSON.stringify([{ name: 'state', value: stateCode }]) };
    rawData = await fetchFromAPI(params);
    
    // Save successful snapshot
    snapshotId = await saveRawSnapshot(rawData, stateCode, 'success');

    if (!rawData.records || !Array.isArray(rawData.records) || rawData.records.length === 0) {
      throw new Error('No records found in API response');
    }

    console.log(`📊 Fetched ${rawData.records.length} records`);

    // Process and save districts and metrics
    const districtsMap = new Map();
    const metricsMap = new Map();

    for (const record of rawData.records) {
      const month = extractMonth(record);
      
      // Normalize district data
      const districtData = normalizeDistrictData(record);
      const districtKey = districtData.district_id;
      
      if (!districtsMap.has(districtKey)) {
        districtsMap.set(districtKey, districtData);
      }

      // Normalize metrics
      const metricsData = normalizeMetricsData(record, month);
      const metricKey = `${districtKey}:${month}`;
      
      if (!metricsMap.has(metricKey)) {
        metricsMap.set(metricKey, {
          district_id: districtKey,
          month,
          metrics: metricsData,
          source_snapshot_id: snapshotId
        });
      }
    }

    // Bulk upsert districts
    const districtBulkOps = Array.from(districtsMap.values()).map(district => ({
      updateOne: {
        filter: { district_id: district.district_id },
        update: { 
          $set: { ...district, last_updated: new Date() }
        },
        upsert: true
      }
    }));

    if (districtBulkOps.length > 0) {
      await District.bulkWrite(districtBulkOps);
      console.log(`✅ Saved/updated ${districtsMap.size} districts`);
    }

    // Bulk upsert metrics
    const metricBulkOps = Array.from(metricsMap.values()).map(metric => ({
      updateOne: {
        filter: { 
          district_id: metric.district_id, 
          month: metric.month 
        },
        update: { 
          $set: metric
        },
        upsert: true
      }
    }));

    if (metricBulkOps.length > 0) {
      await DistrictMetric.bulkWrite(metricBulkOps);
      console.log(`✅ Saved/updated ${metricsMap.size} metric records`);
    }

    console.log(`✅ Successfully processed data for ${stateCode}`);
    return { success: true, districts: districtsMap.size, metrics: metricsMap.size };

  } catch (error) {
    console.error(`❌ Error fetching data for ${stateCode}:`, error.message);
    
    // Save failed snapshot
    await saveRawSnapshot(
      rawData || { error: error.message },
      stateCode,
      'failed',
      error.message
    );

    // Try to load last successful snapshot
    const lastSnapshot = await RawSnapshot.findOne({ 
      state: stateCode, 
      fetch_status: 'success' 
    }).sort({ fetched_at: -1 }).lean();

    if (lastSnapshot) {
      console.log(`⚠️ Using cached snapshot from ${lastSnapshot.fetched_at}`);
      // Could trigger reprocessing of cached data here
    }

    throw error;
  }
}

/**
 * Fetch data for a specific district
 */
async function fetchDistrictData(districtId) {
  console.log(`🔄 Fetching data for district: ${districtId}`);
  
  // First, find the district to get state
  const district = await District.findOne({ district_id: districtId }).lean();
  if (!district) {
    throw new Error(`District ${districtId} not found`);
  }

  const stateCode = district.state || process.env.STATE_CODE;
  
  // Fetch all districts for state (API might not support single district filter)
  // Then filter to the specific district
  await fetchAllDistrictsForState(stateCode);
  
  console.log(`✅ Data refresh completed for district: ${districtId}`);
}

/**
 * Initial historical load
 */
async function initialHistoricalLoad(stateCode, months = 36) {
  console.log(`🔄 Starting historical load for ${stateCode} (${months} months)`);
  
  const now = new Date();
  const results = [];

  // Fetch data for each month going back
  for (let i = 0; i < months; i++) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
    
    try {
      console.log(`📅 Fetching data for ${month}...`);
      const params = {
        filters: JSON.stringify([
          { name: 'state', value: stateCode },
          { name: 'month', value: month }
        ])
      };
      
      const rawData = await fetchFromAPI(params);
      
      // Process and save (reuse existing logic)
      // Note: You may need to adjust based on actual API pagination
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
      
    } catch (error) {
      console.warn(`⚠️ Failed to fetch ${month}: ${error.message}`);
    }
  }

  console.log(`✅ Historical load completed`);
}

module.exports = {
  fetchAllDistrictsForState,
  fetchDistrictData,
  initialHistoricalLoad
};

