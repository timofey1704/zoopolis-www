import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers/Providers'
import MainLayout from '@/components/layouts/MainLayout'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Zoopolis - Панель управления',
  description: 'Zoopolis - Панель управления',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-display flex min-h-screen flex-col">
        <Providers>
          <MainLayout>
            <Toaster />
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  )
}
