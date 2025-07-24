import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: '유효한 이메일 주소를 입력해주세요.' },
        { status: 400 }
      )
    }

    // Get client info for analytics
    const userAgent = request.headers.get('user-agent')
    const forwarded = request.headers.get('x-forwarded-for')
    const ipAddress = forwarded ? forwarded.split(',')[0] : null

    // Insert email into database
    const { data, error } = await supabase
      .from('email_collection')
      .insert({
        email: email.toLowerCase().trim(),
        source: 'payment_popup',
        user_agent: userAgent,
        ip_address: ipAddress
      })
      .select()

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505') {
        return NextResponse.json(
          { error: '이미 등록된 이메일 주소입니다.' },
          { status: 409 }
        )
      }
      
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: '이메일 등록 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: '이메일이 성공적으로 등록되었습니다.',
      data 
    })

  } catch (error) {
    console.error('Email collection error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}