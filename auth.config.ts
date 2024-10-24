import { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { signOut } from 'next-auth/react';

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'junior@help.me' },
        password: { label: 'Password', type: 'password', placeholder: '**********' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const res = await fetch('http://127.0.0.1:8000/usuario/login/Login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

          const data = await res.json()

          if (res.ok && data) {
            return {
              id: data.id,
              email: data.email,
              university: data.university,
              career: data.career,
              accessToken: data.access,
              refreshToken: data.refresh
            }
          }
        } catch (error) {
          console.error('Error during login:', error)
        }

        return null
      }
    })
  ],
  pages: {
    signIn: '/'
  },
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
          accessTokenExpires: Date.now() + 10 * 60 * 1000,
          refreshTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
        }
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      if (Date.now() > (token.refreshTokenExpires as number)) {
        return { ...token, error: 'RefreshTokenExpired' }
      }

      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        email: token.email as string,
        university: token.university as string,
        career: token.career as string,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
      }
      session.error = token.error as string | undefined
      return session
    }
  },
  events: {
    async signOut({ token }) {
      signOut({ callbackUrl: '/' })
    }
  }
}

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch('http://127.0.0.1:8000/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: token.refreshToken }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) throw refreshedTokens

    return {
      ...token,
      accessToken: refreshedTokens.access,
      accessTokenExpires: Date.now() + 10 * 60 * 1000,
      refreshToken: refreshedTokens.refresh ?? token.refreshToken,
    }
  } catch (error) {
    console.error('Error refreshing access token', error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export default authConfig