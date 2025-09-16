import React, { useState } from 'react'
import ValidateCode from './steps/ValidateCode'
import CreatePet from './steps/CreatePet'
import StepIndicator from '@/components/ui/StepIndicator'

interface QRCodeData {
  code: string
  imageURL: string
}

interface CreatePetFormProps {
  onClose: () => void
}

const CreatePetForm: React.FC<CreatePetFormProps> = ({ onClose }) => {
  const [step, setStep] = useState<'validate' | 'create'>('validate')
  const [qrData, setQRData] = useState<QRCodeData | null>(null)

  const steps: Array<{ id: number; name: string; status: 'current' | 'complete' | 'upcoming' }> = [
    {
      id: 1,
      name: 'Проверка кода',
      status: step === 'validate' ? 'current' : step === 'create' ? 'complete' : 'upcoming',
    },
    {
      id: 2,
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
        {step === 'validate' && <ValidateCode onValidated={handleValidated} />}
        {step === 'create' && <CreatePet onClose={onClose} initialQRData={qrData} />}
      </div>
    </div>
  )
}

export default CreatePetForm
