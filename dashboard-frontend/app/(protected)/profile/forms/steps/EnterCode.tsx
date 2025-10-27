import React from 'react'
import { useForm } from '@/app/hooks/useForm'
import TextInput from '@/components/ui/TextInput'
import Button from '@/components/ui/Button'
import showToast from '@/components/ui/showToast'

const validationRules = {
  code: { required: true },
}

interface QRCodeData {
  code: string
  imageURL: string
}

interface ValidateCodeProps {
  onValidated: (data: QRCodeData) => void
}

const ValidateCode: React.FC<ValidateCodeProps> = ({ onValidated }) => {
  const { values, handleChange, handleSubmit } = useForm(
    { code: '' },
    validationRules,
    async values => {
      try {
        const response = await fetch('/api/profile/pets/validate-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: values.code }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Код не активен или уже использован')
        }

        const result = await response.json()
        showToast({ type: 'success', message: result.message })
        onValidated({
          code: result.code,
          imageURL: result.imageURL,
        }) // переход к следующему шагу после успешной валидации
      } catch (error) {
        showToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Ой, что то пошло не так..',
        })
      }
    }
  )

  return (
    <div className="space-y-3 py-3">
      <div className="overflow-hidden rounded-2xl pl-1">
        <div className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 px-0.5 pb-4 md:grid-cols-1">
              <TextInput
                name="code"
                value={values.code}
                handleChange={handleChange}
                label="Код с кулона"
                placeholder="Введите код с кулона"
                style="register"
              />
            </div>

            <div className="flex items-center justify-center">
              <Button
                text="Продолжить создание питомца"
                className="bg-orange mt-4 flex w-full items-center justify-center text-white"
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ValidateCode
