import React, { Suspense } from 'react'
import RegisterForm from './components/RegisterForm'
import Loader from '@/components/ui/Loader'

const RegisterPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <RegisterForm />
    </Suspense>
  )
}

export default RegisterPage
