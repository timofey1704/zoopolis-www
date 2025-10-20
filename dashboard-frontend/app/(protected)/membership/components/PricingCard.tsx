import React from 'react'
import { PricingCardProps } from '@/app/types'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import useUserStore from '@/app/store/userStore'
import showToast from '@/components/ui/showToast'
import { accountTypeToDisplayName, displayNameToAccountType } from '@/app/constants/accountTypes'
import { generateTrackingId } from '../utils/generate-tracking-id'
import { convertPriceToCents, getDisplayPlanName } from '../utils/converters'
import { Membership } from '@/app/types'

const PricingCard = ({ memberships }: PricingCardProps) => {
  const { user } = useUserStore()

  const changeAccountType = async (membership: Membership) => {
    const internalPlan = displayNameToAccountType[membership.plan]
    if (!internalPlan) {
      showToast({
        type: 'error',
        message: 'Неверный план подписки',
      })
      return
    }

    //препроцессинг для бипейда
    const amountInCents = convertPriceToCents(membership.price)

    const response = await fetch('/api/profile/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan: internalPlan,
        amount: amountInCents,
        description: `Оплата подписки Zoopolis - ${getDisplayPlanName(internalPlan)} на 30 дней`,
        tracking_id: generateTrackingId(),
        email: user?.email,
      }),
    })

    if (!response.ok) {
      showToast({
        type: 'error',
        message: 'Не смогли изменить план',
      })
      return
    }

    const responseData = await response.json()

    // проверяем наличие URL для редиректа
    if (responseData.checkoutUrl) {
      // перенаправляем пользователя на страницу оплаты
      window.location.href = responseData.checkoutUrl
    } else {
      showToast({
        type: 'error',
        message: 'Не удалось получить ссылку на оплату',
      })
    }
  }

  return (
    <div className="my-5 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {memberships.map(membership => (
        <div
          key={membership.id}
          className={`relative flex min-h-[700px] flex-col overflow-hidden rounded-[30px] px-8 py-6 transition-all duration-300 hover:my-4 hover:scale-105 hover:shadow-xl ${
            membership.bg_color === '#1c1c29' ? 'text-white' : ''
          } ${accountTypeToDisplayName[user?.account_type as keyof typeof accountTypeToDisplayName] === membership.plan ? 'ring-orange ring-4' : ''}`}
          style={{ backgroundColor: membership.bg_color }}
        >
          <div className="flex-1">
            <div className="mb-2 flex flex-col items-center justify-between">
              {accountTypeToDisplayName[
                user?.account_type as keyof typeof accountTypeToDisplayName
              ] === membership.plan ? (
                <div className="bg-orange mb-2 rounded-2xl px-2 py-1 text-xs text-white">
                  Ваш тариф
                </div>
              ) : membership.is_popular ? (
                <div className="text-orange text-sm">Популярный!</div>
              ) : !membership.is_available ? (
                <div className="text-orange text-sm">Скоро!</div>
              ) : null}
              <h3>{membership.plan}</h3>
            </div>

            <div className="mb-6 flex items-baseline space-x-2">
              <span className="text-5xl font-bold">{membership.price} BYN</span>
              <span className="text-base">/ месяц</span>
            </div>

            <p className="mb-6">{membership.description}</p>
            <div className="mb-6 flex justify-center">
              <div className="w-11/12 border-1 border-b border-white" />
            </div>
            <ul className="mb-4 space-y-4">
              {membership.features.map(feature => (
                <li key={feature.id} className="flex items-center gap-3 text-base">
                  <Image src="/icons/checkIcon.svg" alt={feature.name} width={20} height={20} />
                  {feature.name}
                </li>
              ))}
            </ul>
          </div>

          {accountTypeToDisplayName[user?.account_type as keyof typeof accountTypeToDisplayName] !==
            membership.plan && (
            <Button
              text={membership.is_available ? 'Оформить подписку' : 'Совсем скоро!'}
              disabled={!membership.is_available}
              className={`w-full ${
                membership.is_available
                  ? 'bg-orange hover:bg-orange/80 text-white hover:scale-105 hover:shadow-none'
                  : 'bg-orange text-white opacity-55 hover:cursor-not-allowed hover:shadow-none'
              }`}
              onClick={() => changeAccountType(membership)}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default PricingCard
