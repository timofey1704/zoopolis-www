'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Loader from '@/components/ui/Loader'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import showToast from '@/components/ui/showToast'

const IsLostContent = () => {
  const params = useSearchParams()
  const code = params.get('ref')

  const [isLoading, setIsLoading] = useState(true)
  const [isLost, setIsLost] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSendingCoordinates, setIsSendingCoordinates] = useState(false)

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

        // если получили редирект
        if (res.status === 307) {
          const data = await res.json()
          if (data.redirect_url) {
            window.location.href = data.redirect_url
            return
          }
        }

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Произошла ошибка при запросе')
        }

        // если получили данные отображаем статус
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

  const handleSendCoordinates = async () => {
    if (isSendingCoordinates) return

    setIsSendingCoordinates(true)
    try {
      // проверяем поддержку геолокации
      if (!navigator.geolocation) {
        showToast({
          type: 'error',
          message: 'Геолокация не поддерживается вашим браузером',
        })
        return
      }

      // получаем координаты
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        })
      })

      const coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-coordinates/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          coordinates: coordinates,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка при передаче координат')
      }

      showToast({
        type: 'success',
        message: 'Координаты питомца успешно отправлены!',
      })
    } catch (error) {
      console.error('Error sending coordinates:', error)

      // https://developer.mozilla.org/ru/docs/Web/API/Geolocation_API/Using_the_Geolocation_API

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            showToast({
              type: 'error',
              message: 'Пожалуйста, разрешите доступ к геолокации',
            })
            break
          case error.POSITION_UNAVAILABLE:
            showToast({
              type: 'error',
              message: 'Информация о местоположении недоступна',
            })
            break
          case error.TIMEOUT:
            showToast({
              type: 'error',
              message: 'Превышено время ожидания геолокации',
            })
            break
        }
      } else {
        showToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Ошибка при передаче координат',
        })
      }
    } finally {
      setIsSendingCoordinates(false)
    }
  }

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
                  text={isSendingCoordinates ? 'Отправка...' : 'Передать координаты'}
                  className="from-orange mt-3 flex w-full items-center justify-center rounded-[20px] bg-gradient-to-r to-orange-600 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-90"
                  type="button"
                  onClick={handleSendCoordinates}
                  disabled={isSendingCoordinates}
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
