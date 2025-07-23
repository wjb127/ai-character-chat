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
    const { message, messages, characterId = 'helper-assistant' } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Import character data
    const { getCharacterById } = await import('@/lib/characters')
    const character = getCharacterById(characterId)
    
    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
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
      system: character.systemPrompt,
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