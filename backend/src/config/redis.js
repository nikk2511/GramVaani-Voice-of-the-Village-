const redis = require('redis');

let client = null;

const connectRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    client = redis.createClient({ url: redisUrl });

    client.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    client.on('connect', () => {
      console.log('✅ Redis connected');
    });

    await client.connect();
    return client;
  } catch (error) {
    console.error('❌ Redis connection error:', error.message);
    // Continue without Redis (graceful degradation)
    console.warn('⚠️ Continuing without Redis cache');
    return null;
  }
};

const getRedisClient = () => client;

module.exports = connectRedis;
module.exports.getRedisClient = getRedisClient;

