'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import Loader from '@/components/ui/Loader'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Link from 'next/link'

const IsLostContent = () => {
  const params = useSearchParams()
  const code = params.get('ref')

  const [isLoading, setIsLoading] = useState(true)
  const [isLost, setIsLost] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) {
      setError('Код не найден в параметрах URL')
      setIsLoading(false)
      return
    }

    const checkIsLost = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/is-lost/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        })

        // Если получили редирект
        if (res.status === 307) {
          const data = await res.json()
          if (data.redirect_url) {
            window.location.href = data.redirect_url
            return
          }
        }

        // Если статус не 200, значит ошибка
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Произошла ошибка при запросе')
        }

        // если получили данные, отображаем статус
        const data = await res.json()
        setIsLost(data.is_lost)
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'Произошла ошибка при запросе')
      } finally {
        setIsLoading(false)
      }
    }

    checkIsLost()
  }, [code])

  if (isLoading) return <Loader />

  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      {isLost ? (
        <div className="z-10 flex w-full max-w-4xl flex-col gap-4 rounded-[40px] border-4 border-[#F3F3F3] bg-[#FAFAFA33] p-6 backdrop-blur-[50.9px]">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-center md:gap-4">
            <div className="flex w-full flex-col gap-2">
              <div className="w-full items-center justify-center">
                <Image
                  src="/lost_dog.svg"
                  alt="login-dog"
                  width={323}
                  height={543}
                  priority
                  className="object-contain"
                />
              </div>
              <h1 className="pb-1 text-center text-2xl font-bold text-black md:text-3xl">
                Этот питомец потерян
              </h1>

              <div className="flex w-full items-center justify-center">
                <Button
                  text="Передать координаты"
                  className="from-orange mt-3 flex w-full items-center justify-center rounded-[20px] bg-gradient-to-r to-orange-600 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-90"
                  type="submit"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="z-10 flex w-full max-w-4xl flex-col gap-4 rounded-[40px] border-4 border-[#F3F3F3] bg-[#FAFAFA33] p-6 backdrop-blur-[50.9px]">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-center md:gap-4">
            <div className="flex w-full flex-col gap-2 md:w-[60%] lg:w-[55%]">
              <div className="w-full items-center justify-center">
                <Image
                  src="/login-dog.svg"
                  alt="login-dog"
                  width={323}
                  height={543}
                  priority
                  className="object-contain"
                />
              </div>
              <h1 className="pb-1 text-center text-2xl font-bold text-black md:text-3xl">
                Этот питомец в безопасности
              </h1>

              <div className="flex w-full items-center justify-center">
                <Link
                  href="/"
                  className="from-orange mt-3 flex w-full items-center justify-center rounded-[20px] bg-gradient-to-r to-orange-600 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-90"
                >
                  Вернуться на главную
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const IsLostPetPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <IsLostContent />
    </Suspense>
  )
}

export default IsLostPetPage
