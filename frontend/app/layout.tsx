import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Zoopolis - защити своего питомца',
  description: 'Zoopolis - защити своего питомца',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className="font-display flex min-h-screen flex-col">
        <Header />
        <Toaster />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
