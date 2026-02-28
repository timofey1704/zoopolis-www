'use client'

import { useEffect, useState } from 'react'
import useUserStore from '../store/userStore'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setAuthChecked, logout } = useUserStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/`, {
          credentials: 'include',
        })

        if (!res.ok) throw new Error()

        const userData = await res.json()
        setUser(userData)
      } catch {
        logout()
      } finally {
        setAuthChecked(true)
        setLoading(false)
      }
    }

    checkAuth()
  }, [setUser, logout])

  if (loading) return null

  return <>{children}</>
}
