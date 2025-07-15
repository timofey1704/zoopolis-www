import { MediaItem, ImagesSliderProps } from '@/app/types'

export async function getMainMedia(): Promise<MediaItem[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const response = await fetch(`${API_URL}/media/`, {
    next: {
      revalidate: 259200, // три дня
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch FAQs')
  }

  const data: ImagesSliderProps = await response.json()
  return data.items
}
