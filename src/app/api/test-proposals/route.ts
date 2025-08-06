import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Test if proposals table exists and can be queried
    const { data: proposals, error } = await supabase
      .from('proposals')
      .select('id, project_name, status, created_at')
      .limit(5);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to query proposals table',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Proposals table accessible',
      proposalCount: proposals?.length || 0,
      sampleProposals: proposals || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Proposals test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Proposals test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 