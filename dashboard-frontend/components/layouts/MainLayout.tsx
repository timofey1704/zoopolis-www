'use client'

import { useEffect, useState } from 'react'
// import Header from '@/components/Header'
// import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import AccountSidebar from '@/components/AccountSidebar'
import Loader from '@/components/ui/Loader'
import { RiUser3Line } from 'react-icons/ri'
import { FaRoute } from 'react-icons/fa'
import { GoPackageDependents, GoPackageDependencies } from 'react-icons/go'
import { HiOutlineSquaresPlus } from 'react-icons/hi2'
import { IoGitPullRequest } from 'react-icons/io5'
import useUserStore from '@/app/store/userStore'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // const pathname = usePathname()
  // const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register')

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
    { name: 'Главная', href: '/main', icon: 'main' },
    { name: 'Профиль', href: '/profile', icon: 'profile' },
    { name: 'Услуги', href: '/membership', icon: 'services' },
    { name: 'Подписка', href: '/membership', icon: 'membership' },
    { name: 'Карта', href: '/map', icon: 'map' },
    {
      name: 'Устройства',
      href: '/devices',
      icon: 'devices',
    },
    {
      name: 'Скидки и бонусы',
      href: '/bonuses',
      icon: 'bonuses',
    },
  ]

  return (
    <>
      {/* {!isAuthPage && <Header />} */}
      <div className="min-h-screen bg-[#F3F3F3]">
        <div className="mx-auto max-w-[1350px] px-4 pt-8 sm:px-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="w-full flex-shrink-0 md:w-64">
              <div className="sticky top-8">
                <AccountSidebar user={user} navigation={userNavigation} />
              </div>
            </div>
            <main className="min-w-0 flex-1 px-5">{children}</main>
          </div>
        </div>
      </div>
    </>
  )
}
