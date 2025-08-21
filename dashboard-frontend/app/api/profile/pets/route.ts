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
    const { name, type, gender, birthday, breed, color, comment, allegries } = data

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/profile/pet/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        name,
        type,
        birthday,
        gender,
        breed,
        color,
        comment,
        allegries,
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
