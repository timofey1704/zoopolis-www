'use client'

import MainLayout from '@/components/layouts/MainLayout'
import { Toaster } from 'react-hot-toast'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <Toaster />
      {children}
    </MainLayout>
  )
}
