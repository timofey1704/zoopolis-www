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

    // 1. cоздаем транзакцию в статусе pending на бекенде
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/payments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        plan,
        tracking_id: data.tracking_id,
      }),
    })

    const backendResponseText = await backendResponse.text()

    if (!backendResponse.ok) {
      return new Response(JSON.stringify({ error: backendResponseText }), {
        status: backendResponse.status,
      })
    }

    // 2. отправляем запрос в bepaid
    const bepaidResponse = await fetch(`${CHECKOUT_URL}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-API-Version': '2',
      },
      body: JSON.stringify(bepaid_json),
    })

    const bepaidResult = await bepaidResponse.json()

    if (!bepaidResponse.ok) {
      return new Response(JSON.stringify({ error: bepaidResult }), {
        status: bepaidResponse.status,
      })
    }

    // получаем token и redirect_url из ответа на /checkout
    const { token, redirect_url } = bepaidResult.checkout

    return new Response(
      JSON.stringify({
        transaction: JSON.parse(backendResponseText),
        payment: bepaidResult,
        checkoutUrl: redirect_url,
        token,
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('POST /api/payments error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
