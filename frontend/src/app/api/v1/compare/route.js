import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import getDistrictMetricModel from '@/lib/models/DistrictMetric';
import getDistrictModel from '@/lib/models/District';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get models after connection is established
    const DistrictMetric = getDistrictMetricModel();
    const District = getDistrictModel();
    
    const { searchParams } = new URL(request.url);
    const district1 = searchParams.get('district1');
    const district2 = searchParams.get('district2');
    const metric = searchParams.get('metric') || 'expenditure';
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!district1 || !district2) {
      return NextResponse.json(
        { error: 'Both district1 and district2 parameters are required' },
        { status: 400 }
      );
    }

    const validMetrics = ['people_benefited', 'expenditure', 'persondays', 
                         'works_started', 'works_completed', 'average_persondays'];
    if (!validMetrics.includes(metric)) {
      return NextResponse.json(
        { error: `Invalid metric. Must be one of: ${validMetrics.join(', ')}` },
        { status: 400 }
      );
    }

    const query = { district_id: { $in: [district1, district2] } };
    if (from || to) {
      query.month = {};
      if (from) query.month.$gte = from;
      if (to) query.month.$lte = to;
    }

    const metrics = await DistrictMetric.find(query)
      .select('district_id month metrics')
      .sort({ month: 1 })
      .lean();

    const districts = await District.find({ 
      district_id: { $in: [district1, district2] } 
    }).select('district_id name_en name_hi').lean();

    const districtMap = {};
    districts.forEach(d => {
      districtMap[d.district_id] = {
        name_en: d.name_en,
        name_hi: d.name_hi
      };
    });

    const series = {
      district1: {
        id: district1,
        name: districtMap[district1]?.name_en || '',
        name_hi: districtMap[district1]?.name_hi || '',
        data: []
      },
      district2: {
        id: district2,
        name: districtMap[district2]?.name_en || '',
        name_hi: districtMap[district2]?.name_hi || '',
        data: []
      }
    };

    metrics.forEach(m => {
      const point = {
        month: m.month,
        value: m.metrics[metric] || 0
      };

      if (m.district_id === district1) {
        series.district1.data.push(point);
      } else if (m.district_id === district2) {
        series.district2.data.push(point);
      }
    });

    return NextResponse.json({
      metric,
      comparison: series
    });
  } catch (error) {
    console.error('Error comparing districts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

