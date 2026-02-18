'use client'

import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapPoint {
  id: number
  location: string
  title: string
  category?: 'clinic' | 'pharmacy' | 'salon' | null
}

interface MapComponentProps {
  points: MapPoint[]
}

// динамический импорт MapContainer и других компонентов
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
  ssr: false,
})
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), {
  ssr: false,
})

export default function MapComponent({ points }: MapComponentProps) {
  const [leaflet, setLeaflet] = useState<typeof L | null>(null)

  // Вычисляем центр карты на основе всех точек
  const center = useMemo(() => {
    if (points.length === 0) return [53.9, 27.56667] // Минск по умолчанию

    const firstPoint = points[0].location.split(',').map(Number)
    if (points.length === 1) return firstPoint

    const bounds = points.reduce(
      (acc, point) => {
        const [lat, lng] = point.location.split(',').map(Number)
        return {
          minLat: Math.min(acc.minLat, lat),
          maxLat: Math.max(acc.maxLat, lat),
          minLng: Math.min(acc.minLng, lng),
          maxLng: Math.max(acc.maxLng, lng),
        }
      },
      {
        minLat: firstPoint[0],
        maxLat: firstPoint[0],
        minLng: firstPoint[1],
        maxLng: firstPoint[1],
      }
    )

    return [(bounds.minLat + bounds.maxLat) / 2, (bounds.minLng + bounds.maxLng) / 2]
  }, [points]) as [number, number]

  useEffect(() => {
    // импортируем Leaflet только на клиенте
    import('leaflet').then(mod => {
      setLeaflet(mod.default)
    })
  }, [])

  if (!leaflet || points.length === 0) return null

  // Настройка иконки маркера
  const icon = leaflet.icon({
    iconUrl: '/images/marker-icon.png',
    iconRetinaUrl: '/images/marker-icon-2x.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  return (
    <div className="h-100 w-full overflow-hidden rounded-xl">
      <MapContainer
        key={JSON.stringify(center)}
        center={center}
        zoom={points.length === 1 ? 15 : 12}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map(point => {
          const [lat, lng] = point.location.split(',').map(Number)
          const position: [number, number] = [lat, lng]

          return (
            <Marker key={point.id} position={position} icon={icon}>
              <Popup>{point.title}</Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
