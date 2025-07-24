'use client'

import { useState } from 'react'
import { X, MessageSquare, Check } from 'lucide-react'

interface SurveyPopupProps {
  onClose: () => void
}

export default function SurveyPopup({ onClose }: SurveyPopupProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [customInput, setCustomInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const features = [
    { id: 'custom_character', label: '새로운 커스터마이징 캐릭터 생성' },
    { id: 'visual_content', label: '이미지나 영상 시각화' },
    { id: 'adult_content', label: '19금 컨텐츠' },
    { id: 'diverse_characters', label: '다양한 캐릭터' },
  ]

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFeatures,
          customInput: customInput.trim()
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('설문 제출에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('Survey submission error:', error)
      alert('설문 제출에 실패했습니다. 다시 시도해주세요.')
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">제출 완료!</h2>
          <p className="text-gray-600 mb-6">
            소중한 의견을 주셔서 감사합니다. 더 나은 서비스 개발에 반영하겠습니다!
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">기능 선호도 조사</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">어떤 기능이 필요하신가요?</h3>
          <p className="text-gray-600 text-sm">
            향후 추가하고 싶은 기능을 모두 선택해주세요. (복수선택 가능)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {features.map((feature) => (
              <label
                key={feature.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature.id)}
                  onChange={() => handleFeatureToggle(feature.id)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">{feature.label}</span>
              </label>
            ))}
          </div>

          <div>
            <label htmlFor="custom" className="block text-sm font-medium text-gray-700 mb-2">
              기타 의견 (직접입력)
            </label>
            <textarea
              id="custom"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="원하시는 기능이나 개선사항을 자유롭게 적어주세요..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              건너뛰기
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '제출 중...' : '제출하기'}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          설문은 선택사항이며, 언제든지 건너뛸 수 있습니다.
        </p>
      </div>
    </div>
  )
}