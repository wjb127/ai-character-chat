import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface Message {
  content: string
  role: 'user' | 'assistant'
}

export async function POST(request: NextRequest) {
  try {
    const { message, messages } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const conversationHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `당신은 친근하고 도움이 되는 AI 어시스턴트입니다. 사용자와 자연스럽고 engaging한 대화를 나누세요. 
        다음과 같은 특성을 가지고 있습니다:
        - 친근하고 따뜻한 성격
        - 창의적이고 유머러스
        - 도움이 되고 정확한 정보 제공
        - 한국어로 자연스럽게 대화
        - 사용자의 감정과 맥락을 이해하려고 노력`
      }
    ]

    if (messages && Array.isArray(messages)) {
      messages.forEach((msg: Message) => {
        conversationHistory.push({
          role: msg.role,
          content: msg.content
        })
      })
    }

    conversationHistory.push({
      role: 'user',
      content: message
    })

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: conversationHistory,
      max_tokens: 1000,
      temperature: 0.7,
    })

    const aiMessage = completion.choices[0]?.message?.content

    if (!aiMessage) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: aiMessage,
    })

  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}