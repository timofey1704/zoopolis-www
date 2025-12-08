'use client'

import React from 'react'
import ServiceCard from './components/ServiceCard'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import Loader from '@/components/ui/Loader'
import { useTabs } from '@/app/hooks/useTabs'
import { TabsContainer, TabConfig } from '@/components/ui/TabsContainer'

type TabType = 'all' | 'available' | 'blocked'
export interface ServiceData {
  id: number
  title: string
  description: string
  imageURL?: string
  actual_before: Date
  available_for: string[]
  is_available: boolean
}

const TABS: TabConfig<TabType>[] = [
  { id: 'all', label: 'Все услуги' },
  { id: 'available', label: 'Доступные услуги' },
  { id: 'blocked', label: 'Заблокированные' },
]

const ServicesPage = () => {
  const { selectedTab, indicatorStyle, refs, handleTabChange } = useTabs<TabType>(
    ['all', 'available', 'blocked'],
    {
      defaultTab: 'all',
      onTabChange: () => {
        refetch()
      },
    }
  )

  const {
    data: ServiceData = [],
    isLoading,
    error,
    refetch,
  } = useClientFetch<ServiceData[]>(`/account/services/?filter=${selectedTab}`)

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <div>Ошибка загрузки сервисов</div>
  }

  return (
    <>
      <h1>УСЛУГИ</h1>
      <TabsContainer
        tabs={TABS}
        selectedTab={selectedTab}
        indicatorStyle={indicatorStyle}
        refs={refs}
        onTabChange={handleTabChange}
      />

      {ServiceData.length === 0 ? (
        <div className="my-8 text-center text-gray-500">
          Раздел в стадии наполнения. Следите за обновлениями!
        </div>
      ) : (
        <div className="my-5 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {ServiceData.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </>
  )
}

export default ServicesPage
