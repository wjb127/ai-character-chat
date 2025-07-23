'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'

export default function NavAuth() {
  const { user, signOut: supabaseSignOut } = useAuth()
  const { data: session } = useSession()

  const handleSignOut = async () => {
    if (session) {
      await signOut({ callbackUrl: '/' })
    } else if (user) {
      await supabaseSignOut()
    }
  }

  if (user || session) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{session?.user?.email || user?.email}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-purple-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>로그아웃</span>
        </button>
      </div>
    )
  }

  return (
    <Link
      href="/auth"
      className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
    >
      로그인
    </Link>
  )
}