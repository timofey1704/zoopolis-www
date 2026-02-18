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
      title="К сожалению, уровня вашей подписки недостаточно"
      description={
        <>
          <p className="mb-4">
            К сожалению, услуга &quot;{serviceName}&quot; недоступна на вашем тарифе.
          </p>
          <p className="mb-4">
            Для доступа к этой услуге необходимо перейти на один из тарифов:{' '}
            {requiredPlans.map(formatPlanName).join(' или ')}.
          </p>
          <div className="mt-3 flex w-full">
            <Link href="/membership" className="flex-1" onClick={onClose}>
              <div className="from-orange flex w-full cursor-pointer items-center justify-center rounded-xl bg-linear-to-r to-orange-600 py-3 text-white hover:opacity-90">
                Перейти к тарифам
              </div>
            </Link>
          </div>
        </>
      }
      showCancel={false}
      showSubmit={false}
    />
  )
}

export default RejectPopup
