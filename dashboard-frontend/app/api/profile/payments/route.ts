import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL
    const TEST_MODE = process.env.PAYMENTS_TEST_MODE
    const BEPAID_ID = process.env.BEPAID_ID
    const SECRET_KEY = process.env.BEPAID_SECRET_KEY

    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
      })
    }

    const data = await req.json()

    const bepaid_json = {
      checkout: {
        transaction_type: 'payment',
        test: TEST_MODE,
        order: {
          amount: data.amount,
          currency: 'BYN',
          description: data.description,
          tracking_id: data.tracking_id,
        },
      },
    }

    const authString = Buffer.from(`${BEPAID_ID}:${SECRET_KEY}`).toString('base64')

    const { plan } = data

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/payments/`, {
      method: 'POST',
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
    console.error('POST /api/payments error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
