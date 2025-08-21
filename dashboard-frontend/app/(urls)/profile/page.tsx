'use client'

import React, { useState, useRef, useEffect } from 'react'
import ContactForm from './forms/ContactForm'
import PetForm from './forms/PetForm'

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState<'contacts' | 'pets'>('contacts')

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const contactsRef = useRef<HTMLButtonElement>(null)
  const petsRef = useRef<HTMLButtonElement>(null)

  //определяем ширину кнопки чтобы красиво отрисовать индикатор активности

  const updateIndicator = () => {
    if (selectedTab === 'contacts' && contactsRef.current) {
      setIndicatorStyle({
        left: contactsRef.current.offsetLeft,
        width: contactsRef.current.offsetWidth,
      })
    } else if (selectedTab === 'pets' && petsRef.current) {
      setIndicatorStyle({
        left: petsRef.current.offsetLeft,
        width: petsRef.current.offsetWidth,
      })
    }
  }

  useEffect(() => {
    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [selectedTab])

  const handleTabChange = (tab: 'contacts' | 'pets') => {
    setSelectedTab(tab)
  }

  return (
    <div>
      <h1 className="mb-2">ПРОФИЛЬ</h1>
      <div className="relative">
        <div className="flex flex-row gap-4 border-b border-white">
          <button
            ref={contactsRef}
            type="button"
            onClick={() => handleTabChange('contacts')}
            className={`py-2 hover:cursor-pointer ${
              selectedTab === 'contacts' ? 'text-black' : 'text-black hover:bg-gray-100'
            }`}
          >
            <span className="block sm:hidden">Данные о питомце</span>
            <span className="hidden sm:block">Контактные данные</span>
          </button>
          <button
            ref={petsRef}
            type="button"
            onClick={() => handleTabChange('pets')}
            className={`px-4 py-2 hover:cursor-pointer ${
              selectedTab === 'pets' ? 'text-black' : 'text-black hover:bg-gray-100'
            }`}
          >
            <span className="block sm:hidden">Контактные данные</span>
            <span className="hidden sm:block">Данные о питомце</span>
          </button>
          <div
            className="absolute bottom-[-1px] h-[2px] bg-orange-500 transition-all duration-200"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />
        </div>
      </div>
      {selectedTab === 'contacts' ? <ContactForm /> : <PetForm />}
    </div>
  )
}

export default ProfilePage
