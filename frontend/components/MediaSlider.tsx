'use client'

import React, { useRef, useState, useEffect  } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { MediaItem } from '@/app/types'
import ImagesSlider from './ui/ImagesSlider'
import type Slider from 'react-slick'
import Loader from './ui/Loader'
import rightArrow from '../public/rightArrow.png'
import leftArrow from '../public/leftArrow.png'

const MediaSlider = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sliderRef = useRef<Slider | null>(null)

  useEffect(() => {
    const loadMainPageData = async () => {
      console.log('Starting to load media data...')
      console.log('API_URL:', API_URL)
      
      try {
        console.log('Making API request...')
        const response = await axios.get(`${API_URL}/media/`)
        console.log('API Response:', response.data)
        
        if (!response.data.media || !Array.isArray(response.data.media)) {
          throw new Error('Invalid response format: media array is missing')
        }

        const transformedMedia = response.data.media.map((item: MediaItem) => {
          console.log('Processing item:', item)
          return {
            id: item.id,
            type: item.type,
            url: item.url,
            thumbnailUrl: item.thumbnailUrl || undefined
          }
        })
        
        console.log('Transformed media:', transformedMedia)
        setMedia(transformedMedia)
      } catch (err) {
        console.error('Detailed error:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          error: err,
          apiUrl: `${API_URL}/media/`
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

  console.log('Current state:', { loading, error, mediaLength: media.length })

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[200px]">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center min-h-[200px] text-red-500">
        <div>
          <p>{error}</p>
          <p className="text-sm mt-2">Check console for details</p>
        </div>
      </div>
    )
  }

  if (media.length === 0) {
    return (
      <div className="w-full flex justify-center items-center min-h-[200px] text-gray-500">
        No media available
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <button
        onClick={handlePrevClick}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-all duration-300 hover:cursor-pointer"
        aria-label="Previous slide"
      >
        <Image src={leftArrow} alt="leftArrow" width={48} height={48} />
      </button>

      <div className="px-10">
        <ImagesSlider items={media} sliderRef={sliderRef} />
      </div>

      <button
        onClick={handleNextClick}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-all duration-300 hover:cursor-pointer"
        aria-label="Next slide"
      >
        <Image src={rightArrow} alt="rightArrow" width={48} height={48} />
      </button>
    </div>
  )
}

export default MediaSlider 