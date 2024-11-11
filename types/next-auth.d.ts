import NextAuth, { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      university?: string
      career?: string
      accessToken: string
      refreshToken?: string
      photo?: string
      name: string
    } & DefaultSession['user']
    error?: string
  }

  interface User {
    id: string
    email: string
    university?: string
    career?: string
    accessToken: string
    refreshToken?: string
    photo?: string
    name: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    university?: string
    career?: string
    accessToken: string
    refreshToken?: string
    accessTokenExpires: number
    refreshTokenExpires: number
    error?: string
    photo?: string
    name: string
  }
}
