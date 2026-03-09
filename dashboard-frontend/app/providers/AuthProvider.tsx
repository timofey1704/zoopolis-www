'use client'

import { useEffect } from 'react'
import useUserStore from '../store/userStore'
import { useClientFetch } from '../hooks/useClientFetch'
import { User } from '../types'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setAuthChecked, logout } = useUserStore()
  const { data, isLoading } = useClientFetch<User>('/user/', {
    queryOptions: { retry: false }, // не пытаемся повторно запросить данные при ошибке
  })

  useEffect(() => {
    if (isLoading) return
    if (data) setUser(data)
    else logout()
    setAuthChecked(true)
  }, [isLoading, data, setUser, logout, setAuthChecked])

  if (isLoading) return null

  return <>{children}</>
}
