import React from 'react'
import { useForm } from '@/app/hooks/useForm'
import TextInput from '@/components/ui/TextInput'
import PhoneInput from '@/components/ui/PhoneInput'
import Button from '@/components/ui/Button'
import showToast from '@/components/ui/showToast'
import useUserStore from '@/app/store/userStore'
import LocationSelect from '@/components/selectors/LocationSelector'

const validationRules = {
  firstName: { required: true },
  lastName: { required: false },
  phone_number: { required: true },
  email: { required: true },
  city: { required: true },
  address: { required: false },
  telegram_id: { required: false },
}

const ContactForm = () => {
  const { user, setUser } = useUserStore()

  const { values, handleChange, handleSubmit } = useForm(
    {
      firstName: user?.name || '',
      lastName: user?.surname || '',
      phone_number: user?.phone_number || '',
      email: user?.email || '',
      city: typeof user?.city === 'object' ? user?.city : null,
      address: user?.address || '',
      telegram_id: user?.telegram_id || '',
    },
    validationRules,
    async values => {
      try {
        const response = await fetch('/api/profile/contacts', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            city: values.city?.id || null,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Ошибка при обновлении данных')
        }

        const result = await response.json()
        setUser(result.user)
        showToast({ type: 'success', message: 'Данные успешно обновлены!' })
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
            <div className="grid grid-cols-1 gap-6 pb-4 md:grid-cols-2">
              <TextInput
                name="firstName"
                value={values.firstName}
                handleChange={handleChange}
                label="Имя"
                placeholder="Ваше имя"
                style="register"
              />
              <TextInput
                name="lastName"
                value={values.lastName}
                handleChange={handleChange}
                label="Фамилия"
                placeholder="Ваша фамилия"
                style="register"
              />
              <TextInput
                name="telegram_id"
                value={values.telegram_id}
                handleChange={handleChange}
                label="ID в Telegram"
                placeholder="Ваш ID в Telegram"
                style="register"
              />
              <TextInput
                name="email"
                value={values.email}
                handleChange={handleChange}
                label="Email"
                placeholder="Ваш email"
                style="register"
              />

              <PhoneInput
                value={values.phone_number}
                handleChange={handleChange}
                operatorsInfo={false}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 pb-4 md:grid-cols-2">
              <LocationSelect
                name="city"
                value={values.city}
                handleChange={handleChange}
                label="Город"
                placeholder="Ваш город проживания"
              />

              <TextInput
                name="address"
                value={values.address}
                handleChange={handleChange}
                label="Адрес"
                placeholder="Ваш адрес проживания"
                style="register"
              />
            </div>
            <div className="flex items-center justify-center">
              <Button
                text="Сохранить"
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

export default ContactForm
