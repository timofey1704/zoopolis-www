import React from 'react'
import { PricingCardProps } from '@/app/types'
import Button from './ui/Button'
import Image from 'next/image'

const PricingCard = ({ memberships }: PricingCardProps) => {
  return (
    <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-2 lg:grid-cols-3">
      {memberships.map(membership => (
        <div
          key={membership.id}
          className={`relative overflow-hidden rounded-[30px] p-6`}
          style={{
            backgroundImage: `url(${membership.bg_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Popular badge */}
          {membership.is_popular && (
            <div className="text-orange absolute top-4 right-4 px-3 py-1 text-sm">Популярный!</div>
          )}

          {/* Plan name */}
          <h3 className="mb-2 text-2xl font-bold">{membership.plan}</h3>

          {/* Price */}
          <div className="mb-4 flex items-baseline">
            <span className="text-4xl font-bold">${membership.price}</span>
            <span>/месяц</span>
          </div>

          {/* Description */}
          <p className="mb-4 text-gray-600">{membership.description}</p>
          <div className="mb-4 flex justify-center">
            <div className="w-11/12 border-2 border-b border-white" />
          </div>
          {/* Features */}
          <ul className="mb-8 space-y-3">
            {membership.features.map(feature => (
              <li key={feature.id} className="flex items-center gap-3">
                <Image src="/checkIcon.svg" alt={feature.name} width={20} height={20} />
                {feature.name}
              </li>
            ))}
          </ul>

          {/* Action button */}
          <Button
            text={membership.is_available ? 'Оформить подписку' : 'Временно недоступно'}
            disabled={!membership.is_available}
            className={`w-full ${
              membership.is_available
                ? 'bg-orange hover:bg-orange/80 text-white hover:shadow-none'
                : 'cursor-not-allowed bg-gray-300 text-gray-500'
            }`}
          />
        </div>
      ))}
    </div>
  )
}

export default PricingCard
