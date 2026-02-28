'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useUserStore from '@/app/store/userStore'
import Loader from '@/components/ui/Loader'
import { useForm } from '@/app/hooks/useForm'
import Button from '@/components/ui/Button'
import showToast from '@/components/ui/showToast'
import TextInput from '@/components/ui/TextInput'
import Image from 'next/image'

const validationRules = {
  email: { required: true },
  password: { required: true },
}

const LoginPage = () => {
  const router = useRouter()
  const { user, isAuthChecked } = useUserStore()

  useEffect(() => {
    if (!isAuthChecked) return

    if (user) {
      router.replace('/main')
    }
  }, [isAuthChecked, user])

  if (!isAuthChecked) {
    return <Loader />
  }

  const { values, isVisible, handleChange, handleSubmit, togglePasswordVisibility, FormProvider } =
    useForm(
      {
        email: '',
        password: '',
      },
      validationRules,
      async values => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL

          const loginRes = await fetch(`${API_URL}/login/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(values),
          })

          if (!loginRes.ok) {
            const error = await loginRes.json()
            showToast({ type: 'error', message: error.error })
            return
          }

          const userRes = await fetch(`${API_URL}/user/`, {
            credentials: 'include',
          })

          const user = await userRes.json()
          useUserStore.getState().setUser(user)

          showToast({ type: 'success', message: 'Авторизация успешна!' })
          router.replace('/main')
        } catch {
          showToast({ type: 'error', message: 'Ошибка при входе' })
        }
      }
    )

  return (
    <FormProvider>
      <div className="relative flex h-screen items-center justify-center py-8">
        <Image
          src="/images/login-down.svg"
          alt="login-bg-down"
          width={1500}
          height={1500}
          className="absolute bottom-0 left-0 z-0"
        />
        <Image
          src="/images/login-up.svg"
          alt="login-bg-up"
          priority
          width={1500}
          height={1500}
          className="absolute top-0 right-0 z-0"
        />
        <div className="z-10 mx-4 flex w-full max-w-4xl flex-col gap-4 rounded-[40px] border-4 border-[#F3F3F3] bg-[#FAFAFA33] p-6 backdrop-blur-[50.9px] md:mx-8">
          <form
            className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4"
            onSubmit={handleSubmit}
          >
            <div className="flex w-full flex-col gap-2 md:w-[60%] lg:w-[55%]">
              <h1 className="pb-1 text-center text-2xl font-bold text-black md:text-3xl">ВОЙТИ</h1>
              <TextInput
                value={values.email}
                name="email"
                handleChange={handleChange}
                placeholder="my_email@gmail.com"
                style="register"
                label="Ваш еmail"
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
              <div className="flex flex-row-reverse justify-between pb-2 text-sm">
                <Link
                  href="/password-recovery"
                  className="text-gray-500 transition-colors duration-200 hover:text-orange-600 hover:underline"
                >
                  Забыли пароль?
                </Link>
              </div>
              <div className="flex w-full items-center justify-center">
                <Button
                  text="Войти"
                  className="from-orange mt-3 flex w-full items-center justify-center rounded-[20px] bg-linear-to-r to-orange-600 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-90"
                  type="submit"
                />
              </div>
            </div>
            <div className="hidden w-full items-center justify-center sm:block md:w-[35%] lg:w-[40%]">
              <Image
                src="/images/login-dog.svg"
                alt="login-dog"
                width={323}
                height={543}
                priority
                className="object-contain sm:hidden md:block"
              />
            </div>
          </form>

          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-gray-300" />
            <p className="shrink-0 px-2 text-gray-700">Или</p>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          <p className="text-center text-base font-medium">
            Впервые у нас?{' '}
            <span className="text-orange transition-colors duration-200 hover:underline">
              <Link href="/register">Зарегистрироваться</Link>
            </span>
          </p>
        </div>
      </div>
    </FormProvider>
  )
}

export default LoginPage
