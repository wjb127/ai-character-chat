'use client'

import { useState } from 'react'

export default function ApiTestPage() {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<{
    status: number | string
    statusText?: string
    success: boolean
    data?: unknown
    error?: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [healthStatus, setHealthStatus] = useState<{
    status: string
    message?: string
    config?: unknown
    error?: string
  } | null>(null)

  const testEmailCollection = async () => {
    if (!email) {
      alert('이메일을 입력해주세요')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      console.log('🔵 Testing email collection API with:', email)
      
      const response = await fetch('/api/email-collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      
      console.log('📨 API Response:', {
        status: response.status,
        statusText: response.statusText,
        data
      })

      setResult({
        status: response.status,
        statusText: response.statusText,
        success: response.ok,
        data
      })

    } catch (error) {
      console.error('❌ API Test Error:', error)
      setResult({
        status: 'ERROR',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  const checkApiHealth = async () => {
    try {
      console.log('🔍 Checking API health')
      
      const response = await fetch('/api/email-collection', {
        method: 'GET',
      })

      const data = await response.json()
      
      console.log('🏥 Health Check Response:', data)
      setHealthStatus(data)

    } catch (error) {
      console.error('❌ Health Check Error:', error)
      setHealthStatus({
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">API 테스트 페이지</h1>
        
        {/* Health Check */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">API 상태 확인</h2>
          <button
            onClick={checkApiHealth}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
          >
            API 상태 확인
          </button>
          
          {healthStatus && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">상태 결과:</h3>
              <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(healthStatus, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Email Collection Test */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">이메일 수집 API 테스트</h2>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              테스트 이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={testEmailCollection}
            disabled={loading}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '테스트 중...' : 'API 테스트 실행'}
          </button>

          {/* Result Display */}
          {result && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">API 응답 결과:</h3>
              <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="mb-2">
                  <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                    result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.status} {result.statusText}
                  </span>
                </div>
                <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(result.data || result.error, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Usage Examples */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-2">사용 예시:</h3>
            <div className="space-y-2 text-sm">
              <p><strong>올바른 이메일:</strong> test@example.com</p>
              <p><strong>잘못된 이메일:</strong> invalid-email</p>
              <p><strong>빈 이메일:</strong> (입력하지 않고 테스트)</p>
              <p><strong>중복 이메일:</strong> 같은 이메일로 두 번 테스트</p>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-medium mb-2">디버그 정보</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>현재 URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
          <p><strong>타임스탬프:</strong> {new Date().toISOString()}</p>
          <p><strong>브라우저:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}