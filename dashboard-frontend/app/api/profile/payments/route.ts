import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()

    const { plan, amount, description, tracking_id, email } = data

    if (!amount) {
      console.error('Amount is missing in request data')
      return Response.json({ error: 'Amount is required' }, { status: 400 })
    }

    const CHECKOUT_URL = process.env.CHECKOUT_URL
    const TEST_MODE = process.env.PAYMENTS_TEST_MODE
    const BEPAID_ID = process.env.BEPAID_ID
    const SECRET_KEY = process.env.BEPAID_SECRET_KEY

    if (!BEPAID_ID || !SECRET_KEY || !CHECKOUT_URL) {
      return Response.json({ error: 'Payment configuration error' }, { status: 500 })
    }

    const bepaid_json = {
      checkout: {
        transaction_type: 'payment',
        settings: {
          language: 'ru',
        },
        test: TEST_MODE,
        order: {
          amount: amount,
          currency: 'BYN',
          description: description,
          tracking_id: tracking_id,
        },
        customer: {
          email: email,
        },
      },
    }

    const authString = Buffer.from(`${BEPAID_ID}:${SECRET_KEY}`).toString('base64')

    // 1. создаем транзакцию в бекенде
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/payments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ plan, tracking_id }),
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      return Response.json({ error: errorText }, { status: backendResponse.status })
    }

    const transaction = await backendResponse.json()

    // 2. запрос в bepaid
    const bepaidResponse = await fetch(CHECKOUT_URL, {
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
      return Response.json({ error: bepaidResult }, { status: bepaidResponse.status })
    }

    const { token, redirect_url } = bepaidResult.checkout

    // 3. возвращаем результат
    return Response.json({
      transaction,
      payment: bepaidResult,
      checkoutUrl: redirect_url,
      token,
    })
  } catch (error: unknown) {
    console.error('POST /api/payments error:', {
      name: error instanceof Error ? error.name : 'Unknown error',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return Response.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
