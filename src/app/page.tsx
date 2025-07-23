import Link from 'next/link'
import { MessageCircle, Sparkles, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">AI 캐릭터와</span>{' '}
                  <span className="block text-purple-400 xl:inline">자유롭게 대화하세요</span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  다양한 AI 캐릭터들과 실시간으로 대화할 수 있는 혁신적인 플랫폼입니다. 
                  각각의 고유한 성격과 전문성을 가진 캐릭터들을 만나보세요.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-3">
                  <div className="rounded-md shadow">
                    <Link
                      href="/auth"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      지금 시작하기
                    </Link>
                  </div>
                  <div className="rounded-md shadow">
                    <Link
                      href="/chat"
                      className="w-full flex items-center justify-center px-8 py-3 border border-purple-600 text-base font-medium rounded-md text-purple-600 bg-transparent hover:bg-purple-600 hover:text-white md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      게스트로 체험하기
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-purple-600 to-blue-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-white text-center">
              <Sparkles className="mx-auto h-24 w-24 mb-4" />
              <p className="text-2xl font-bold">AI 캐릭터 챗</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-purple-400 font-semibold tracking-wide uppercase">특징</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              더 나은 AI 대화 경험
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">실시간 채팅</p>
                <p className="ml-16 mt-2 text-base text-gray-300">
                  빠르고 자연스러운 AI와의 실시간 대화를 경험하세요.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">다양한 캐릭터</p>
                <p className="ml-16 mt-2 text-base text-gray-300">
                  각각 고유한 성격과 전문성을 가진 다양한 AI 캐릭터들을 만나보세요.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">개인화된 경험</p>
                <p className="ml-16 mt-2 text-base text-gray-300">
                  사용자 맞춤형 대화와 개인화된 AI 상호작용을 제공합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
