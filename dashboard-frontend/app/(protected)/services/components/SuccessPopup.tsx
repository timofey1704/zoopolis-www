import React from 'react'
import { Dialog } from '@/components/ui/Dialog'

interface SuccessPopupProps {
  isOpen: boolean
  onClose: () => void
  serviceName: string
}

const SuccessPopup = ({ isOpen, onClose, serviceName }: SuccessPopupProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      description={
        <>
          <div className="mb-6 flex justify-center">
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 animate-[scale_0.3s_ease-in-out] rounded-full bg-green-100" />
              <svg
                className="absolute inset-0 animate-[scale_0.3s_ease-in-out_0.1s] text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  className="animate-[dash_0.5s_ease-in-out_0.3s_forwards]"
                  strokeDasharray="30"
                  strokeDashoffset="30"
                />
              </svg>
            </div>
          </div>
          <h1 className="mb-4 text-center">УСЛУГА ОФОРМЛЕНА</h1>
          <p className="text-center text-base">
            Спасибо! В ближайшее время наш менеджер свяжется с Вами
          </p>
        </>
      }
      showSubmit={false}
      showCancel={false}
    />
  )
}

export default SuccessPopup
