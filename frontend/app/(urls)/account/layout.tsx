'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AccountSidebar from '@/components/AccountSidebar'
import Loader from '@/components/ui/Loader'
import { RiUser3Line } from 'react-icons/ri'
import { FaRoute } from 'react-icons/fa'
import { HiOutlineSquaresPlus } from 'react-icons/hi2'
import { IoGitPullRequest } from 'react-icons/io5'
import useUserStore from '@/app/store/userStore'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { isAuthenticated, user } = useUserStore()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/login')
      return
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || !user || isLoading) {
    return <Loader />
  }

  const userNavigation = [
    { name: 'Профиль', href: '/account', icon: RiUser3Line },
    { name: 'Услуги', href: '/account/services', icon: FaRoute },
    { name: 'Подписка', href: '/account/membership', icon: HiOutlineSquaresPlus },
    { name: 'Бонусы', href: '/account/bonuses', icon: IoGitPullRequest },
  ]

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="w-full flex-shrink-0 md:w-64">
            <div className="sticky top-8">
              <AccountSidebar user={user} navigation={userNavigation} />
            </div>
          </div>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
