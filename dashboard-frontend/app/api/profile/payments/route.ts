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
    const { plan } = data

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/payments/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        plan,
      }),
    })

    const responseText = await response.text()

    if (!response.ok) {
      return new Response(JSON.stringify({ error: responseText }), { status: response.status })
    }

    const result = JSON.parse(responseText)
    return new Response(JSON.stringify(result), { status: 200 })
  } catch (error) {
    console.error('PATCH /api/payments error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
