import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import getDistrictModel from '@/lib/models/District';
import getDistrictMetricModel from '@/lib/models/DistrictMetric';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Get models after connection is established
    const District = getDistrictModel();
    const DistrictMetric = getDistrictMetricModel();
    
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    let metric;
    if (month) {
      metric = await DistrictMetric.findOne({ district_id: id, month })
        .populate('source_snapshot_id', 'fetched_at')
        .lean();
    } else {
      metric = await DistrictMetric.findOne({ district_id: id })
        .sort({ month: -1 })
        .populate('source_snapshot_id', 'fetched_at')
        .lean();
    }

    if (!metric) {
      return NextResponse.json(
        { error: 'No data found for this district' },
        { status: 404 }
      );
    }

    const district = await District.findOne({ district_id: id })
      .select('name_en name_hi')
      .lean();

    return NextResponse.json({
      district_id: id,
      district_name: district?.name_en || '',
      district_name_hi: district?.name_hi || '',
      month: metric.month,
      metrics: metric.metrics,
      last_updated: metric.source_snapshot_id?.fetched_at || metric.updatedAt
    });
  } catch (error) {
    console.error('Error fetching district summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

