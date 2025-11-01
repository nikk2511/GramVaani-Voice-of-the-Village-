import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getRedisClient } from '@/lib/redis';
import mongoose from 'mongoose';
import RawSnapshot from '@/lib/models/RawSnapshot';

export async function GET() {
  try {
    await connectDB();
    
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    let redisStatus = 'disconnected';
    try {
      const client = await getRedisClient();
      if (client) {
        await client.ping();
        redisStatus = 'connected';
      }
    } catch (error) {
      redisStatus = 'error';
    }

    const lastSnapshot = await RawSnapshot.findOne({ fetch_status: 'success' })
      .sort({ fetched_at: -1 })
      .select('fetched_at state')
      .lean();

    const upstreamStatus = {
      status: 'unknown',
      last_check: null
    };

    return NextResponse.json({
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
    console.error('Error fetching status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

