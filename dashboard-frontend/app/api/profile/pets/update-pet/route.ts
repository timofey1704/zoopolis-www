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

    // получаем FormData из запроса
    const formData = await req.formData()
    const sendFormData = new FormData()

    // добавляем id питомца
    const id = formData.get('id')
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID питомца не указан' }), {
        status: 400,
      })
    }
    sendFormData.append('id', id.toString())

    // добавляем все текстовые поля
    const textFields = ['name', 'type', 'gender', 'breed', 'color', 'comment', 'allergies']
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pets/update-pet/`, {
      method: 'PATCH',
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
