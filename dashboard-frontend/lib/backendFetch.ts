import { NextRequest } from 'next/server'

/**
 * заголовки для запроса к бэкенду с проксированием cookie (JWT авторизация).
 * вызывать из API route: backendHeaders(req) и передать в fetch.
 */
export function backendHeaders(req: NextRequest, extra: HeadersInit = {}): HeadersInit {
  const cookie = req.headers.get('cookie')
  return {
    ...(cookie ? { cookie } : {}),
    ...extra,
  }
}
