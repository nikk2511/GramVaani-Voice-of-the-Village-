const redis = require('redis');

let client = null;

const connectRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    client = redis.createClient({ url: redisUrl });

    client.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    await client.connect();
    return client;
  } catch (error) {
    console.error('❌ Redis connection error:', error.message);
    throw error;
  }
};

module.exports = connectRedis;

