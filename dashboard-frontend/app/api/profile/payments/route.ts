import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const { plan, description, tracking_id, email, transaction: existingTransaction } = data
    let { amount } = data

    // если фронт уже создал транзакцию на бэке (с credentials), только вызываем bepaid
    const transaction = existingTransaction

    if (!transaction) {
      return Response.json({ error: 'Transaction required (create via backend first)' }, { status: 400 })
    }

    if (plan === 'zooID') {
      return Response.json({
        transaction,
        isFree: true,
      })
    }

    if (!amount) {
      return Response.json({ error: 'Amount is required' }, { status: 400 })
    }

    // запрос в bepaid для платных планов
    const CHECKOUT_URL = process.env.CHECKOUT_URL
    const TEST_MODE = process.env.PAYMENTS_TEST_MODE === 'true'
    const BEPAID_ID = process.env.BEPAID_ID
    const SECRET_KEY = process.env.BEPAID_SECRET_KEY

    if (!BEPAID_ID || !SECRET_KEY || !CHECKOUT_URL) {
      return Response.json({ error: 'Payment configuration error' }, { status: 500 })
    }

    const bepaid_json = {
      checkout: {
        transaction_type: 'payment',
        test: TEST_MODE,
        settings: {
          language: 'ru',
          return_url: 'https://account.zoopolis.org/membership',
          button_next_text: 'Вернуться в аккаунт',
        },
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
      isFree: false,
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
