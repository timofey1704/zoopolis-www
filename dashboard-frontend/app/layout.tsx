import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers/Providers'
import MainLayout from '@/components/layouts/MainLayout'

export const metadata: Metadata = {
  title: "Zoopolis - Панель управления",
  description: "Zoopolis - Панель управления",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-display flex min-h-screen flex-col">
        <Providers>
          <MainLayout>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  )
}
