'use client'

import React, { useEffect, useState, Suspense } from 'react'
import ContactForm from './forms/ContactForm'
import CreatePetForm from './forms/CreatePetForm'
import ExistedPets from './forms/ExistedPets'
import { useTabs } from '@/app/hooks/useTabs'
import { TabsContainer, TabConfig } from '@/components/ui/TabsContainer'
import { useSearchParams } from 'next/navigation'
import Loader from '@/components/ui/Loader'

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
  const [showCreateForm, setShowCreateForm] = useState(false)
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
    <Suspense fallback={<Loader />}>
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
              <span
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="text-orange hover:text-orange/80 mr-4 cursor-pointer"
              >
                {showCreateForm ? 'Список питомцев' : 'Добавить питомца'}
              </span>
            )
          }
        />
        {selectedTab === 'contacts' ? (
          <ContactForm />
        ) : showCreateForm ? (
          <CreatePetForm onClose={() => setShowCreateForm(false)} />
        ) : (
          <ExistedPets />
        )}
      </div>
    </Suspense>
  )
}

export default ProfilePage
