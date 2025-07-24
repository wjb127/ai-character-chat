'use client'

import { useState, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'
import NavAuth from '@/components/NavAuth'
import CharacterSelector from '@/components/CharacterSelector'
import PaymentPopup from '@/components/PaymentPopup'
import SurveyPopup from '@/components/SurveyPopup'
import { defaultCharacters, Character } from '@/lib/characters'
import { useChat } from '@/contexts/ChatContext'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function ChatPage() {
  const { 
    messageCount, 
    incrementMessageCount, 
    shouldShowPaymentPopup, 
    hidePaymentPopup,
    shouldShowSurveyPopup,
    showSurveyPopup,
    hideSurveyPopup
  } = useChat()
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(defaultCharacters[0]) // 기본값: 일론 머스크
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: selectedCharacter.greeting,
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAI, setSelectedAI] = useState<'gpt' | 'claude'>('gpt')
  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character)
    setMessages([
      {
        id: '1',
        content: character.greeting,
        role: 'assistant',
        timestamp: new Date()
      }
    ])
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    // 사용자 메시지 카운트 증가
    incrementMessageCount()

    try {
      const apiEndpoint = selectedAI === 'gpt' ? '/api/chat' : '/api/claude'
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          messages: messages,
          characterId: selectedCharacter.id
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '죄송합니다. 메시지 전송 중 오류가 발생했습니다.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Character Selection */}
      <div className="w-80 bg-white shadow-lg border-r flex-shrink-0">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">캐릭터 선택</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <CharacterSelector
            characters={defaultCharacters}
            selectedCharacter={selectedCharacter}
            onCharacterSelect={handleCharacterSelect}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI 캐릭터 챗</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">현재 캐릭터:</span>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg">
                    <span className="text-lg">{selectedCharacter.emoji}</span>
                    <span className="font-medium">{selectedCharacter.name}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  대화 횟수: {messageCount}/10 (무료)
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">AI 모델:</span>
                <select
                  value={selectedAI}
                  onChange={(e) => setSelectedAI(e.target.value as 'gpt' | 'claude')}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="gpt">GPT-4o</option>
                  <option value="claude">Claude 3.5 Sonnet</option>
                </select>
              </div>
              <NavAuth />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-[70%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white ml-2'
                        : 'bg-gray-300 text-gray-700 mr-2'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-900 shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex flex-row max-w-[70%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 text-gray-700 mr-2">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="rounded-lg p-3 bg-white text-gray-900 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="p-4 bg-white border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>

      {/* Payment Popup */}
      {shouldShowPaymentPopup && (
        <PaymentPopup 
          onClose={hidePaymentPopup} 
          onEmailSubmitted={showSurveyPopup}
        />
      )}

      {/* Survey Popup */}
      {shouldShowSurveyPopup && (
        <SurveyPopup onClose={hideSurveyPopup} />
      )}
    </div>
  )
}