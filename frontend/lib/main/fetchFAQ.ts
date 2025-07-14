import { FAQ, FAQProps } from '@/app/types'

export async function getFAQs(): Promise<FAQ[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const response = await fetch(`${API_URL}/faq/`, {
    next: {
      revalidate: 259200, // три дня
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch FAQs')
  }

  const data: FAQProps = await response.json()
  return data.faqs
}
