import React from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Button from './ui/Button'
import { IoExitOutline } from 'react-icons/io5'
import useUserStore from '@/app/store/userStore'

const Logout = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // бекенд чистит куки
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      })

      // чистим стор
      useUserStore.getState().logout()

      // если логин был гугловый
      await signOut({ redirect: false })

      // редирект
      router.push('/')
      router.refresh() // обновляем страницу чтобы обновить стейты
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <Button
      text="Выйти из аккаунта"
      leftIcon={<IoExitOutline className="mr-1 h-5 w-5" />}
      className="flex w-full items-center rounded-lg px-4 py-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
      onClick={handleLogout}
    />
  )
}

export default Logout
