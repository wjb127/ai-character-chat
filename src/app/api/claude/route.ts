import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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

    const conversationHistory: Anthropic.Messages.MessageParam[] = []

    if (messages && Array.isArray(messages)) {
      messages.forEach((msg: Message) => {
        if (msg.role !== 'assistant' || msg.content) {
          conversationHistory.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          })
        }
      })
    }

    conversationHistory.push({
      role: 'user',
      content: message
    })

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      system: `당신은 친근하고 창의적인 AI 어시스턴트입니다. 사용자와 자연스럽고 흥미로운 대화를 나누세요.
      다음과 같은 특성을 가지고 있습니다:
      - 따뜻하고 공감적인 성격
      - 창의적이고 상상력이 풍부함
      - 유머 감각이 있고 재미있는 대화를 만들어감
      - 한국어로 자연스럽게 대화
      - 사용자의 감정과 맥락을 깊이 이해하려고 노력
      - 4컷만화나 스토리텔링에 특화된 능력을 가짐`,
      messages: conversationHistory,
    })

    const aiMessage = response.content[0]

    if (!aiMessage || aiMessage.type !== 'text') {
      return NextResponse.json(
        { error: 'No response from Claude' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: aiMessage.text,
    })

  } catch (error) {
    console.error('Anthropic API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}