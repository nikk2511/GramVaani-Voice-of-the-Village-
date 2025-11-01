import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import getDistrictMetricModel from '@/lib/models/DistrictMetric';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Get model after connection is established
    const DistrictMetric = getDistrictMetricModel();
    
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const query = { district_id: id };
    if (from || to) {
      query.month = {};
      if (from) query.month.$gte = from;
      if (to) query.month.$lte = to;
    }

    const metrics = await DistrictMetric.find(query)
      .select('month metrics')
      .sort({ month: 1 })
      .lean();

    const timeSeries = {
      district_id: id,
      months: metrics.map(m => ({
        month: m.month,
        ...m.metrics
      }))
    };

    return NextResponse.json(timeSeries);
  } catch (error) {
    console.error('Error fetching district metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

