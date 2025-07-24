import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SurveyPopup from '@/components/SurveyPopup'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('SurveyPopup', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
  })

  it('설문 팝업이 올바르게 렌더링된다', () => {
    render(<SurveyPopup onClose={mockOnClose} />)
    
    expect(screen.getByText('기능 선호도 조사')).toBeInTheDocument()
    expect(screen.getByText('어떤 기능이 필요하신가요?')).toBeInTheDocument()
    expect(screen.getByText('새로운 커스터마이징 캐릭터 생성')).toBeInTheDocument()
    expect(screen.getByText('이미지나 영상 시각화')).toBeInTheDocument()
    expect(screen.getByText('19금 컨텐츠')).toBeInTheDocument()
    expect(screen.getByText('다양한 캐릭터')).toBeInTheDocument()
  })

  it('기능 선택이 올바르게 작동한다', async () => {
    const user = userEvent.setup()
    render(<SurveyPopup onClose={mockOnClose} />)
    
    // 첫 번째 기능 선택
    const firstFeature = screen.getByLabelText('새로운 커스터마이징 캐릭터 생성')
    await user.click(firstFeature)
    expect(firstFeature).toBeChecked()
    
    // 두 번째 기능 선택
    const secondFeature = screen.getByLabelText('이미지나 영상 시각화')
    await user.click(secondFeature)
    expect(secondFeature).toBeChecked()
    
    // 첫 번째 기능 선택 해제
    await user.click(firstFeature)
    expect(firstFeature).not.toBeChecked()
    expect(secondFeature).toBeChecked()
  })

  it('자유 입력이 올바르게 작동한다', async () => {
    const user = userEvent.setup()
    render(<SurveyPopup onClose={mockOnClose} />)
    
    const textArea = screen.getByPlaceholderText('원하시는 기능이나 개선사항을 자유롭게 적어주세요...')
    await user.type(textArea, '음성 채팅 기능이 필요합니다')
    
    expect(textArea).toHaveValue('음성 채팅 기능이 필요합니다')
  })

  it('건너뛰기 버튼이 작동한다', async () => {
    const user = userEvent.setup()
    render(<SurveyPopup onClose={mockOnClose} />)
    
    const skipButton = screen.getByText('건너뛰기')
    await user.click(skipButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('닫기 버튼이 작동한다', async () => {
    const user = userEvent.setup()
    render(<SurveyPopup onClose={mockOnClose} />)
    
    const closeButton = screen.getByText('X')
    await user.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('설문 제출이 성공적으로 처리된다', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    })

    render(<SurveyPopup onClose={mockOnClose} />)
    
    // 기능 선택
    const feature1 = screen.getByLabelText('새로운 커스터마이징 캐릭터 생성')
    const feature2 = screen.getByLabelText('다양한 캐릭터')
    await user.click(feature1)
    await user.click(feature2)
    
    // 자유 입력
    const textArea = screen.getByPlaceholderText('원하시는 기능이나 개선사항을 자유롭게 적어주세요...')
    await user.type(textArea, '음성 채팅 기능')
    
    // 제출
    const submitButton = screen.getByText('제출하기')
    await user.click(submitButton)
    
    // API 호출 확인
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFeatures: ['custom_character', 'diverse_characters'],
          customInput: '음성 채팅 기능'
        }),
      })
    })
    
    // 성공 메시지 표시 확인
    await waitFor(() => {
      expect(screen.getByText('제출 완료!')).toBeInTheDocument()
      expect(screen.getByText('소중한 의견을 주셔서 감사합니다. 더 나은 서비스 개발에 반영하겠습니다!')).toBeInTheDocument()
    })
  })

  it('설문 제출 없이도 제출할 수 있다', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    })

    render(<SurveyPopup onClose={mockOnClose} />)
    
    // 아무것도 선택하지 않고 제출
    const submitButton = screen.getByText('제출하기')
    await user.click(submitButton)
    
    // API 호출 확인 (빈 배열과 빈 문자열)
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFeatures: [],
          customInput: ''
        }),
      })
    })
  })

  it('설문 제출 실패 시 에러 메시지가 표시된다', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    })
    
    window.alert = jest.fn()

    render(<SurveyPopup onClose={mockOnClose} />)
    
    // 기능 선택
    const feature = screen.getByLabelText('새로운 커스터마이징 캐릭터 생성')
    await user.click(feature)
    
    // 제출
    const submitButton = screen.getByText('제출하기')
    await user.click(submitButton)
    
    // 에러 알림 확인
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('설문 제출에 실패했습니다. 다시 시도해주세요.')
    })
  })

  it('제출 중 상태가 올바르게 표시된다', async () => {
    const user = userEvent.setup()
    let resolvePromise: (value: Response) => void
    const promise = new Promise(resolve => {
      resolvePromise = resolve
    })
    mockFetch.mockReturnValueOnce(promise)

    render(<SurveyPopup onClose={mockOnClose} />)
    
    // 제출 버튼 클릭
    const submitButton = screen.getByText('제출하기')
    await user.click(submitButton)
    
    // 제출 중 상태 확인
    expect(screen.getByText('제출 중...')).toBeInTheDocument()
    
    // Promise 해결
    resolvePromise!({
      ok: true,
      json: async () => ({ success: true })
    } as Response)
    
    // 성공 상태 확인
    await waitFor(() => {
      expect(screen.getByText('제출 완료!')).toBeInTheDocument()
    })
  })

  it('성공 화면에서 확인 버튼이 작동한다', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    })

    render(<SurveyPopup onClose={mockOnClose} />)
    
    // 제출
    const submitButton = screen.getByText('제출하기')
    await user.click(submitButton)
    
    // 성공 화면에서 확인 버튼 클릭
    await waitFor(() => {
      const confirmButton = screen.getByText('확인')
      return user.click(confirmButton)
    })
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})