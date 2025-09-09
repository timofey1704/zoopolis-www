'use client'

import React from 'react'
import PricingCard from './components/PricingCard'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import Loader from '@/components/ui/Loader'
import { Membership } from '@/app/types'

const MembershipPage = () => {
  const {
    data: response,
    isLoading,
    error,
  } = useClientFetch<{ memberships: Membership[] }>('/account/memberships/')

  const memberships = response?.memberships || []

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <div>Ошибка загрузки тарифных планов</div>
  }

  return (
    <>
      <h1>ПОДПИСКА</h1>

      {memberships.length === 0 ? (
        <div className="my-8 text-center text-gray-500">
          Пока что тут ничего нет. Следите за обновлениями!
        </div>
      ) : (
        <PricingCard memberships={memberships} />
      )}
    </>
  )
}

export default MembershipPage
