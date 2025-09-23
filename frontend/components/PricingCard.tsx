import React from 'react'
import { PricingCardProps } from '@/app/types'
import Button from './ui/Button'
import Image from 'next/image'

const PricingCard = ({ memberships }: PricingCardProps) => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {memberships.map(membership => (
        <div
          key={membership.id}
          className={`relative flex min-h-[700px] flex-col overflow-hidden rounded-[30px] p-8 ${
            membership.bg_color === '#1c1c29' ? 'text-white' : ''
          }`}
          style={{ backgroundColor: membership.bg_color }}
        >
          <div className="flex-1">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-2xl font-bold">{membership.plan}</h3>
              {membership.is_popular ? (
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
                  <Image src="/checkIcon.svg" alt={feature.name} width={20} height={20} />
                  {feature.name}
                </li>
              ))}
            </ul>
          </div>

          <Button
            text={membership.is_available ? 'Оформить подписку' : 'Совсем скоро!'}
            disabled={!membership.is_available}
            className={`w-full ${
              membership.is_available
                ? 'bg-orange hover:bg-orange/80 text-white hover:scale-105 hover:shadow-none'
                : 'bg-orange text-white opacity-55 hover:cursor-not-allowed hover:shadow-none'
            }`}
          />
        </div>
      ))}
    </div>
  )
}

export default PricingCard
