import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // получаем базовый урл, убирая /api/v1 если он есть
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
  const BASE_URL = apiUrl.replace('/api/v1', '')

  // получаем путь из урла
  const pathname = request.nextUrl.pathname
  const path = pathname.replace('/api/media/', '')
  const imageUrl = `${BASE_URL}/media/${path}`

  try {
    const response = await fetch(imageUrl)

    if (!response.ok) {
      console.error('Image not found on backend')
      return new NextResponse('Image not found', { status: 404 })
    }

    const blob = await response.blob()

    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error proxying image:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return new NextResponse('Error loading image', { status: 500 })
  }
}
