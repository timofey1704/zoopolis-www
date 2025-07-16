'use client'

import React from 'react'
import Image from 'next/image'
import Slider from 'react-slick'
import { ImagesSliderProps } from '@/app/types'

const ImagesSlider: React.FC<ImagesSliderProps> = ({ items, sliderRef }) => {
  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  const renderMedia = (item: ImagesSliderProps['items'][0]) => {
    if (item.type === 'video') {
      return (
        <div className="relative aspect-[316/580] w-full">
          <video
            controls
            className="h-full w-full rounded-lg object-cover"
            poster={item.thumbnailUrl}
          >
            <source src={item.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )
    }

    return (
      <div className="relative aspect-[316/580] w-full">
        <Image
          src={item.url}
          alt={`Slide ${item.id}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={item.id <= 4}
          className="rounded-lg object-cover"
        />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4">
      <Slider ref={sliderRef} {...settings}>
        {items.map(item => (
          <div key={item.id} className="px-2">
            {renderMedia(item)}
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default ImagesSlider
