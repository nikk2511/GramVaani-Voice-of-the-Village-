import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getRedisClient } from '@/lib/redis';
import District from '@/lib/models/District';

const cacheKey = (key) => `mgnrega:${key}`;
const CACHE_TTL = 3600; // 1 hour

async function getCached(key) {
  try {
    const client = await getRedisClient();
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
    const client = await getRedisClient();
    if (!client) return;
    await client.setEx(cacheKey(key), CACHE_TTL, JSON.stringify(data));
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || process.env.STATE_CODE;

    if (!state) {
      return NextResponse.json(
        { error: 'State code is required' },
        { status: 400 }
      );
    }

    const cacheKeyStr = `districts:${state}`;
    const cached = await getCached(cacheKeyStr);
    if (cached) {
      return NextResponse.json(cached);
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
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching districts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

