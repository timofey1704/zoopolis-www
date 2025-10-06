import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }

    const data = await req.json()
    const { firstName, lastName, email, phone_number, city, address, telegram_id } = data

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/profile/contacts/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phone_number,
        email,
        city,
        address,
        telegram_id,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return new Response(JSON.stringify(error), { status: response.status })
    }

    const result = await response.json()
    return new Response(JSON.stringify(result), { status: 200 })
  } catch (error) {
    console.error('PATCH /api/account/profile error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
