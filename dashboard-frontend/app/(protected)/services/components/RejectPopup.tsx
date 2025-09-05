import React from 'react'
import { Dialog } from '@/components/ui/Dialog'
import Link from 'next/link'

interface RejectPopupProps {
  isOpen: boolean
  onClose: () => void
  serviceName: string
  requiredPlans: string[]
}

const RejectPopup = ({ isOpen, onClose, serviceName, requiredPlans }: RejectPopupProps) => {
  const formatPlanName = (plan: string) => {
    switch (plan) {
      case 'zooID':
        return 'Зоо ID'
      case 'concierge':
        return 'Зооконсьерж'
      case 'zoopolis':
        return 'Зоополис'
      default:
        return plan
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Недостаточный тариф"
      description={
        <>
          <p className="mb-4">
            К сожалению, услуга &quot;{serviceName}&quot; недоступна на вашем тарифе.
          </p>
          <p className="mb-4">
            Для доступа к этой услуге необходимо перейти на один из тарифов:{' '}
            {requiredPlans.map(formatPlanName).join(' или ')}.
          </p>
          <p>
            <Link
              href="/pricing"
              className="text-orange-600 underline hover:text-orange-700"
              onClick={onClose}
            >
              Перейти к тарифам
            </Link>
          </p>
        </>
      }
      submitText="Понятно"
      onSubmit={onClose}
      showCancel={false}
    />
  )
}

export default RejectPopup
