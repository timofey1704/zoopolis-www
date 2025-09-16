import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }

    // получаем FormData из запроса
    const formData = await req.formData()
    const sendFormData = new FormData()

    // добавляем все текстовые поля
    const textFields = [
      'name',
      'type',
      'birthday',
      'gender',
      'breed',
      'color',
      'comment',
      'allergies',
      'qr_code',
    ]
    textFields.forEach(field => {
      const value = formData.get(field)
      if (value) {
        sendFormData.append(field, value.toString())
      }
    })

    // добавляем изображение если оно есть
    const image = formData.get('image')
    if (image instanceof Blob) {
      sendFormData.append('image', image)
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pets/create-pet/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: sendFormData,
    })

    if (!response.ok) {
      const error = await response.json()
      return new Response(JSON.stringify(error), { status: response.status })
    }

    const result = await response.json()
    return new Response(JSON.stringify(result), { status: 200 })
  } catch (error) {
    console.error('POST /api/profile/pets error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
