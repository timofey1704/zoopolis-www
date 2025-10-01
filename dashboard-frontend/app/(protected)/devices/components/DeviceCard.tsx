import React from 'react'
import Image from 'next/image'
import { Device } from '../page'

const DeviceCard = ({ device }: { device: Device }) => {
  return (
    <div className="rounded-2xl border-1 border-gray-200 bg-white p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="flex flex-col items-center justify-center space-y-3">
        <Image src={device.image} alt={device.title} width={200} height={200} priority />
        <h3>{device.title}</h3>
        <p>{device.description}</p>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <p>{device.price} BYN</p>
        <a href={device.wb_link} className="bg-orange rounded-3xl px-4 py-2 text-white">
          Заказать на WB
        </a>
      </div>
    </div>
  )
}

export default DeviceCard
