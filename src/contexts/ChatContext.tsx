'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ChatContextType {
  messageCount: number
  incrementMessageCount: () => void
  shouldShowPaymentPopup: boolean
  hidePaymentPopup: () => void
  shouldShowSurveyPopup: boolean
  showSurveyPopup: () => void
  hideSurveyPopup: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messageCount, setMessageCount] = useState(0)
  const [paymentPopupShown, setPaymentPopupShown] = useState(false)
  const [surveyPopupVisible, setSurveyPopupVisible] = useState(false)
  const [surveyPopupShown, setSurveyPopupShown] = useState(false)

  // 로컬 스토리지에서 상태 로드
  useEffect(() => {
    const savedCount = localStorage.getItem('chatMessageCount')
    const savedPaymentPopupShown = localStorage.getItem('paymentPopupShown')
    const savedSurveyPopupShown = localStorage.getItem('surveyPopupShown')
    
    if (savedCount) {
      setMessageCount(parseInt(savedCount, 10))
    }
    if (savedPaymentPopupShown === 'true') {
      setPaymentPopupShown(true)
    }
    if (savedSurveyPopupShown === 'true') {
      setSurveyPopupShown(true)
    }
  }, [])

  const incrementMessageCount = () => {
    const newCount = messageCount + 1
    setMessageCount(newCount)
    localStorage.setItem('chatMessageCount', newCount.toString())
  }

  const shouldShowPaymentPopup = messageCount >= 10 && !paymentPopupShown

  const hidePaymentPopup = () => {
    setPaymentPopupShown(true)
    localStorage.setItem('paymentPopupShown', 'true')
  }

  const showSurveyPopup = () => {
    setSurveyPopupVisible(true)
  }

  const hideSurveyPopup = () => {
    setSurveyPopupVisible(false)
    setSurveyPopupShown(true)
    localStorage.setItem('surveyPopupShown', 'true')
  }

  const shouldShowSurveyPopup = surveyPopupVisible && !surveyPopupShown

  return (
    <ChatContext.Provider
      value={{
        messageCount,
        incrementMessageCount,
        shouldShowPaymentPopup,
        hidePaymentPopup,
        shouldShowSurveyPopup,
        showSurveyPopup,
        hideSurveyPopup,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}