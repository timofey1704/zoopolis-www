'use client'

import useUserStore from '@/app/store/userStore'
import Button from '@/components/ui/Button'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import MapComponent from '../map/components/MapComponent'
import { MapPoint } from '../map/page'
import Loader from '@/components/ui/Loader'
import { BonusCard } from '../bonuses/page'
import BonusItem from '../bonuses/components/BonusItem'
import { useRouter } from 'next/navigation'
import { getGreetingByTime } from '@/lib/utils/getGreetingsByTime'

const DashboardPage = () => {
  const router = useRouter()
  const user = useUserStore()

  const {
    data: mapPoints = [],
    isLoading: isLoadingMap,
    error: mapError,
  } = useClientFetch<MapPoint[]>('/account/map-points/')

  const {
    data: BonusCard = [],
    isLoading: isLoadingBonuses,
    error: bonusError,
  } = useClientFetch<BonusCard[]>('/account/bonuses/')

  if (isLoadingMap || isLoadingBonuses) {
    return <Loader />
  }

  if (mapError || bonusError) {
    return null
  }

  const userName = `${user.user?.name ?? ''} ${user.user?.surname ?? ''}`.trim() || 'Пользователь'

  return (
    <div className="flex flex-col gap-4">
      <h1 className="mb-3">
        {' '}
        {getGreetingByTime()}, {userName}
      </h1>

      <div className="flex w-full flex-row items-center justify-between rounded-[40px] bg-black p-6">
        <div className="flex flex-col gap-5">
          <h3 className="text-white">Сообщить о пропаже</h3>
          <span className="text-white">
            В течении 1 минуты наш менеджер свяжется с вами для уточнения информации
          </span>

          <Button
            text="Заявить о пропаже"
            onClick={() => router.push('/profile?tab=pets')}
            className="from-orange mt-4 w-full cursor-pointer items-center justify-center bg-linear-to-r to-orange-600 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50 md:w-md"
          />
        </div>
      </div>

      {user.user?.is_coordinates_available && (
        <div className="animated-border flex w-full flex-row items-center justify-between p-6">
          <div className="flex flex-col gap-5">
            <h3>Мы получили информацию о вашем питомце!</h3>
            <span>Вы можете посмотреть на карте, где видели Вашего питомца</span>

            <Button
              text="К списку питомцев"
              onClick={() => router.push('/profile?tab=pets')}
              className="from-orange mt-4 w-full cursor-pointer items-center justify-center bg-linear-to-r to-orange-600 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50 md:w-md"
            />
          </div>
        </div>
      )}

      <div className="relative mt-7 overflow-hidden rounded-2xl">
        <MapComponent points={mapPoints} />
      </div>

      <div className="my-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BonusCard.map(bonus => (
          <BonusItem key={bonus.id} bonus={bonus} />
        ))}
      </div>
    </div>
  )
}

export default DashboardPage
