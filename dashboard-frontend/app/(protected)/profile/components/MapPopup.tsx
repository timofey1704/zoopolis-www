import React from 'react'
import MapComponent from '../../map/components/MapComponent'
import { Dialog } from '@/components/ui/Dialog'

interface MapPopupProps {
  isOpen: boolean
  onClose: () => void
  coordinates: string
  address: string
  founder_name: string
  founder_phone: string
  last_seen_at: string
}

const MapPopup: React.FC<MapPopupProps> = ({
  isOpen,
  onClose,
  coordinates,
  address,
  founder_name,
  founder_phone,
  last_seen_at,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Вашего питомца видели"
      description={
        <div className="flex flex-col gap-2 text-base">
          <p>
            Когда:{' '}
            {new Date(last_seen_at).toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p>По адресу: {address}</p>
          <p>Имя нашедшего: {founder_name}</p>
          <p>Телефон нашедшего: {founder_phone}</p>

          <MapComponent
            points={[
              {
                id: 1,
                location: coordinates,
                title: 'Вашего питомца видели тут',
              },
            ]}
          />
        </div>
      }
      cancelText="Закрыть"
      showCancel={true}
      showSubmit={false}
    ></Dialog>
  )
}

export default MapPopup
