import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import getDistrictModel from '@/lib/models/District';

export const dynamic = 'force-dynamic';

// Sample districts for Uttar Pradesh (UP) - you can expand this
const SAMPLE_DISTRICTS_UP = [
  { district_id: 'UP-001', name_en: 'Agra', name_hi: 'आगरा', state: 'UP' },
  { district_id: 'UP-002', name_en: 'Aligarh', name_hi: 'अलीगढ़', state: 'UP' },
  { district_id: 'UP-003', name_en: 'Allahabad', name_hi: 'इलाहाबाद', state: 'UP' },
  { district_id: 'UP-004', name_en: 'Ambedkar Nagar', name_hi: 'अम्बेडकर नगर', state: 'UP' },
  { district_id: 'UP-005', name_en: 'Amroha', name_hi: 'अमरोहा', state: 'UP' },
  { district_id: 'UP-006', name_en: 'Auraiya', name_hi: 'औरैया', state: 'UP' },
  { district_id: 'UP-007', name_en: 'Azamgarh', name_hi: 'आज़मगढ़', state: 'UP' },
  { district_id: 'UP-008', name_en: 'Baghpat', name_hi: 'बागपत', state: 'UP' },
  { district_id: 'UP-009', name_en: 'Bahraich', name_hi: 'बहराइच', state: 'UP' },
  { district_id: 'UP-010', name_en: 'Ballia', name_hi: 'बलिया', state: 'UP' },
  { district_id: 'UP-011', name_en: 'Balrampur', name_hi: 'बलरामपुर', state: 'UP' },
  { district_id: 'UP-012', name_en: 'Banda', name_hi: 'बांदा', state: 'UP' },
  { district_id: 'UP-013', name_en: 'Barabanki', name_hi: 'बाराबंकी', state: 'UP' },
  { district_id: 'UP-014', name_en: 'Bareilly', name_hi: 'बरेली', state: 'UP' },
  { district_id: 'UP-015', name_en: 'Basti', name_hi: 'बस्ती', state: 'UP' },
  { district_id: 'UP-016', name_en: 'Bijnor', name_hi: 'बिजनौर', state: 'UP' },
  { district_id: 'UP-017', name_en: 'Budaun', name_hi: 'बदायूं', state: 'UP' },
  { district_id: 'UP-018', name_en: 'Bulandshahr', name_hi: 'बुलंदशहर', state: 'UP' },
  { district_id: 'UP-019', name_en: 'Chandauli', name_hi: 'चंदौली', state: 'UP' },
  { district_id: 'UP-020', name_en: 'Chitrakoot', name_hi: 'चित्रकूट', state: 'UP' },
  { district_id: 'UP-021', name_en: 'Deoria', name_hi: 'देवरिया', state: 'UP' },
  { district_id: 'UP-022', name_en: 'Etah', name_hi: 'इटाह', state: 'UP' },
  { district_id: 'UP-023', name_en: 'Etawah', name_hi: 'इटावा', state: 'UP' },
  { district_id: 'UP-024', name_en: 'Faizabad', name_hi: 'फैजाबाद', state: 'UP' },
  { district_id: 'UP-025', name_en: 'Farrukhabad', name_hi: 'फर्रुखाबाद', state: 'UP' },
  { district_id: 'UP-026', name_en: 'Fatehpur', name_hi: 'फतेहपुर', state: 'UP' },
  { district_id: 'UP-027', name_en: 'Firozabad', name_hi: 'फिरोजाबाद', state: 'UP' },
  { district_id: 'UP-028', name_en: 'Gautam Buddha Nagar', name_hi: 'गौतम बुद्ध नगर', state: 'UP' },
  { district_id: 'UP-029', name_en: 'Ghaziabad', name_hi: 'गाजियाबाद', state: 'UP' },
  { district_id: 'UP-030', name_en: 'Ghazipur', name_hi: 'गाजीपुर', state: 'UP' },
  { district_id: 'UP-031', name_en: 'Gonda', name_hi: 'गोंडा', state: 'UP' },
  { district_id: 'UP-032', name_en: 'Gorakhpur', name_hi: 'गोरखपुर', state: 'UP' },
  { district_id: 'UP-033', name_en: 'Hamirpur', name_hi: 'हमीरपुर', state: 'UP' },
  { district_id: 'UP-034', name_en: 'Hardoi', name_hi: 'हरदोई', state: 'UP' },
  { district_id: 'UP-035', name_en: 'Hathras', name_hi: 'हाथरस', state: 'UP' },
  { district_id: 'UP-036', name_en: 'Jalaun', name_hi: 'जालौन', state: 'UP' },
  { district_id: 'UP-037', name_en: 'Jaunpur', name_hi: 'जौनपुर', state: 'UP' },
  { district_id: 'UP-038', name_en: 'Jhansi', name_hi: 'झांसी', state: 'UP' },
  { district_id: 'UP-039', name_en: 'Kannauj', name_hi: 'कन्नौज', state: 'UP' },
  { district_id: 'UP-040', name_en: 'Kanpur Dehat', name_hi: 'कानपुर देहात', state: 'UP' },
  { district_id: 'UP-041', name_en: 'Kanpur Nagar', name_hi: 'कानपुर नगर', state: 'UP' },
  { district_id: 'UP-042', name_en: 'Kaushambi', name_hi: 'कौशाम्बी', state: 'UP' },
  { district_id: 'UP-043', name_en: 'Kushinagar', name_hi: 'कुशीनगर', state: 'UP' },
  { district_id: 'UP-044', name_en: 'Lakhimpur Kheri', name_hi: 'लखीमपुर खीरी', state: 'UP' },
  { district_id: 'UP-045', name_en: 'Lalitpur', name_hi: 'ललितपुर', state: 'UP' },
  { district_id: 'UP-046', name_en: 'Lucknow', name_hi: 'लखनऊ', state: 'UP' },
  { district_id: 'UP-047', name_en: 'Maharajganj', name_hi: 'महाराजगंज', state: 'UP' },
  { district_id: 'UP-048', name_en: 'Mahoba', name_hi: 'महोबा', state: 'UP' },
  { district_id: 'UP-049', name_en: 'Mainpuri', name_hi: 'मैनपुरी', state: 'UP' },
  { district_id: 'UP-050', name_en: 'Mathura', name_hi: 'मथुरा', state: 'UP' },
];

export async function POST(request) {
  try {
    // Optional: Add authentication here
    // const authToken = request.headers.get('authorization');
    // if (authToken !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    await connectDB();
    const District = getDistrictModel();

    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'UP';

    let districtsToSeed = [];
    if (state === 'UP') {
      districtsToSeed = SAMPLE_DISTRICTS_UP;
    } else {
      return NextResponse.json(
        { error: `Sample districts not available for state: ${state}. Please add districts manually or fetch from API.` },
        { status: 400 }
      );
    }

    // Insert or update districts
    const operations = districtsToSeed.map(district => ({
      updateOne: {
        filter: { district_id: district.district_id },
        update: { $set: district },
        upsert: true
      }
    }));

    const result = await District.bulkWrite(operations);

    return NextResponse.json({
      success: true,
      message: `Seeded ${districtsToSeed.length} districts for ${state}`,
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
      total: districtsToSeed.length
    });
  } catch (error) {
    console.error('Error seeding districts:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

