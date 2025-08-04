import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    // Check if environment variables are configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Supabase environment variables not configured',
          details: 'Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file'
        },
        { status: 500 }
      )
    }

    if (supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Supabase environment variables contain placeholder values',
          details: 'Please replace the placeholder values in .env.local with your actual Supabase project URL and anon key'
        },
        { status: 500 }
      )
    }

    const supabase = await createClient()
    
    // Test the connection by getting the current user (will be null if not authenticated, but connection works)
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error && error.message !== 'Invalid JWT' && error.message !== 'Auth session missing!') {
      // Invalid JWT and Auth session missing are expected when no user is logged in, so ignore them
      console.error('Supabase connection error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to connect to Supabase',
          details: error.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      authenticated: !!user,
      service: 'Construction Bid Builder',
      timestamp: new Date().toISOString(),
      supabaseUrl: supabaseUrl
    })
    
  } catch (error) {
    console.error('Connection test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}