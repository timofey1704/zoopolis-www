'use client'

import React, { useEffect } from 'react'
import ContactForm from './forms/ContactForm'
import PetForm from './forms/PetForm'
import { useTabs } from '@/app/hooks/useTabs'
import { TabsContainer, TabConfig } from '@/components/ui/TabsContainer'
import { useSearchParams } from 'next/navigation'

type TabType = 'contacts' | 'pets'

const TABS: TabConfig<TabType>[] = [
  {
    id: 'contacts',
    label: 'Контактные данные',
    mobileLabel: 'Данные о питомце',
  },
  {
    id: 'pets',
    label: 'Данные о питомце',
    mobileLabel: 'Контактные данные',
  },
]

const ProfilePage = () => {
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab') as TabType

  const { selectedTab, indicatorStyle, refs, handleTabChange } = useTabs<TabType>(
    ['contacts', 'pets'],
    { defaultTab: tabFromUrl || 'contacts' }
  )

  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== selectedTab) {
      handleTabChange(tabFromUrl)
    }
  }, [tabFromUrl, selectedTab, handleTabChange])

  return (
    <div>
      <h1 className="mb-2">ПРОФИЛЬ</h1>
      <TabsContainer
        tabs={TABS}
        selectedTab={selectedTab}
        indicatorStyle={indicatorStyle}
        refs={refs}
        onTabChange={handleTabChange}
        rightContent={
          selectedTab === 'pets' && (
            <span className="mr-4 hover:cursor-pointer">Добавить питомца</span>
          )
        }
      />
      {selectedTab === 'contacts' ? <ContactForm /> : <PetForm />}
    </div>
  )
}

export default ProfilePage
