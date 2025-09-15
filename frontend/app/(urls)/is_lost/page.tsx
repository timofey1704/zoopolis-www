'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import Loader from '@/components/ui/Loader'

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
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/is-lost/`, { code })

        // если получили редирект (статус 307), браузер автоматически перенаправит
        // если получили данные, отображаем статус
        setIsLost(res.data.is_lost)
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'Произошла ошибка (axios)')
        } else {
          console.error('Unknown error:', err)
          setError('Произошла ошибка (unknown)')
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkIsLost()
  }, [code])

  if (isLoading) return <Loader />

  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {isLost ? (
        <h1 className="text-2xl font-bold text-red-600">Этот питомец отмечен как потерян </h1>
      ) : (
        <h1 className="text-2xl font-bold text-green-600">Этот питомец в безопасности </h1>
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
