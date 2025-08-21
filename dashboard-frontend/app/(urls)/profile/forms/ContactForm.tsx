import React, { useState } from 'react'
import { useForm } from '@/app/hooks/useForm'
import TextInput from '@/components/ui/TextInput'
import PhoneInput from '@/components/ui/PhoneInput'
import Button from '@/components/ui/Button'
import showToast from '@/components/ui/showToast'
import useUserStore from '@/app/store/userStore'

const validationRules = {
  firstName: { required: true },
  lastName: { required: false },
  phone_number: { required: true },
  email: { required: true },
  city: { required: true },
  address: { required: true },
}

const ContactForm = () => {
  const { user, setUser } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)

  const { values, isVisible, handleChange, handleSubmit } = useForm(
    {
      firstName: user?.name || '',
      lastName: user?.surname || '',
      phone_number: user?.phone_number || '',
      email: user?.email || '',
      city: user?.city || '',
      address: user?.address || '',
    },
    validationRules,
    async values => {
      try {
        const response = await fetch('/api/account/profile/contacts', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
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
      <div className="overflow-hidden rounded-2xl shadow">
        <div className="bg-white p-6 sm:p-8">
          <div className="space-y-4">
            <h3>Контактные данные</h3>
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
                <TextInput
                  name="city"
                  value={values.city}
                  handleChange={handleChange}
                  label="Страна"
                  placeholder="Ваша страна проживания"
                  style="register"
                />
                <TextInput
                  name="address"
                  value={values.address}
                  handleChange={handleChange}
                  label="Город"
                  placeholder="Ваш город проживания"
                  style="register"
                />
              </div>

              <Button
                text="Сохранить изменения"
                className="bg-orange mt-4 flex items-center justify-center text-white"
                type="submit"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactForm
