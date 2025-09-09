import React, { useState } from 'react'
import Image from 'next/image'
import { BonusCard } from '../page'
import { formatDate } from '@/lib/utils/dateFormatter'
import Button from '@/components/ui/Button'
import Sidebar from './Sidebar'

interface BonusItemProps {
  bonus: BonusCard
}

const BonusItem: React.FC<BonusItemProps> = ({ bonus }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleApply = () => {
    console.log('Opening sidebar...')
    setIsSidebarOpen(true)
  }

  return (
    <>
      <div className="flex h-full flex-col rounded-3xl border bg-white p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="flex flex-grow flex-col space-y-4">
          {bonus.imageURL && (
            <div className="relative h-[240px] w-full">
              <Image
                src={bonus.imageURL}
                alt={bonus.name}
                fill
                className="rounded-2xl object-cover"
              />
            </div>
          )}
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              {formatDate(bonus.start_date)} - {formatDate(bonus.end_date)}
            </p>
            <h3>{bonus.name}</h3>
            <p className="text-base text-gray-500">{bonus.description}</p>
          </div>
        </div>
        <Button
          text={!bonus.is_available ? 'Скоро появится' : 'Применить'}
          className={`mt-6 flex w-full items-center justify-center rounded-[20px] py-4 font-semibold shadow-lg transition-all duration-200 ${
            bonus.is_available
              ? 'from-orange cursor-pointer bg-gradient-to-r to-orange-600 text-white hover:opacity-90'
              : 'pointer-events-none bg-gray-200 text-gray-500'
          } disabled:opacity-50`}
          onClick={handleApply}
          disabled={!bonus.is_available}
        />
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} bonus={bonus} />
    </>
  )
}

export default BonusItem
