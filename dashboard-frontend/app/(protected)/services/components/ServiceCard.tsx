import React, { useState } from 'react'
import Image from 'next/image'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import { ServiceData } from '../page'
import { AxiosError } from 'axios'
import { formatDate } from '@/lib/utils/dateFormatter'
import Button from '@/components/ui/Button'
import SuccessPopup from './SuccessPopup'
import RejectPopup from './RejectPopup'
import showToast from '@/components/ui/showToast'

interface ServiceRequestResponse {
  success: boolean
  message: string
  required_plans?: string[]
}

const ServiceCard = ({ service }: { service: ServiceData }) => {
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

  const handleServiceRequest = () => {
    requestService(null)
  }

  return (
    <>
      <div className="flex h-full flex-col rounded-3xl border bg-white p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="flex flex-grow flex-col space-y-4">
          {service.imageURL && (
            <Image src={service.imageURL} alt={service.title} width={56} height={56} />
          )}

          <p className="text-sm text-gray-500">до {formatDate(service.actual_before)}</p>
          <h3>{service.title}</h3>
          <p className="text-sm text-gray-500">{service.description}</p>
        </div>

        <Button
          text={!service.is_available ? 'Скоро появится' : isLoading ? 'Отправка...' : 'Заказать'}
          className={`mt-6 flex w-full items-center justify-center rounded-[20px] py-4 font-semibold shadow-lg transition-all duration-200 ${
            service.is_available
              ? 'from-orange cursor-pointer bg-gradient-to-r to-orange-600 text-white hover:opacity-90'
              : 'pointer-events-none bg-gray-200 text-gray-500'
          } disabled:opacity-50`}
          onClick={handleServiceRequest}
          disabled={isLoading || !service.is_available}
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
