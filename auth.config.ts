import CredentialsProvider from 'next-auth/providers/credentials'
import { signOut } from 'next-auth/react'
import type { NextAuthOptions } from 'next-auth' 

const authConfig: NextAuthOptions = { 
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'junior@help.me' },
        password: { label: 'Password', type: 'password', placeholder: '**********' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const res = await fetch(`${process.env.API_URL}/usuario/login/Login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data = await res.json()

          if (res.ok && data) {
            return {
              id: data.id,
              email: data.email,
              university: data.university,
              career: data.career,
              accessToken: data.access,
              refreshToken: data.refresh,
            }
          }
        } catch (error) {
          console.error('Error during login:', error)
        }

        return null
      },
    }),
  ],
  pages: { signIn: '/' },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          university: user.university,
          career: user.career,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 30 * 60 * 1000, 
          refreshTokenExpires: Date.now() + 24 * 60 * 60 * 1000, 
        }
      }

      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      if (Date.now() > token.refreshTokenExpires) {
        return { ...token, error: 'RefreshTokenExpired' }
      }

      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        email: token.email,
        university: token.university,
        career: token.career,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      }
      session.error = token.error

      if (token.error) {
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      }

      return session
    },
  },
  
  events: {
    async signOut({ token }) {
      signOut({ callbackUrl: '/' })
    },
  },
}

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(`${process.env.API_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: token.refreshToken }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) throw refreshedTokens

    return {
      ...token,
      accessToken: refreshedTokens.access,
      accessTokenExpires: Date.now() + 30 * 60 * 1000, 
      refreshToken: refreshedTokens.refresh ?? token.refreshToken,
    }
  } catch (error) {
    console.error('Error refreshing access token', error)
    return { ...token, error: 'RefreshAccessTokenError' }
  }
}

export default authConfig