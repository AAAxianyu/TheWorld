
import { useState, useEffect } from 'react'
import { lumi } from '../lib/lumi'

// 使用 SDK 提供的 User 类型，或者定义一个更通用的类型
type User = Record<string, unknown> // 临时使用通用类型，避免类型冲突

export function useAuth() {
  const [user, setUser] = useState<User | null>(lumi.auth.user)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检查现有会话
    const checkSession = () => {
      const existingUser = lumi.auth.user
      const isLoggedIn = lumi.auth.isAuthenticated

      if (isLoggedIn && existingUser) {
        setUser(existingUser)
      }
      setLoading(false)
    }

    checkSession()

    // 监听状态变化
    const unsubscribe = lumi.auth.onAuthChange((newUser) => {
      setUser(newUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async () => {
    try {
      setLoading(true)
      await lumi.auth.signIn()
    } catch (error) {
      console.error('登录失败:', error)
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await lumi.auth.signOut()
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  return {
    user,
    isAuthenticated: !!user,
    userRole: user?.userRole,
    loading,
    signIn,
    signOut
  }
}
