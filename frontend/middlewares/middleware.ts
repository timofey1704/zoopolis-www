import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface JWTPayload {
  exp?: number
}

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/account')

  if (isAuthPage && (!accessToken || !refreshToken)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthPage && accessToken) {
    try {
      const decoded = jwtDecode<JWTPayload>(accessToken)

      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } catch (error) {
      console.error('Token decode error:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*'],
}
