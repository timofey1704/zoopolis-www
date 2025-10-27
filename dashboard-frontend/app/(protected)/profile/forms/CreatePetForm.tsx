import React, { useState } from 'react'
import EnterCode from './steps/EnterCode'
import CreatePet from './steps/CreatePet'
import ValidateCode from './steps/EnterCode'
import StepIndicator from '@/components/ui/StepIndicator'

interface QRCodeData {
  code: string
  imageURL: string
}

interface CreatePetFormProps {
  onClose: () => void
}

const CreatePetForm: React.FC<CreatePetFormProps> = ({ onClose }) => {
  const [step, setStep] = useState<'enter' | 'validate' | 'create'>('enter')
  const [qrData, setQRData] = useState<QRCodeData | null>(null)

  const steps: Array<{ id: number; name: string; status: 'current' | 'complete' | 'upcoming' }> = [
    {
      id: 1,
      name: 'Код на кулоне',
      status: step === 'validate' ? 'current' : step === 'create' ? 'complete' : 'upcoming',
    },
    {
      id: 2,
      name: 'Проверяем код',
      status: step === 'validate' ? 'current' : step === 'create' ? 'complete' : 'upcoming',
    },
    {
      id: 3,
      name: 'Создание питомца',
      status: step === 'create' ? 'current' : 'upcoming',
    },
  ]

  const handleValidated = (data: QRCodeData) => {
    setQRData(data)
    setStep('create')
  }

  return (
    <div className="space-y-8 py-3">
      <div className="p-4">
        <StepIndicator steps={steps} />
      </div>
      <div className="space-y-3">
        {step === 'enter' && <EnterCode onValidated={handleValidated} />}
        {step === 'validate' && <ValidateCode onValidated={handleValidated} />}
        {step === 'create' && <CreatePet onClose={onClose} initialQRData={qrData} />}
      </div>
    </div>
  )
}

export default CreatePetForm
