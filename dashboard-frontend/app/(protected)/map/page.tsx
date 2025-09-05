'use client'

import React from 'react'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import MapComponent from './components/MapComponent'
import Loader from '@/components/ui/Loader'
import { useTabs } from '@/app/hooks/useTabs'
import { TabsContainer, TabConfig } from '@/components/ui/TabsContainer'

type TabType = 'clinic' | 'pharmacy' | 'salon'

interface MapPoint {
  id: number
  location: string
  title: string
  category?: TabType | null
}

const TABS: TabConfig<TabType>[] = [
  { id: 'clinic', label: 'Ветклиники' },
  { id: 'pharmacy', label: 'Ветаптеки' },
  { id: 'salon', label: 'Зоосалоны' },
]

const MapPage = () => {
  const { selectedTab, indicatorStyle, refs, handleTabChange } = useTabs<TabType>(
    ['clinic', 'pharmacy', 'salon'],
    { allowDeselect: true }
  )

  const {
    data: mapPoints = [],
    isLoading,
    error,
  } = useClientFetch<MapPoint[]>('/account/map-points/')

  // показываем только точки выбранной категории
  const filteredPoints = selectedTab
    ? mapPoints.filter(point => point.category === selectedTab)
    : mapPoints

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <div>Ошибка загрузки точек на карте</div>
  }

  return (
    <>
      <h1>КАРТА</h1>
      <TabsContainer
        tabs={TABS}
        selectedTab={selectedTab}
        indicatorStyle={indicatorStyle}
        refs={refs}
        onTabChange={handleTabChange}
      />
      <div className="mt-7 overflow-hidden rounded-2xl">
        <MapComponent points={filteredPoints} />
      </div>
    </>
  )
}

export default MapPage
