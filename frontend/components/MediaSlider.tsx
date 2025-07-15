'use client'

import React, { useRef } from 'react'
import { MediaItem } from '@/app/types'
import ImagesSlider from './ui/ImagesSlider'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import type Slider from 'react-slick'

interface MediaSliderProps {
  items: MediaItem[]
}

const MediaSlider: React.FC<MediaSliderProps> = ({ items }) => {
  const sliderRef = useRef<Slider>(null)

  const next = () => {
    sliderRef.current?.slickNext()
  }

  const previous = () => {
    sliderRef.current?.slickPrev()
  }

  return (
    <div className="relative w-full">
      <button
        onClick={previous}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
        aria-label="Previous slide"
      >
        <IoIosArrowBack size={24} />
      </button>

      <div className="px-10">
        <ImagesSlider items={items} sliderRef={sliderRef} />
      </div>

      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
        aria-label="Next slide"
      >
        <IoIosArrowForward size={24} />
      </button>
    </div>
  )
}

export default MediaSlider 