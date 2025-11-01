import redis from 'redis';

const REDIS_URL = process.env.REDIS_URL;

let cached = global.redis;

if (!cached) {
  cached = global.redis = { client: null, promise: null };
}

async function getRedisClient() {
  if (!REDIS_URL) {
    return null;
  }

  if (cached.client && cached.client.isOpen) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = redis.createClient({ url: REDIS_URL })
      .on('error', (err) => {
        console.error('Redis Client Error:', err);
        cached.client = null;
        cached.promise = null;
      })
      .connect()
      .then((client) => {
        cached.client = client;
        return client;
      })
      .catch((err) => {
        cached.promise = null;
        console.error('Redis connection failed:', err);
        return null;
      });
  }

  try {
    return await cached.promise;
  } catch (e) {
    cached.promise = null;
    return null;
  }
}

export { getRedisClient };

