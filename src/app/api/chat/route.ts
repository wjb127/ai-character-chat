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

    const conversationHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: character.systemPrompt
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
      model: 'gpt-4o',
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