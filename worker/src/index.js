require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');
const fetchService = require('./services/fetchService');
const connectRedis = require('./config/redis');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mgnrega_viewer';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Worker connected to MongoDB');
}).catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Connect to Redis
connectRedis().then(() => {
  console.log('✅ Worker connected to Redis');
}).catch((error) => {
  console.warn('⚠️ Redis connection failed, continuing without cache:', error.message);
});

// Schedule monthly data fetch (runs on 1st of every month at 2 AM)
cron.schedule('0 2 1 * *', async () => {
  console.log('🔄 Scheduled monthly fetch triggered');
  try {
    await fetchService.fetchAllDistrictsForState(process.env.STATE_CODE);
  } catch (error) {
    console.error('❌ Scheduled fetch failed:', error);
  }
});

// Manual fetch on startup (optional)
if (process.env.FETCH_ON_STARTUP === 'true') {
  console.log('🔄 Fetching data on startup...');
  fetchService.fetchAllDistrictsForState(process.env.STATE_CODE).catch(error => {
    console.error('❌ Startup fetch failed:', error);
  });
}

console.log('👷 Worker started. Waiting for scheduled tasks...');

