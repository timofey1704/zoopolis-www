'use client'

import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AccountSidebar from '@/components/AccountSidebar'
import Loader from '@/components/ui/Loader'
import useUserStore from '@/app/store/userStore'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isAuthChecked } = useUserStore()

  useEffect(() => {
    if (!isAuthChecked || !user) {
      router.replace('/login')
      return
    }
  }, [isAuthChecked, user, router])

  if (!isAuthChecked || !user) {
    return <Loader />
  }

  const userNavigation = [
    { name: 'Главная', href: '/main', icon: 'main' },
    { name: 'Профиль', href: '/profile', icon: 'profile' },
    { name: 'Услуги', href: '/services', icon: 'services' },
    { name: 'Подписка', href: '/membership', icon: 'membership' },
    { name: 'Карта', href: '/map', icon: 'map' },
    { name: 'Устройства', href: '/devices', icon: 'devices' },
    { name: 'Скидки и бонусы', href: '/bonuses', icon: 'bonuses' },
  ]
  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-[#F3F3F3]">
        <div className="mx-auto max-w-337.5 px-4 pt-8 sm:px-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="w-full shrink-0 md:w-64">
              <div className="sticky top-8">
                {user && <AccountSidebar user={user} navigation={userNavigation} />}
              </div>
            </div>
            <main className="min-w-0 flex-1 px-5">{children}</main>
          </div>
        </div>
      </div>
    </>
  )
}
