import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase: ReturnType<typeof createClient> | null = null

// Initialize Supabase client with error handling
try {
  if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey)
  } else {
    console.warn('Supabase environment variables not configured')
  }
} catch (error) {
  console.error('Failed to initialize Supabase:', error)
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('🔵 Email collection API called')
    
    // Parse request body
    let body
    try {
      body = await request.json()
      console.log('📝 Request body received:', { email: body.email ? '***@***' : 'none' })
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError)
      return NextResponse.json(
        { error: '요청 데이터 형식이 올바르지 않습니다.' },
        { status: 400 }
      )
    }

    const { email } = body

    // Validate email
    if (!email) {
      console.log('❌ No email provided')
      return NextResponse.json(
        { error: '이메일 주소를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email)
      return NextResponse.json(
        { error: '유효한 이메일 주소를 입력해주세요.' },
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    if (!supabase) {
      console.log('⚠️ Supabase not configured, returning mock success')
      return NextResponse.json({
        success: true,
        message: '이메일이 성공적으로 등록되었습니다. (개발 모드)',
        data: { id: 'mock-id', email: email.toLowerCase().trim() }
      })
    }

    // Get client info for analytics
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : realIp || null

    console.log('📊 Client info:', { userAgent: userAgent.substring(0, 50), ipAddress })

    // Prepare data for insertion
    const emailData = {
      email: email.toLowerCase().trim(),
      source: 'payment_popup',
      user_agent: userAgent,
      ip_address: ipAddress,
      created_at: new Date().toISOString()
    }

    console.log('💾 Attempting to insert email data')

    // Insert email into database
    const { data, error } = await supabase
      .from('email_collection')
      .insert(emailData)
      .select()

    if (error) {
      console.error('❌ Supabase error:', error)
      
      // Check if it's a duplicate email error
      if (error.code === '23505' || error.message?.includes('duplicate')) {
        console.log('⚠️ Duplicate email attempted:', email)
        return NextResponse.json(
          { error: '이미 등록된 이메일 주소입니다.' },
          { status: 409 }
        )
      }
      
      // Check if table doesn't exist
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        console.error('❌ Database table missing')
        return NextResponse.json(
          { error: '데이터베이스가 설정되지 않았습니다. 관리자에게 문의하세요.' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: '이메일 등록 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    const processingTime = Date.now() - startTime
    console.log(`✅ Email successfully stored in ${processingTime}ms:`, data)

    return NextResponse.json({ 
      success: true, 
      message: '이메일이 성공적으로 등록되었습니다.',
      data: data?.[0] || { email: emailData.email }
    })

  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error(`❌ Email collection error after ${processingTime}ms:`, error)
    
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// GET method for testing
export async function GET() {
  console.log('🔍 Email collection API health check')
  
  const config = {
    supabaseConfigured: !!supabase,
    environment: process.env.NODE_ENV || 'unknown',
    timestamp: new Date().toISOString()
  }
  
  return NextResponse.json({
    status: 'OK',
    message: 'Email collection API is running',
    config
  })
}