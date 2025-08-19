import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null
      surname?: string | null
      email?: string | null
      phone_number?: string | null
      image?: string | null
    }
    accessToken?: string
    refreshToken?: string
    expiresAt?: number
  }

  interface User {
    id: string
    email: string
    name?: string
    accessToken?: string
    refreshToken?: string
  }

  interface JWT {
    accessToken?: string
    refreshToken?: string
    expiresAt?: number
    error?: string
  }
}

interface GoogleToken extends JWT {
  accessToken?: string
  refreshToken?: string
  expiresAt?: number | undefined
  error?: string
}

async function refreshAccessToken(token: GoogleToken): Promise<GoogleToken> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: token.refreshToken,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw errorData
    }

    const refreshedTokens = await response.json()

    return {
      ...token,
      accessToken: refreshedTokens.access,
      refreshToken: refreshedTokens.refresh ?? token.refreshToken,
      expiresAt: refreshedTokens.expires_at,
    }
  } catch (error) {
    console.error('Refresh error:', error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    //регистрация клиента
    CredentialsProvider({
      id: 'register-credentials',
      name: 'Register',
      credentials: {
        name: { label: 'Name', type: 'text' },
        surname: { label: 'Surname', type: 'text' },
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        phone_number: { label: 'Phone Number', type: 'tel' },
        privacy_accepted: { label: 'Privacy Accepted', type: 'boolean' },
        verification_code: { label: 'Verification Code', type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (
            !credentials?.email ||
            !credentials?.password ||
            !credentials?.name ||
            !credentials?.phone_number ||
            !credentials?.privacy_accepted ||
            !credentials?.surname ||
            !credentials?.verification_code
          ) {
            throw new Error('Все поля обязательны для заполнения')
          }

          const res = await fetch(`${process.env.BACKEND_URL}/register/verify-and-register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              name: credentials.name,
              surname: credentials.surname,
              phone_number: credentials.phone_number,
              privacy_accepted: credentials.privacy_accepted === 'true',
              verification_code: credentials.verification_code,
            }),
          })

          const data = await res.json()

          if (!res.ok) {
            console.error('Registration error response:', data)
            const errorMessage =
              typeof data === 'object'
                ? data.error || Object.values(data).flat().join(', ')
                : 'Registration failed'
            throw new Error(errorMessage)
          }

          return {
            id: data.user.id.toString(),
            email: data.user.email,
            name: data.user.name,
            surname: data.user.surname,
            accessToken: data.access,
            refreshToken: data.refresh,
          }
        } catch (error) {
          console.error('Registration error:', error)
          throw error
        }
      },
    }),

    //логин
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.BACKEND_URL}/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          })

          const data = await res.json()

          if (!res.ok) {
            throw new Error(data.error || 'Authentication failed')
          }

          return {
            id: data.user.id.toString(),
            email: data.user.email,
            name: data.user.firstName,
            accessToken: data.access,
            refreshToken: data.refresh,
          }
        } catch (error) {
          console.error('Login error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        if (account.type === 'credentials') {
          return {
            ...token,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            expiresAt: Math.floor(Date.now() / 1000) + 15 * 60, // 15 минут
          }
        } else {
          return {
            ...token,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at,
          }
        }
      }

      // проверяем не истекает ли токен в ближайшие 5 минут
      const expiresAt = token.expiresAt as number | undefined
      if (
        typeof expiresAt === 'number' &&
        Date.now() < (expiresAt - 5 * 60) * 1000 // обновляем за 5 минут до истечения
      ) {
        return token
      }

      return refreshAccessToken(token as GoogleToken)
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
      }
      return session
    },
  },
}
