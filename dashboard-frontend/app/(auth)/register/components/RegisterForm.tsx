'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useUserStore from '@/app/store/userStore'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from '@/app/hooks/useForm'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import Button from '@/components/ui/Button'
import showToast from '@/components/ui/showToast'
import TextInput from '@/components/ui/TextInput'
import PhoneInput from '@/components/ui/PhoneInput'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import type { User } from '@/app/types'
import type { AxiosError } from 'axios'

const validationRules = {
  name: { required: true },
  surname: { required: true },
  password: { required: true, minLength: 8 },
  email: { required: true },
  phone_number: { required: true, minLength: 13 },
  privacy_accepted: { required: true },
  promocode: { required: false },
}

type SendCodePayload = { phone_number: string; promocode?: string; email: string }
type VerifyPayload = SendCodePayload & {
  name: string
  surname: string
  password: string
  privacy_accepted: boolean
  verification_code: string
}
type LoginPayload = { email: string; password: string }
type LoginResponse = { message: string; user: User }

const RegisterForm = () => {
  const router = useRouter()
  const { user, setUser } = useUserStore()
  const [initialLoading, setInitialLoading] = useState(true)
  const [verificationStep, setVerificationStep] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  const { mutate: sendCode, isLoading: isSendingCode } = useClientFetch<
    unknown,
    SendCodePayload,
    AxiosError<{ error?: string }>
  >('/register/send-verification/', {
    method: 'POST',
    mutationOptions: {
      onSuccess: () => {
        showToast({ type: 'success', message: 'Код верификации отправлен на ваш номер телефона' })
        setVerificationStep(true)
      },
      onError: error => {
        showToast({
          type: 'error',
          message: error.response?.data?.error ?? 'Ошибка при отправке кода верификации',
        })
      },
    },
  })

  const { mutate: login, isLoading: isLoggingIn } = useClientFetch<
    LoginResponse,
    LoginPayload,
    AxiosError<{ error?: string }>
  >('/login/', {
    method: 'POST',
    mutationOptions: {
      onSuccess: data => {
        setUser(data.user)
        showToast({ type: 'success', message: 'Регистрация успешна!' })
        router.push('/profile')
      },
      onError: () => {
        showToast({ type: 'error', message: 'Вход после регистрации не удался' })
      },
    },
  })

  const { mutate: register, isLoading: isRegistering } = useClientFetch<
    unknown,
    VerifyPayload,
    AxiosError<{ error?: string }>
  >('/register/verify/', {
    method: 'POST',
    mutationOptions: {
      onSuccess: (_, variables) => {
        login({ email: variables.email, password: variables.password })
      },
      onError: error => {
        showToast({
          type: 'error',
          message: error.response?.data?.error ?? 'Ошибка при регистрации',
        })
      },
    },
  })

  useEffect(() => {
    if (user) {
      router.replace('/main')
      return
    }
    const timer = setTimeout(() => setInitialLoading(false), 300)
    return () => clearTimeout(timer)
  }, [user, router])

  const isLoadingStep2 = isRegistering || isLoggingIn

  const { values, isVisible, handleChange, handleSubmit, togglePasswordVisibility, FormProvider } =
    useForm(
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
        sendCode({
          phone_number: values.phone_number,
          promocode: values.promocode || undefined,
          email: values.email,
        })
      }
    )

  const handleVerificationSubmit = () => {
    if (verificationCode.length !== 6) return
    register({
      ...values,
      verification_code: verificationCode,
      promocode: values.promocode || '',
    })
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
            text={isLoadingStep2 ? 'Подождите...' : 'Подтвердить'}
            className="flex items-center justify-center rounded-2xl bg-black py-3 text-white disabled:opacity-50"
            onClick={handleVerificationSubmit}
            disabled={verificationCode.length !== 6 || isLoadingStep2}
          />

          <button
            type="button"
            onClick={e => {
              e.preventDefault()
              handleSubmit(e)
            }}
            className="text-gray-600 hover:text-gray-900"
            disabled={isSendingCode}
          >
            Отправить код повторно
          </button>
        </div>
      </div>
    )
  }

  return (
    <FormProvider>
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
                operatorsInfo={true}
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
                <a
                  href="https://zoopolis.org/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange/60 hover:underline"
                >
                  персональных данных.
                </a>
                <span
                  className="ml-1 text-sm text-red-500"
                  title="Обязательное поле"
                  aria-label="обязательное поле"
                >
                  *
                </span>
              </label>
            </div>
            <div className="my-2 flex w-full items-center justify-center">
              <Button
                text={initialLoading || isSendingCode ? 'Подождите...' : 'Продолжить'}
                className="flex w-full items-center justify-center rounded-2xl bg-black py-3 text-white disabled:opacity-70"
                type="submit"
                disabled={initialLoading || isSendingCode}
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
    </FormProvider>
  )
}

export default RegisterForm
