#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const fetchService = require('../src/services/fetchService');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mgnrega_viewer';

// Parse command line arguments
const args = process.argv.slice(2);
const stateIndex = args.indexOf('--state');
const monthsIndex = args.indexOf('--months');

const stateCode = stateIndex >= 0 && args[stateIndex + 1] ? args[stateIndex + 1] : process.env.STATE_CODE;
const months = monthsIndex >= 0 && args[monthsIndex + 1] ? parseInt(args[monthsIndex + 1]) : 36;

if (!stateCode) {
  console.error('❌ State code is required. Use --state STATE_CODE or set STATE_CODE in .env');
  process.exit(1);
}

async function run() {
  try {
    console.log(`🚀 Starting initial data load...`);
    console.log(`   State: ${stateCode}`);
    console.log(`   Months: ${months}`);
    
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');

    // Run initial historical load
    await fetchService.initialHistoricalLoad(stateCode, months);

    // Also fetch current data
    await fetchService.fetchAllDistrictsForState(stateCode);

    console.log('✅ Initial load completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Initial load failed:', error);
    process.exit(1);
  }
}

run();

