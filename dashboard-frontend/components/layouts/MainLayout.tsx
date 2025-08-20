'use client'

import Header from '@/components/Header'
import { Toaster } from 'react-hot-toast'
import { usePathname } from 'next/navigation'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register')

  return (
    <>
      {!isAuthPage && <Header />}
      <Toaster />
      <main className="flex-grow">{children}</main>
    </>
  )
}
