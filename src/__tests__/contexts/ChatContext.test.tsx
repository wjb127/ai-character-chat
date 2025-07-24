import { render, screen, act } from '@testing-library/react'
import { ChatProvider, useChat } from '@/contexts/ChatContext'

// Test component to access context
function TestComponent() {
  const {
    messageCount,
    incrementMessageCount,
    shouldShowPaymentPopup,
    hidePaymentPopup,
    shouldShowSurveyPopup,
    showSurveyPopup,
    hideSurveyPopup,
  } = useChat()

  return (
    <div>
      <div data-testid="message-count">{messageCount}</div>
      <div data-testid="payment-popup">{shouldShowPaymentPopup.toString()}</div>
      <div data-testid="survey-popup">{shouldShowSurveyPopup.toString()}</div>
      <button onClick={incrementMessageCount}>Increment</button>
      <button onClick={hidePaymentPopup}>Hide Payment</button>
      <button onClick={showSurveyPopup}>Show Survey</button>
      <button onClick={hideSurveyPopup}>Hide Survey</button>
    </div>
  )
}

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

describe('ChatContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  it('초기 상태가 올바르게 설정된다', () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    )

    expect(screen.getByTestId('message-count')).toHaveTextContent('0')
    expect(screen.getByTestId('payment-popup')).toHaveTextContent('false')
    expect(screen.getByTestId('survey-popup')).toHaveTextContent('false')
  })

  it('로컬스토리지에서 저장된 값을 로드한다', () => {
    mockLocalStorage.getItem.mockImplementation((key: string) => {
      if (key === 'chatMessageCount') return '5'
      if (key === 'paymentPopupShown') return 'true'
      if (key === 'surveyPopupShown') return 'true'
      return null
    })

    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    )

    expect(screen.getByTestId('message-count')).toHaveTextContent('5')
    expect(screen.getByTestId('payment-popup')).toHaveTextContent('false') // 이미 표시됨
  })

  it('메시지 카운트가 올바르게 증가한다', () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    )

    const incrementButton = screen.getByText('Increment')
    
    act(() => {
      incrementButton.click()
    })

    expect(screen.getByTestId('message-count')).toHaveTextContent('1')
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('chatMessageCount', '1')
  })

  it('10회 메시지 후 결제 팝업이 표시된다', () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    )

    const incrementButton = screen.getByText('Increment')
    
    // 10번 클릭
    for (let i = 0; i < 10; i++) {
      act(() => {
        incrementButton.click()
      })
    }

    expect(screen.getByTestId('message-count')).toHaveTextContent('10')
    expect(screen.getByTestId('payment-popup')).toHaveTextContent('true')
  })

  it('결제 팝업 숨기기가 작동한다', () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    )

    const incrementButton = screen.getByText('Increment')
    const hidePaymentButton = screen.getByText('Hide Payment')
    
    // 10번 클릭하여 팝업 표시
    for (let i = 0; i < 10; i++) {
      act(() => {
        incrementButton.click()
      })
    }

    expect(screen.getByTestId('payment-popup')).toHaveTextContent('true')

    // 팝업 숨기기
    act(() => {
      hidePaymentButton.click()
    })

    expect(screen.getByTestId('payment-popup')).toHaveTextContent('false')
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('paymentPopupShown', 'true')
  })

  it('설문 팝업 표시/숨기기가 작동한다', () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    )

    const showSurveyButton = screen.getByText('Show Survey')
    const hideSurveyButton = screen.getByText('Hide Survey')
    
    // 설문 팝업 표시
    act(() => {
      showSurveyButton.click()
    })

    expect(screen.getByTestId('survey-popup')).toHaveTextContent('true')

    // 설문 팝업 숨기기
    act(() => {
      hideSurveyButton.click()
    })

    expect(screen.getByTestId('survey-popup')).toHaveTextContent('false')
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('surveyPopupShown', 'true')
  })

  it('이미 표시된 팝업은 다시 표시되지 않는다', () => {
    mockLocalStorage.getItem.mockImplementation((key: string) => {
      if (key === 'paymentPopupShown') return 'true'
      if (key === 'surveyPopupShown') return 'true'
      return null
    })

    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    )

    const incrementButton = screen.getByText('Increment')
    const showSurveyButton = screen.getByText('Show Survey')
    
    // 10번 클릭해도 결제 팝업은 표시되지 않음
    for (let i = 0; i < 10; i++) {
      act(() => {
        incrementButton.click()
      })
    }

    expect(screen.getByTestId('payment-popup')).toHaveTextContent('false')

    // 설문 팝업 표시 시도해도 표시되지 않음
    act(() => {
      showSurveyButton.click()
    })

    expect(screen.getByTestId('survey-popup')).toHaveTextContent('false')
  })

  it('useChat을 ChatProvider 외부에서 사용하면 에러가 발생한다', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useChat must be used within a ChatProvider')
    
    consoleSpy.mockRestore()
  })
})