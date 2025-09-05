'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import MapComponent from './components/MapComponent'

type TabType = 'clinic' | 'pharmacy' | 'salon' | null

interface MapPoint {
  id: number
  location: string
  title: string
  category?: TabType
}

const MapPage = () => {
  const [selectedTab, setSelectedTab] = useState<TabType>(null)

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const clinicRef = useRef<HTMLButtonElement>(null)
  const pharmacyRef = useRef<HTMLButtonElement>(null)
  const salonRef = useRef<HTMLButtonElement>(null)

  const updateIndicator = useCallback(() => {
    if (!selectedTab) {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
      return
    }

    const refs = {
      clinic: clinicRef,
      pharmacy: pharmacyRef,
      salon: salonRef,
    }

    const activeRef = refs[selectedTab]

    if (activeRef?.current) {
      setIndicatorStyle({
        left: activeRef.current.offsetLeft,
        width: activeRef.current.offsetWidth,
        opacity: 1,
      })
    }
  }, [selectedTab])

  useEffect(() => {
    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [updateIndicator])

  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab === selectedTab ? null : tab)
  }

  const {
    data: mapPoints = [],
    isLoading,
    error,
  } = useClientFetch<MapPoint[]>('/account/map-points/')

  // Filter points based on selected tab
  const filteredPoints = selectedTab
    ? mapPoints.filter(point => point.category === selectedTab)
    : mapPoints

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading map points</div>
  }

  return (
    <>
      <h1>КАРТА</h1>
      <div className="relative">
        <div className="flex flex-row items-center justify-between border-b border-white">
          <div className="flex flex-row gap-4">
            <button
              ref={clinicRef}
              type="button"
              onClick={() => handleTabChange('clinic')}
              className={`px-4 py-2 hover:cursor-pointer ${
                selectedTab === 'clinic' ? 'text-black' : 'text-black hover:bg-gray-100'
              }`}
            >
              Ветклиники
            </button>
            <button
              ref={pharmacyRef}
              type="button"
              onClick={() => handleTabChange('pharmacy')}
              className={`px-4 py-2 hover:cursor-pointer ${
                selectedTab === 'pharmacy' ? 'text-black' : 'text-black hover:bg-gray-100'
              }`}
            >
              Ветаптеки
            </button>
            <button
              ref={salonRef}
              type="button"
              onClick={() => handleTabChange('salon')}
              className={`px-4 py-2 hover:cursor-pointer ${
                selectedTab === 'salon' ? 'text-black' : 'text-black hover:bg-gray-100'
              }`}
            >
              Зоосалоны
            </button>
          </div>

          <div
            className="absolute bottom-[-1px] h-[2px] bg-orange-500 transition-all duration-200"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity,
            }}
          />
        </div>
      </div>
      <div className="mt-7 overflow-hidden rounded-2xl">
        <MapComponent points={filteredPoints} />
      </div>
    </>
  )
}

export default MapPage
