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
      title="Заявка принята"
      description={
        <>
          <p className="mb-4">Ваша заявка на услугу &quot;{serviceName}&quot; успешно создана.</p>
          <p>В ближайшее время с вами свяжется наш специалист для уточнения деталей.</p>
        </>
      }
      submitText="Отлично"
      onSubmit={onClose}
      showCancel={false}
    />
  )
}

export default SuccessPopup
