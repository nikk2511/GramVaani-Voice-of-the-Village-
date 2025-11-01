import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getRedisClient } from '@/lib/redis';
import mongoose from 'mongoose';
import getRawSnapshotModel from '@/lib/models/RawSnapshot';

export async function GET() {
  try {
    let mongoStatus = 'disconnected';
    let redisStatus = 'disconnected';
    let lastSnapshot = null;
    
    try {
      await connectDB();
      mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
      
      // Get model after connection is established
      const RawSnapshot = getRawSnapshotModel();
      lastSnapshot = await RawSnapshot.findOne({ fetch_status: 'success' })
        .sort({ fetched_at: -1 })
        .select('fetched_at state')
        .lean();
    } catch (error) {
      console.error('Database connection error:', error.message);
      mongoStatus = 'error';
    }

    try {
      const client = await getRedisClient();
      if (client) {
        await client.ping();
        redisStatus = 'connected';
      }
    } catch (error) {
      redisStatus = 'error';
    }

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
      { 
        status: 'error',
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

