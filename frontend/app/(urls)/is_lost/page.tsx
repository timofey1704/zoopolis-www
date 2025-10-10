'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Loader from '@/components/ui/Loader'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import IsLostPopup, { type Plan } from './components/IsLostPopup'

const ACCOUNT_BUTTON_TEXT: Record<Plan, string> = {
  zooID: 'Информация о владельце',
  concierge: 'Отправить координаты',
  zoopolis: 'Отправить координаты',
}

const getButtonText = (plan: Plan | null): string => {
  if (!plan) return 'Отправить координаты'
  return ACCOUNT_BUTTON_TEXT[plan]
}

const IsLostContent = () => {
  const params = useSearchParams()
  const code = params.get('ref')

  const [isLoading, setIsLoading] = useState(true)
  const [isLost, setIsLost] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [ownerInfo, setOwnerInfo] = useState<{ name: string; phone: string } | null>(null)

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
        console.log(data)
        setIsLost(data.is_lost)

        if (data.plan && ['zooID', 'concierge', 'zoopolis'].includes(data.plan)) {
          setPlan(data.plan as Plan)
        }
        if (data.owner_info) {
          setOwnerInfo(data.owner_info)
        }
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
    <div className="flex flex-col p-6">
      {isLost ? (
        <div className="z-10 flex w-full max-w-4xl flex-col rounded-[40px] border-4 border-[#F3F3F3] bg-[#FAFAFA33] p-6 backdrop-blur-[50.9px]">
          <div className="flex flex-col items-center justify-between md:flex-row md:items-center">
            <div className="flex w-full flex-col items-center justify-center">
              <Image
                src="/lost_dog.svg"
                alt="login-dog"
                width={323}
                height={543}
                priority
                className="mr-3 object-contain"
              />

              <h1 className="pb-1 text-center text-2xl font-bold text-black md:text-3xl">
                Этот питомец потерян
              </h1>

              <div className="flex w-full items-center justify-center">
                <Button
                  text={getButtonText(plan)}
                  className="from-orange mt-3 flex w-full items-center justify-center rounded-[20px] bg-gradient-to-r to-orange-600 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-90"
                  type="button"
                  onClick={() => setIsOpen(true)}
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
      {plan && code && (
        <IsLostPopup
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          plan={plan}
          ownerInfo={ownerInfo}
          code={code}
        />
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
