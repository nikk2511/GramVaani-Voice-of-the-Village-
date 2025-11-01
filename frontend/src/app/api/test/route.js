import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ 
    message: 'Test route works!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown'
  });
}

