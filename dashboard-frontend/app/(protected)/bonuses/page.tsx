'use client'

import { useClientFetch } from '@/app/hooks/useClientFetch'
import BonusItem from './components/BonusItem'
import Loader from '@/components/ui/Loader'
import { useTabs } from '@/app/hooks/useTabs'
import { TabsContainer, TabConfig } from '@/components/ui/TabsContainer'

type TabType = 'all' | 'discount' | 'promo' | 'promotion'

export interface BonusCard {
  id: number
  name: string
  description: string
  imageURL?: string
  category: string
  code: string
  start_date: string
  end_date: string
  is_available: boolean
}

const TABS: TabConfig<TabType>[] = [
  { id: 'all', label: 'Все услуги' },
  { id: 'discount', label: 'Скидки' },
  { id: 'promo', label: 'Промокоды' },
  { id: 'promotion', label: 'Акции' },
]

const BonusesPage = () => {
  const { selectedTab, indicatorStyle, refs, handleTabChange } = useTabs<TabType>(
    ['all', 'discount', 'promo', 'promotion'],
    { defaultTab: 'all' }
  )

  const {
    data: BonusCard = [],
    isLoading,
    error,
  } = useClientFetch<BonusCard[]>('/account/bonuses/')

  // фильтруем бонусы по выбранной категории, для "all" показываем все
  const filteredBonuses =
    selectedTab === 'all' ? BonusCard : BonusCard.filter(point => point.category === selectedTab)

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <div>Ошибка загрузки бонусных предложений</div>
  }

  return (
    <>
      <h1>СКИДКИ И БОНУСЫ</h1>
      <TabsContainer
        tabs={TABS}
        selectedTab={selectedTab}
        indicatorStyle={indicatorStyle}
        refs={refs}
        onTabChange={handleTabChange}
      />

      {filteredBonuses.length === 0 ? (
        <div className="my-8 text-center text-gray-500">
          Раздел в стадии наполнения. Следите за обновлениями!
        </div>
      ) : (
        <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBonuses.map(bonus => (
            <BonusItem key={bonus.id} bonus={bonus} />
          ))}
        </div>
      )}
    </>
  )
}

export default BonusesPage
