import React from 'react'
import { PricingCardProps } from '@/app/types'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import useUserStore from '@/app/store/userStore'

const accountTypeToDisplayName = {
  zooID: 'Зоо ID',
  zooConcierge: 'Зооконсьерж',
  zoopolis: 'Зоополис',
}

const PricingCard = ({ memberships }: PricingCardProps) => {
  const { user } = useUserStore()

  return (
    <div className="my-5 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {memberships.map(membership => (
        <div
          key={membership.id}
          className={`relative flex min-h-[700px] flex-col overflow-hidden rounded-[30px] p-8 transition-all duration-300 hover:my-7 hover:scale-105 hover:shadow-xl ${
            membership.bg_color === '#1c1c29' ? 'text-white' : ''
          } ${accountTypeToDisplayName[user?.account_type as keyof typeof accountTypeToDisplayName] === membership.plan ? 'ring-orange ring-4' : ''}`}
          style={{ backgroundColor: membership.bg_color }}
        >
          <div className="flex-1">
            <div className="mb-3 flex items-center justify-between">
              <h3>{membership.plan}</h3>
              {accountTypeToDisplayName[
                user?.account_type as keyof typeof accountTypeToDisplayName
              ] === membership.plan ? (
                <div className="bg-orange rounded-2xl px-3 py-1 text-sm text-white">Ваш тариф</div>
              ) : membership.is_popular ? (
                <div className="text-orange text-sm">Популярный!</div>
              ) : (
                <div className="text-orange text-sm">Скоро!</div>
              )}
            </div>

            <div className="mb-6 flex items-baseline space-x-2">
              <span className="text-5xl font-bold">{membership.price} BYN</span>
              <span className="text-base">/месяц</span>
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
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default PricingCard
