import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if environment variables are configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return NextResponse.json({
      success: true,
      message: 'Environment variables test',
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      urlPreview: supabaseUrl
        ? supabaseUrl.substring(0, 30) + '...'
        : 'Not set',
      keyPreview: supabaseAnonKey
        ? supabaseAnonKey.substring(0, 10) + '...'
        : 'Not set',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
