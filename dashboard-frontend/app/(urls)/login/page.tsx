'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Loader from '@/components/ui/Loader'
import useUserStore from '@/app/store/userStore'
import { useForm } from '@/app/hooks/useForm'
import Button from '@/components/ui/Button'
import showToast from '@/components/ui/showToast'
import { signIn } from 'next-auth/react'
import TextInput from '@/components/ui/TextInput'

const validationRules = {
  email: { required: true },
  password: { required: true },
}

const LoginPage = () => {
  const router = useRouter()
  const { isAuthenticated } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // проверяем логин
    if (isAuthenticated) {
      // распределяем
      router.replace('/profile')
      return
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  const { values, isVisible, handleChange, handleSubmit, togglePasswordVisibility } = useForm(
    {
      email: '',
      password: '',
    },
    validationRules,
    async values => {
      try {
        const result = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        })

        if (result?.error) {
          showToast({ type: 'error', message: result.error })
          return
        }

        showToast({ type: 'success', message: 'Авторизация успешна!' })
        router.push('/account')
      } catch {
        showToast({ type: 'error', message: 'Ошибка при входе в аккаунт' })
      }
    }
  )

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex w-full max-w-3xl flex-col gap-4 rounded-2xl border border-gray-200 p-6 shadow-lg">
        <div className="flex flex-col items-center py-4">
          <h1 className="pb-1 text-2xl font-medium">Рады видеть Вас снова!</h1>
          <p className="text-center text-base font-medium">
            Пожалуйста, авторизуйтесь, чтобы продолжить
          </p>
        </div>

        <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
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
              className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
            >
              Забыли пароль?
            </Link>
          </div>
          <div className="flex w-full items-center justify-center">
            <Button
              text="Войти"
              className="bg-orange mt-3 flex w-full items-center justify-center rounded-2xl py-3 text-base font-semibold text-white"
              type="submit"
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
          <span className="text-orange/70 hover:underline">
            <Link href="/register">Зарегистрироваться</Link>
          </span>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
