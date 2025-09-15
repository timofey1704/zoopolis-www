'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useUserStore from '@/app/store/userStore'
import { useSearchParams } from 'next/navigation'

import Link from 'next/link'
import { useForm } from '@/app/hooks/useForm'
import Button from '@/components/ui/Button'
import showToast from '@/components/ui/showToast'
import { signIn } from 'next-auth/react'
import TextInput from '@/components/ui/TextInput'
import PhoneInput from '@/components/ui/PhoneInput'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

const validationRules = {
  name: { required: true },
  surname: { required: true },
  password: { required: true, minLength: 8 },
  privacy_accepted: { required: true },
  promocode: { required: false },
}

const RegisterPage = () => {
  const router = useRouter()
  const { isAuthenticated } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)
  const [verificationStep, setVerificationStep] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  useEffect(() => {
    // проверяем логин
    if (isAuthenticated) {
      // распределяем
      router.replace('/main')
      return
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  const { values, isVisible, handleChange, handleSubmit, togglePasswordVisibility } = useForm(
    {
      name: '',
      surname: '',
      email: '',
      phone_number: '',
      password: '',
      privacy_accepted: false,
      promocode: ref || '',
    },
    validationRules,
    async values => {
      try {
        setIsLoading(true)

        // отправляем запрос на верификацию email
        const verificationResponse = await fetch('/api/register/send-code/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone_number: values.phone_number, promocode: values.promocode }),
        })

        const verificationData = await verificationResponse.json()

        if (!verificationResponse.ok) {
          showToast({ type: 'error', message: verificationData.error || 'Ошибка отправки кода' })
          return
        }

        showToast({ type: 'success', message: 'Код верификации отправлен на ваш номер телефона' })
        setVerificationStep(true)
      } catch (error) {
        console.error(error)
        showToast({ type: 'error', message: 'Ошибка при отправке кода верификации' })
      } finally {
        setIsLoading(false)
      }
    }
  )

  const handleVerificationSubmit = async () => {
    try {
      setIsLoading(true)

      // отправляем код верификации и регистрируем пользователя
      const registerResponse = await fetch('/api/register/verify/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          verification_code: verificationCode,
          promocode: values.promocode,
        }),
      })

      const registerData = await registerResponse.json()

      if (!registerResponse.ok) {
        showToast({ type: 'error', message: registerData.error || 'Ошибка регистрации' })
        return
      }

      // после успешной регистрации входим в систему
      const signInResult = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (signInResult?.error) {
        showToast({ type: 'error', message: signInResult.error })
        return
      }

      showToast({ type: 'success', message: 'Регистрация успешна!' })
      router.push('/profile')
    } catch {
      showToast({ type: 'error', message: 'Ошибка при регистрации' })
    } finally {
      setIsLoading(false)
    }
  }

  if (verificationStep) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-semibold">Пожалуйста, введите код подтверждения</h2>
          <p className="text-gray-600">Мы отправили код подтверждения на {values.phone_number}</p>
        </div>

        <div className="flex justify-center">
          <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            text={isLoading ? 'Подождите...' : 'Подтвердить'}
            className="flex items-center justify-center rounded-2xl bg-black py-3 text-white disabled:opacity-50"
            onClick={handleVerificationSubmit}
            disabled={verificationCode.length !== 6 || isLoading}
          />

          <button
            type="button"
            onClick={e => {
              e.preventDefault()
              handleSubmit(e)
            }}
            className="text-gray-600 hover:text-gray-900"
            disabled={isLoading}
          >
            Отправить код повторно
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-12">
      <div className="z-10 mx-4 flex w-full max-w-4xl flex-col gap-4 rounded-[40px] border-4 border-[#F3F3F3] bg-[#FAFAFA33] p-6 backdrop-blur-[50.9px] md:mx-8">
        <h1 className="py-1 text-2xl">Давайте познакомимся поближе!</h1>
        <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
          <div className="mb-2 space-y-4">
            <TextInput
              value={values.name}
              name="name"
              handleChange={handleChange}
              placeholder="Иван"
              style="register"
              label="Ваше имя"
            />

            <TextInput
              value={values.surname}
              name="surname"
              handleChange={handleChange}
              placeholder="Иванов"
              style="register"
              label="Ваша фамилия"
            />

            <TextInput
              value={values.email}
              name="email"
              handleChange={handleChange}
              placeholder="my_email@gmail.com"
              style="register"
              label="Ваш еmail"
            />

            <PhoneInput
              value={values.phone_number}
              handleChange={handleChange}
              operatorsInfo={false}
            />

            <TextInput
              value={values.password}
              name="password"
              handleChange={handleChange}
              placeholder="Не менее 8 символов"
              style="register"
              label="Ваш пароль"
              isPassword={true}
              isVisible={isVisible}
              togglePasswordVisibility={togglePasswordVisibility}
            />

            <TextInput
              value={values.promocode}
              name="promocode"
              handleChange={handleChange}
              placeholder="QWEZXC12"
              style="register"
              label="Код"
            />
          </div>

          <div className="flex items-start pb-2">
            <input
              type="checkbox"
              id="privacy_accepted"
              name="privacy_accepted"
              onChange={handleChange}
              checked={values.privacy_accepted}
              className="mt-1 cursor-pointer"
            />
            <label
              htmlFor="privacy_accepted"
              className="cursor-pointer px-2 text-gray-700 select-none"
            >
              Даю согласие на обработку моих{' '}
              <Link href="/privacy-policy" className="text-orange/60 hover:underline">
                персональных данных.
              </Link>
            </label>
          </div>
          <div className="my-2 flex w-full items-center justify-center">
            <Button
              text={isLoading ? 'Подождите...' : 'Продолжить'}
              className="flex w-full items-center justify-center rounded-2xl bg-black py-3 text-white"
              type="submit"
              disabled={isLoading}
            />
          </div>
        </form>

        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-gray-300" />
          <p className="shrink-0 px-2 text-gray-500">Или</p>
          <div className="flex-1 border-t border-gray-300" />
        </div>
        <p className="text-center">
          Уже есть аккаунт?{' '}
          <span className="text-orange/60 hover:underline">
            <Link href="/login">Войти</Link>
          </span>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
