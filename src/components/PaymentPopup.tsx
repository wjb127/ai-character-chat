'use client'

import { useState } from 'react'
import { X, Crown, Check } from 'lucide-react'

interface PaymentPopupProps {
  onClose: () => void
  onEmailSubmitted: () => void
}

export default function PaymentPopup({ onClose, onEmailSubmitted }: PaymentPopupProps) {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handlePaymentClick = () => {
    setShowEmailForm(true)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !agreed) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/email-collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSubmitted(true)
        // 이메일 수집 완료 후 설문 팝업을 위한 콜백 실행
        setTimeout(() => {
          onEmailSubmitted()
        }, 2000) // 2초 후 설문 팝업 표시
      } else {
        alert('이메일 등록에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('Email submission error:', error)
      alert('이메일 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">등록 완료!</h2>
          <p className="text-gray-600 mb-6">
            모바일 앱 출시 소식을 가장 먼저 받아보실 수 있습니다. 곧 연락드리겠습니다!
          </p>
          <button
            onClick={onClose}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    )
  }

  if (showEmailForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">사전 예약 신청</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">서비스 준비 중입니다</h3>
            <p className="text-gray-600 text-sm">
              현재 모바일 앱을 개발 중입니다. 출시 소식을 가장 먼저 받아보세요!
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일 주소
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="privacy"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="privacy" className="text-sm text-gray-600">
                <span className="font-medium">[필수]</span> 개인정보 수집 및 이용에 동의합니다. 
                수집된 이메일은 서비스 출시 알림 용도로만 사용되며, 언제든지 구독을 취소할 수 있습니다.
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!email || !agreed || isSubmitting}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? '등록 중...' : '사전 예약'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">프리미엄 업그레이드</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">무제한 대화를 즐겨보세요!</h3>
          <p className="text-gray-600">
            10회 무료 체험이 끝났습니다. 프리미엄으로 업그레이드하고 모든 기능을 이용해보세요.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {/* 기본 요금제 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-900">베이직</h4>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">₩9,900</span>
                <span className="text-gray-500 text-sm">/월</span>
              </div>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 월 100회 대화</li>
              <li>• 기본 캐릭터 이용</li>
              <li>• GPT-3.5 모델</li>
            </ul>
          </div>

          {/* 프리미엄 요금제 - 추천 */}
          <div className="border-2 border-purple-500 rounded-lg p-4 bg-purple-50 relative">
            <div className="absolute -top-2 left-4 bg-purple-500 text-white text-xs px-2 py-1 rounded">
              추천
            </div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-900">프리미엄</h4>
              <div className="text-right">
                <span className="text-2xl font-bold text-purple-600">₩19,900</span>
                <span className="text-gray-500 text-sm">/월</span>
              </div>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>무제한 대화</strong></li>
              <li>• 모든 캐릭터 이용</li>
              <li>• GPT-4 + Claude 3.5</li>
              <li>• 커스텀 캐릭터 생성</li>
              <li>• 우선 고객지원</li>
            </ul>
          </div>

          {/* 프로 요금제 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-900">프로</h4>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">₩39,900</span>
                <span className="text-gray-500 text-sm">/월</span>
              </div>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 프리미엄 모든 기능</li>
              <li>• 최신 AI 모델 우선 이용</li>
              <li>• 고급 캐릭터 템플릿</li>
              <li>• API 연동 (개발자용)</li>
            </ul>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            나중에 하기
          </button>
          <button
            onClick={handlePaymentClick}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
          >
            프리미엄 선택하기
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          언제든지 구독을 취소할 수 있습니다. 첫 7일은 무료입니다.
        </p>
      </div>
    </div>
  )
}