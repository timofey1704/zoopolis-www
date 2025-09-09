import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import { BonusCard } from '../page'
import { formatDate } from '@/lib/utils/dateFormatter'
import Image from 'next/image'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import { AxiosError } from 'axios'
import showToast from '@/components/ui/showToast'
import Button from '@/components/ui/Button'

interface BonusSidebarProps {
  isOpen: boolean
  onClose: () => void
  bonus: BonusCard
}

interface BonusApplyResponse {
  success: boolean
  message: string
}

interface BonusApplyError {
  message: string
}

const BonusHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex items-center justify-between border-b p-4">
    <h2 className="text-xl font-semibold">Детали бонуса</h2>
    <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100" aria-label="Закрыть">
      <IoClose className="h-6 w-6" />
    </button>
  </div>
)

const BonusImage: React.FC<{ url: string; alt: string }> = ({ url, alt }) => (
  <div className="relative h-[200px] w-full overflow-hidden rounded-xl">
    <Image
      src={url}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </div>
)

const InfoBlock: React.FC<{ label: string; value: string; onClick?: () => void }> = ({
  label,
  value,
  onClick,
}) => (
  <div
    className={`rounded-lg bg-gray-50 p-4 ${
      onClick ? 'cursor-pointer transition-colors hover:bg-gray-100' : ''
    }`}
    onClick={onClick}
  >
    <p className="text-sm text-gray-600">{label}:</p>
    <div className="flex items-center gap-2">
      <p className="font-medium">{value}</p>
      {onClick && (
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
      )}
    </div>
  </div>
)

export default function Sidebar({ isOpen, onClose, bonus }: BonusSidebarProps) {
  const { mutate: applyBonus, isLoading } = useClientFetch<
    BonusApplyResponse,
    null,
    AxiosError<BonusApplyError>
  >(`/account/bonuses/${bonus.id}/apply/`, {
    method: 'POST',
    mutationOptions: {
      onSuccess: data => {
        if (data.success) {
          showToast({
            type: 'success',
            message: 'Бонус успешно применен',
          })
          onClose()
        }
      },
      onError: error => {
        const errorMessage = error.response?.data?.message || 'Ошибка применения бонуса'
        showToast({
          type: 'error',
          message: errorMessage,
        })
        if (error.response?.status === 403) {
          onClose()
        }
      },
    },
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* затемнение фона */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black"
          />

          {/* сайдбар */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md rounded-l-2xl bg-white shadow-xl"
          >
            <div className="flex h-full flex-col">
              <BonusHeader onClose={onClose} />

              {/* контент */}
              <div className="flex-1 space-y-6 overflow-y-auto p-4">
                {bonus.imageURL && <BonusImage url={bonus.imageURL} alt={bonus.name} />}

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">{bonus.name}</h3>

                  {bonus.code && (
                    <InfoBlock
                      label="Промокод"
                      value={bonus.code}
                      onClick={() => {
                        navigator.clipboard.writeText(bonus.code)
                        showToast({
                          type: 'success',
                          message: 'Промокод скопирован',
                        })
                      }}
                    />
                  )}

                  <InfoBlock
                    label="Период действия"
                    value={`${formatDate(bonus.start_date)} - ${formatDate(bonus.end_date)}`}
                  />

                  <div>
                    <p className="mb-2 text-sm text-gray-600">Описание:</p>
                    <p className="text-gray-800">{bonus.description}</p>
                  </div>
                </div>
              </div>

              {/* футер */}
              <div className="border-t p-4">
                <Button
                  onClick={() => applyBonus(null)}
                  disabled={isLoading}
                  className="from-orange w-full cursor-pointer rounded-[20px] bg-gradient-to-r to-orange-600 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  text={isLoading ? 'Применение...' : 'Применить бонус'}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
