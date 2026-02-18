import { useRouter } from 'next/navigation'
import { IoExitOutline } from 'react-icons/io5'
import useUserStore from '@/app/store/userStore'
import { signOut } from 'next-auth/react'
import Button from './ui/Button'

const Logout = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout/`, {
        method: 'POST',
        credentials: 'include',
      })

      await signOut({ redirect: false })

      useUserStore.getState().logout()

      router.replace('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <Button
      text="Выйти из аккаунта"
      leftIcon={<IoExitOutline className="mr-1 h-5 w-5" />}
      className="flex w-full items-center rounded-lg px-4 py-4 font-medium text-gray-600 transition-colors hover:bg-gray-100"
      size="sm"
      variant="text"
      onClick={handleLogout}
    />
  )
}

export default Logout
