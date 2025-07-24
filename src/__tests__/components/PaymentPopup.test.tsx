import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PaymentPopup from '@/components/PaymentPopup'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('PaymentPopup', () => {
  const mockOnClose = jest.fn()
  const mockOnEmailSubmitted = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
  })

  it('결제 팝업이 올바르게 렌더링된다', () => {
    render(<PaymentPopup onClose={mockOnClose} onEmailSubmitted={mockOnEmailSubmitted} />)
    
    expect(screen.getByText('프리미엄 업그레이드')).toBeInTheDocument()
    expect(screen.getByText('무제한 대화를 즐겨보세요!')).toBeInTheDocument()
    expect(screen.getByText('베이직')).toBeInTheDocument()
    expect(screen.getByText('프리미엄')).toBeInTheDocument()
    expect(screen.getByText('프로')).toBeInTheDocument()
  })

  it('가격이 올바르게 표시된다', () => {
    render(<PaymentPopup onClose={mockOnClose} onEmailSubmitted={mockOnEmailSubmitted} />)
    
    expect(screen.getByText('₩9,900')).toBeInTheDocument()
    expect(screen.getByText('₩19,900')).toBeInTheDocument()
    expect(screen.getByText('₩39,900')).toBeInTheDocument()
  })

  it('닫기 버튼이 작동한다', async () => {
    const user = userEvent.setup()
    render(<PaymentPopup onClose={mockOnClose} onEmailSubmitted={mockOnEmailSubmitted} />)
    
    const closeButton = screen.getByRole('button', { name: /close/i }) || screen.getByText('X')
    await user.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('나중에 하기 버튼이 작동한다', async () => {
    const user = userEvent.setup()
    render(<PaymentPopup onClose={mockOnClose} onEmailSubmitted={mockOnEmailSubmitted} />)
    
    const laterButton = screen.getByText('나중에 하기')
    await user.click(laterButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('프리미엄 선택 후 이메일 폼이 표시된다', async () => {
    const user = userEvent.setup()
    render(<PaymentPopup onClose={mockOnClose} onEmailSubmitted={mockOnEmailSubmitted} />)
    
    const premiumButton = screen.getByText('프리미엄 선택하기')
    await user.click(premiumButton)
    
    expect(screen.getByText('사전 예약 신청')).toBeInTheDocument()
    expect(screen.getByText('서비스 준비 중입니다')).toBeInTheDocument()
    expect(screen.getByLabelText('이메일 주소')).toBeInTheDocument()
  })

  it('이메일 폼 유효성 검사가 작동한다', async () => {
    const user = userEvent.setup()
    render(<PaymentPopup onClose={mockOnClose} onEmailSubmitted={mockOnEmailSubmitted} />)
    
    // 프리미엄 선택
    const premiumButton = screen.getByText('프리미엄 선택하기')
    await user.click(premiumButton)
    
    // 이메일 없이 제출 시도
    const submitButton = screen.getByText('사전 예약')
    expect(submitButton).toBeDisabled()
    
    // 이메일 입력
    const emailInput = screen.getByLabelText('이메일 주소')
    await user.type(emailInput, 'test@example.com')
    
    // 동의 체크박스 없이는 여전히 비활성화
    expect(submitButton).toBeDisabled()
    
    // 동의 체크박스 체크
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    // 이제 버튼이 활성화됨
    expect(submitButton).toBeEnabled()
  })

  it('이메일 제출이 성공적으로 처리된다', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    })

    render(<PaymentPopup onClose={mockOnClose} onEmailSubmitted={mockOnEmailSubmitted} />)
    
    // 프리미엄 선택
    const premiumButton = screen.getByText('프리미엄 선택하기')
    await user.click(premiumButton)
    
    // 이메일 입력
    const emailInput = screen.getByLabelText('이메일 주소')
    await user.type(emailInput, 'test@example.com')
    
    // 동의 체크박스 체크
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    // 제출
    const submitButton = screen.getByText('사전 예약')
    await user.click(submitButton)
    
    // API 호출 확인
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/email-collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@example.com' }),
      })
    })
    
    // 성공 메시지 표시 확인
    await waitFor(() => {
      expect(screen.getByText('등록 완료!')).toBeInTheDocument()
    })
    
    // onEmailSubmitted 콜백 호출 확인 (2초 후)
    await waitFor(() => {
      expect(mockOnEmailSubmitted).toHaveBeenCalledTimes(1)
    }, { timeout: 3000 })
  })

  it('이메일 제출 실패 시 에러 메시지가 표시된다', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400
    })
    
    // alert을 모킹
    window.alert = jest.fn()

    render(<PaymentPopup onClose={mockOnClose} onEmailSubmitted={mockOnEmailSubmitted} />)
    
    // 프리미엄 선택
    const premiumButton = screen.getByText('프리미엄 선택하기')
    await user.click(premiumButton)
    
    // 이메일 입력
    const emailInput = screen.getByLabelText('이메일 주소')
    await user.type(emailInput, 'test@example.com')
    
    // 동의 체크박스 체크
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    // 제출
    const submitButton = screen.getByText('사전 예약')
    await user.click(submitButton)
    
    // 에러 알림 확인
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('이메일 등록에 실패했습니다. 다시 시도해주세요.')
    })
  })

  it('중복 이메일 에러가 올바르게 처리된다', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ error: '이미 등록된 이메일 주소입니다.' })
    })
    
    window.alert = jest.fn()

    render(<PaymentPopup onClose={mockOnClose} onEmailSubmitted={mockOnEmailSubmitted} />)
    
    // 프리미엄 선택
    const premiumButton = screen.getByText('프리미엄 선택하기')
    await user.click(premiumButton)
    
    // 이메일 입력
    const emailInput = screen.getByLabelText('이메일 주소')
    await user.type(emailInput, 'duplicate@example.com')
    
    // 동의 체크박스 체크
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    // 제출
    const submitButton = screen.getByText('사전 예약')
    await user.click(submitButton)
    
    // 중복 에러 알림 확인
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('이메일 등록에 실패했습니다. 다시 시도해주세요.')
    })
  })
})