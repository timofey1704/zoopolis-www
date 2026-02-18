import { useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import showToast from '@/components/ui/showToast'
import TextInput from '@/components/ui/TextInput'
import PhoneInput from '@/components/ui/PhoneInput'
import { useForm } from '@/app/hooks/useForm'
import { CopyIcon } from 'lucide-react'
import Button from '@/components/ui/Button'

export type Plan = 'zooID' | 'concierge' | 'zoopolis'

interface IsLostPopupProps {
  isOpen: boolean
  onClose: () => void
  plan: Plan
  ownerInfo?: { name: string; phone: string } | null
  code: string
}

const validationRules = {
  founder_name: { required: true },
  founder_phone: { required: true, minLength: 13 },
}

const IsLostPopup = ({ isOpen, onClose, plan, ownerInfo, code }: IsLostPopupProps) => {
  const [isSendingCoordinates, setIsSendingCoordinates] = useState(false)

  const copyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone)
    showToast({
      type: 'success',
      message: 'Телефон скопирован в буфер обмена',
    })
  }

  const handleSendCoordinates = async (values: { founder_name: string; founder_phone: string }) => {
    if (isSendingCoordinates) return

    setIsSendingCoordinates(true)
    try {
      // проверяем поддержку геолокации
      if (!navigator.geolocation) {
        showToast({
          type: 'error',
          message: 'Геолокация не поддерживается вашим браузером',
        })
        return
      }

      // получаем координаты
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        })
      })

      const coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-coordinates/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          coordinates: coordinates,
          founder_name: values.founder_name,
          founder_phone: values.founder_phone,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка при передаче координат')
      }

      showToast({
        type: 'success',
        message: 'Координаты успешно отправлены!',
      })
    } catch (error) {
      console.error('Error sending coordinates:', error)

      // https://developer.mozilla.org/ru/docs/Web/API/Geolocation_API/Using_the_Geolocation_API

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            showToast({
              type: 'error',
              message: 'Пожалуйста, разрешите доступ к геолокации',
            })
            break
          case error.POSITION_UNAVAILABLE:
            showToast({
              type: 'error',
              message: 'Информация о местоположении недоступна',
            })
            break
          case error.TIMEOUT:
            showToast({
              type: 'error',
              message: 'Превышено время ожидания геолокации',
            })
            break
        }
      } else {
        showToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Ошибка при передаче координат',
        })
      }
    } finally {
      setIsSendingCoordinates(false)
    }
  }

  const { values, handleChange, handleSubmit, setValues } = useForm(
    {
      founder_name: '',
      founder_phone: '',
    },
    validationRules,
    async values => {
      try {
        await handleSendCoordinates(values)
        onClose()
        setValues({ founder_name: '', founder_phone: '' })
      } catch (error) {
        showToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Ошибка при отправке данных',
        })
      }
    }
  )

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      description={
        <>
          {plan === 'zooID' && (
            <>
              <h1 className="py-4 text-center">Информация о владельце</h1>
              {ownerInfo ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">Имя владельца</p>
                    <p className="text-base font-medium">{ownerInfo.name}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">Телефон</p>
                    <button
                      onClick={() => copyPhone(ownerInfo.phone)}
                      className="flex w-full items-center justify-between rounded-md transition-colors hover:bg-gray-100"
                    >
                      <p className="text-base font-medium">{ownerInfo.phone}</p>
                      <CopyIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-base">Загрузка информации о владельце...</p>
              )}
            </>
          )}

          {(plan === 'concierge' || plan === 'zoopolis') && (
            <>
              <h1 className="py-4 text-center">Пожалуйста, оставьте свое имя и номер телефона</h1>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 pb-4 md:grid-cols-2">
                  <TextInput
                    name="founder_name"
                    value={values.founder_name}
                    handleChange={handleChange}
                    label="Имя"
                    placeholder="Как мы можем к Вам обращаться?"
                    style="register"
                  />
                  <PhoneInput
                    name="founder_phone"
                    value={values.founder_phone}
                    handleChange={handleChange}
                    operatorsInfo={false}
                  />
                </div>
                <Button
                  text="Отправить данные"
                  className="bg-orange mt-4 flex w-full items-center justify-center text-white"
                  type="submit"
                />
              </form>
            </>
          )}
        </>
      }
      showSubmit={false}
      showCancel={false}
    />
  )
}

export default IsLostPopup
