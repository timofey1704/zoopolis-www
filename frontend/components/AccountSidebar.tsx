'use client'

import React, { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { AccountSidebarProps } from '@/app/types'
import Logout from './Logout'
import noPhoto from '../public/noPhoto.png'
import showToast from './ui/Toast'
import { TbPhotoUp } from 'react-icons/tb'
import { uploadImage } from '@/lib/account/uploadImage'

const AccountSidebar: React.FC<AccountSidebarProps> = ({ user, navigation }) => {
  const pathname = usePathname()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(user?.image || '')

  const handlePhotoChange = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      const file = files[0]

      if (!file.type.startsWith('image/')) {
        showToast({
          type: 'error',
          message: 'Пожалуйста, выберите изображение',
        })
        return
      }

      // создаем превью
      const previewUrl = URL.createObjectURL(file)
      setPreviewUrl(previewUrl)

      // загружаем на сервер
      const response = await uploadImage(file)
      if (response.user?.image) {
        setPreviewUrl(response.user.image)
      }

      showToast({
        type: 'success',
        message: 'Фотография успешно обновлена',
      })

      // очищаем инпут
      e.target.value = ''
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Ошибка при загрузке фотографии',
      })
      console.error('Error handling file:', error)
    }
  }, [])

  if (!user) {
    return null
  }

  const navigationItems = navigation

  const getAccountTypeStyles = (accountType: string) => {
    switch (accountType.toLowerCase()) {
      case 'zooID':
        return 'bg-gray-400 text-white'
      case 'concierge':
        return 'bg-orange/70 text-white'
      case 'zoopolis':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-200'
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex w-full items-center space-x-4 rounded-2xl bg-white p-4 shadow">
        <div className="flex items-center justify-center">
          <div className="group relative w-full cursor-pointer" onClick={handlePhotoChange}>
            <input
              type="file"
              id="image"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <Image
              src={previewUrl || user.image || noPhoto}
              alt="profile image"
              height={84}
              width={84}
              priority
              className="aspect-square w-full rounded-full object-cover md:w-[84px]"
            />
            <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center rounded-full bg-black opacity-0 transition-opacity group-hover:opacity-100">
              <TbPhotoUp className="text-3xl text-white" />
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xl font-bold">{user.name || 'Пользователь'}</p>{' '}
          {user.uuid && <p className="text-sm font-medium text-gray-500">ID: {user.uuid}</p>}
          {user.account_type && (
            <Link
              href="membership/"
              className={`${getAccountTypeStyles(
                user.account_type
              )} flex items-center justify-center rounded-lg px-3 py-1 text-sm`}
            >
              {user.account_type.charAt(0).toUpperCase() + user.account_type.slice(1)}
            </Link>
          )}
        </div>
      </div>

      <div className="w-full rounded-2xl bg-white p-2 shadow md:w-64">
        <nav className="space-y-2">
          {navigationItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive
                    ? 'border-orange translate-x-2 border-r-4 text-gray-600 hover:bg-gray-100'
                    : 'text-gray-600 hover:bg-gray-100'
                } flex items-center rounded-lg p-4 text-sm font-medium transition-all duration-200`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${isActive ? 'text-orange' : 'text-gray-400'}`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="w-full rounded-2xl bg-white p-2 shadow md:w-64">
        <Logout />
      </div>
    </div>
  )
}

export default AccountSidebar
