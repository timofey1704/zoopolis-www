import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface JWTPayload {
  exp?: number
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isPublicRoute = pathname === '/login' || pathname === '/register'
  const isPublicAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico'

  // пропускаем публичные роуты и ассеты
  if (isPublicRoute || isPublicAsset) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  // если нет токенов, редиректим на логин
  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const decoded = jwtDecode<JWTPayload>(accessToken)

    // проверяем срок действия токена
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch (error) {
    console.error('Token decode error:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|register).*)'],
}
