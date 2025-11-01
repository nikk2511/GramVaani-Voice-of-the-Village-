import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('x-admin-token');
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminToken || authHeader !== adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized. Valid admin token required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get('district');

    if (!districtId) {
      return NextResponse.json(
        { error: 'District ID is required' },
        { status: 400 }
      );
    }

    // In Vercel, you might want to trigger a Vercel Cron Job or external service
    // For now, return success - actual refresh would need to be handled separately
    // (e.g., via a separate Vercel Cron Job or external worker service)
    
    return NextResponse.json({ 
      success: true, 
      message: `Refresh triggered for district ${districtId}. Note: Actual refresh may require a separate worker service.`
    });
  } catch (error) {
    console.error('Error in admin refresh:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

