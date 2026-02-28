import { useState } from 'react'
import Image from 'next/image'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import { ServiceData } from '../page'
import { AxiosError } from 'axios'
import { formatDate } from '@/lib/utils/dateFormatter'
import Button from '@/components/ui/Button'
import SuccessPopup from './SuccessPopup'
import RejectPopup from './RejectPopup'
import showToast from '@/components/ui/showToast'
import { getProxiedImageUrl } from '@/lib/utils/imageProxy'

interface ServiceRequestResponse {
  success: boolean
  message: string
  required_plans?: string[]
}

interface ServiceCardProps {
  service: ServiceData
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false)
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false)
  const [requiredPlans, setRequiredPlans] = useState<string[]>([])

  const { mutate: requestService, isLoading } = useClientFetch<
    ServiceRequestResponse,
    null,
    AxiosError<ServiceRequestResponse>
  >(`/account/services/${service.id}/request_service/`, {
    method: 'POST',
    mutationOptions: {
      onSuccess: data => {
        if (data.success) {
          setIsSuccessPopupOpen(true)
        }
      },
      onError: (error: AxiosError<ServiceRequestResponse>) => {
        if (error.response?.status === 403 && error.response.data) {
          setIsRejectPopupOpen(true)
          setRequiredPlans(error.response.data.required_plans || [])
        } else {
          showToast({
            type: 'error',
            message: 'Не смогли заказать услугу',
          })
          console.error('Error requesting service:', error)
        }
      },
    },
  })

  //! ZOO-211 разный текст на кнопках в зависимости от доступности
  // услуга НЕ запущена вообще
  const isComingSoon = !service.is_launched

  // услуга запущена, но заблокирована из-за тарифа
  const isBlockedByPlan = service.is_launched && !service.is_available

  const handleButtonClick = () => {
    if (isComingSoon) {
      // услуга не запущена - ничего не делаем
      return
    }

    if (isBlockedByPlan) {
      // если заблокировано из-за тарифа - открываем попап с предложением повысить тариф
      setIsRejectPopupOpen(true)
      setRequiredPlans(service.available_for || [])
    } else if (service.is_available) {
      // если доступна - делаем обычный запрос
      requestService(null)
    }
  }

  // определяем текст кнопки
  const getButtonText = () => {
    if (isLoading) return 'Отправка...'
    if (isComingSoon) return 'Скоро появится'
    if (isBlockedByPlan) return 'Повысить тариф'
    if (service.is_available) return 'Заказать'
    return 'Скоро появится' // fallback
  }

  const buttonText = getButtonText()

  // кнопка активна если услуга доступна ИЛИ заблокирована тарифом (но НЕ "скоро появится")
  const isButtonActive = !isComingSoon && (service.is_available || isBlockedByPlan) && !isLoading
  const isButtonDisabled = !isButtonActive

  return (
    <>
      <div className="flex h-full flex-col rounded-3xl border bg-white p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="flex grow flex-col space-y-4">
          {service.imageURL && (
            <Image
              src={getProxiedImageUrl(service.imageURL)}
              alt={service.title}
              width={56}
              height={56}
            />
          )}

          <p className="text-sm text-gray-500">до {formatDate(service.actual_before)}</p>
          <h3>{service.title}</h3>
          <p className="text-sm text-gray-500">{service.description}</p>
        </div>

        <Button
          text={buttonText}
          className={`mt-6 flex w-full items-center justify-center rounded-[20px] py-4 font-semibold shadow-lg transition-all duration-200 ${
            isButtonActive
              ? isBlockedByPlan
                ? 'cursor-pointer bg-linear-to-r from-blue-500 to-blue-600 text-white hover:opacity-90'
                : 'from-orange cursor-pointer bg-linear-to-r to-orange-600 text-white hover:opacity-90'
              : 'pointer-events-none bg-gray-200 text-gray-500'
          } disabled:opacity-50`}
          onClick={handleButtonClick}
          disabled={isButtonDisabled}
        />
      </div>

      <SuccessPopup
        isOpen={isSuccessPopupOpen}
        onClose={() => setIsSuccessPopupOpen(false)}
        serviceName={service.title}
      />

      <RejectPopup
        isOpen={isRejectPopupOpen}
        onClose={() => setIsRejectPopupOpen(false)}
        serviceName={service.title}
        requiredPlans={requiredPlans}
      />
    </>
  )
}

export default ServiceCard
