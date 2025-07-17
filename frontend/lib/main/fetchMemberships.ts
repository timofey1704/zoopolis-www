import { Membership, PricingCardProps } from '@/app/types'

export async function getMemberships(): Promise<Membership[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const response = await fetch(`${API_URL}/account/memberships/`, {
    next: {
      revalidate: 259200, // три дня
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch memberships')
  }

  const data: PricingCardProps = await response.json()
  return data.memberships
}
