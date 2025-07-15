'use client'

import React from 'react'
import Image from 'next/image'
import Slider from 'react-slick'
import { ImagesSliderProps } from '@/app/types'

const ImagesSlider: React.FC<ImagesSliderProps> = ({ items, sliderRef }) => {
  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  const renderMedia = (item: ImagesSliderProps['items'][0]) => {
    if (item.type === 'video') {
      return (
        <div className="relative w-full h-full" style={{ aspectRatio: '16/9' }}>
          <video
            controls
            className="w-full h-full object-cover"
            poster={item.thumbnailUrl}
          >
            <source src={item.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )
    }

    return (
      <div className="relative w-full h-full" style={{ aspectRatio: '16/9' }}>
        <Image 
          src={item.url} 
          alt={`Slide ${item.id}`} 
          fill 
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <Slider ref={sliderRef} {...settings}>
      {items.map((item) => (
        <div key={item.id} className="px-2">
          {renderMedia(item)}
        </div>
      ))}
    </Slider>
  )
}

export default ImagesSlider
