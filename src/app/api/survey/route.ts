import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { selectedFeatures, customInput } = await request.json()

    // Validate input
    if (!Array.isArray(selectedFeatures)) {
      return NextResponse.json(
        { error: '선택된 기능 목록이 올바르지 않습니다.' },
        { status: 400 }
      )
    }

    // Get client info for analytics
    const userAgent = request.headers.get('user-agent')
    const forwarded = request.headers.get('x-forwarded-for')
    const ipAddress = forwarded ? forwarded.split(',')[0] : null

    // Insert survey response into database
    const { data, error } = await supabase
      .from('survey_responses')
      .insert({
        selected_features: selectedFeatures,
        custom_input: customInput || null,
        user_agent: userAgent,
        ip_address: ipAddress
      })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: '설문 응답 저장 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: '설문 응답이 성공적으로 저장되었습니다.',
      data 
    })

  } catch (error) {
    console.error('Survey submission error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}