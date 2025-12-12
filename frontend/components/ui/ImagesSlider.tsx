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
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          dots: true,
          centerMode: true,
          centerPadding: '40px',
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          dots: true,
          centerMode: false,
          centerPadding: '0px',
        },
      },
    ],
  }

  return (
    <div className="mx-auto w-full max-w-300">
      <Slider ref={sliderRef} {...settings} className="slick-slider-custom">
        {items.map(item => (
          <div key={item.id} className="px-1 sm:px-2">
            <div className="mx-auto max-w-75 sm:max-w-none">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg sm:aspect-4/5 lg:aspect-316/580">
                <Image
                  src={item.image}
                  alt={`Фото ${item.id}`}
                  fill
                  sizes="(max-width: 480px) 90vw, (max-width: 768px) 45vw, (max-width: 1280px) 30vw, 25vw"
                  priority={item.id <= 4}
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default ImagesSlider
