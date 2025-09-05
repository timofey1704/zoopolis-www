'use client'

import React from 'react'
import useUserStore from '@/app/store/userStore'

const DashboardPage = () => {
  const user = useUserStore()

  return <h1>ПРИВЕТ, {user.user?.name}</h1>
}

export default DashboardPage
