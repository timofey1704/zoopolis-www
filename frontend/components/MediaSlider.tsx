'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { MediaItem } from '@/app/types'
import ImagesSlider from './ui/ImagesSlider'
import type Slider from 'react-slick'
import Loader from './ui/Loader'

const MediaSlider = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sliderRef = useRef<Slider | null>(null)

  useEffect(() => {
    const loadMainPageData = async () => {
      try {
        const response = await axios.get(`${API_URL}/media/`)

        if (!response.data.media || !Array.isArray(response.data.media)) {
          throw new Error('Invalid response format: media array is missing')
        }

        setMedia(response.data.media)
      } catch (err) {
        console.error('Detailed error:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          error: err,
          apiUrl: `${API_URL}/media/`,
        })
        setError('Failed to load main page data')
      } finally {
        setLoading(false)
      }
    }
    loadMainPageData()
  }, [API_URL])

  const handlePrevClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev()
    }
  }

  const handleNextClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext()
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-50 w-full items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-50 w-full items-center justify-center text-red-500">
        <div>
          <p>{error}</p>
          <p className="mt-2 text-sm">Check console for details</p>
        </div>
      </div>
    )
  }

  if (media.length === 0) {
    return (
      <div className="flex min-h-50 w-full items-center justify-center text-gray-500">
        No media available
      </div>
    )
  }

  return (
    <div className="relative w-full px-4 sm:px-8 lg:px-0">
      <button
        onClick={handlePrevClick}
        className="absolute top-1/2 -left-2 z-10 -translate-y-1/2 transition-all duration-300 hover:scale-110 hover:cursor-pointer sm:-left-4 lg:-left-3"
        aria-label="Previous slide"
      >
        <Image
          src="/leftArrow.svg"
          alt="Previous"
          width={48}
          height={48}
          className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
        />
      </button>

      <div className="px-6 sm:px-8 lg:px-12">
        <ImagesSlider items={media} sliderRef={sliderRef} />
      </div>

      <button
        onClick={handleNextClick}
        className="absolute top-1/2 -right-2 z-10 -translate-y-1/2 transition-all duration-300 hover:scale-110 hover:cursor-pointer sm:-right-4 lg:-right-3"
        aria-label="Next slide"
      >
        <Image
          src="/rightArrow.svg"
          alt="Next"
          width={48}
          height={48}
          className="hidden h-8 w-8 sm:block sm:h-10 sm:w-10 lg:h-12 lg:w-12"
        />
      </button>
    </div>
  )
}

export default MediaSlider
