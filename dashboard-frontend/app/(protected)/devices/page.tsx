'use client'

import { useClientFetch } from '@/app/hooks/useClientFetch'
import DeviceCard from './components/DeviceCard'
import Loader from '@/components/ui/Loader'
import { useTabs } from '@/app/hooks/useTabs'
import { TabsContainer, TabConfig } from '@/components/ui/TabsContainer'

export interface Device {
  id: number
  title: string
  description: string
  price: number
  image: string
  category: TabType
  wb_link: string
}

type TabType = 'all' | 'collars' | 'keychains'

const TABS: TabConfig<TabType>[] = [
  { id: 'all', label: 'Все товары' },
  { id: 'collars', label: 'Ошейники' },
  { id: 'keychains', label: 'Брелоки' },
]

const DevicesPage = () => {
  const { selectedTab, indicatorStyle, refs, handleTabChange } = useTabs<TabType>(
    ['all', 'collars', 'keychains'],
    { defaultTab: 'all' }
  )

  const {
    data: response,
    isLoading,
    error,
  } = useClientFetch<{ devices: Device[] }>('/account/devices/')

  const devices = response?.devices || []

  // фильтруем устройства по выбранной категории, для "all" показываем все
  const filteredDevices = Array.isArray(devices)
    ? selectedTab === 'all'
      ? devices
      : devices.filter(device => device.category === selectedTab)
    : []

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <div>Ошибка загрузки устройств</div>
  }

  return (
    <>
      <h1>УСТРОЙСТВА</h1>
      <TabsContainer
        tabs={TABS}
        selectedTab={selectedTab}
        indicatorStyle={indicatorStyle}
        refs={refs}
        onTabChange={handleTabChange}
      />

      {filteredDevices.length === 0 ? (
        <div className="my-8 text-center text-gray-500">
          Пока что тут ничего нет. Следите за обновлениями!
        </div>
      ) : (
        <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDevices.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      )}
    </>
  )
}

export default DevicesPage
