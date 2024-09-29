import { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

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
          const res = await fetch('https://repo-s7h0.onrender.com/usuario/login/Login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

          const data = await res.json()

          if (res.ok && data) {
            // Store access token in local storage
            if (typeof window !== 'undefined') {
              localStorage.setItem('accessToken', data.access)
            }
            return {
              id: data.email,
              email: data.email,
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
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes
      }

      // If the token has expired, try to refresh it
      if (Date.now() > (token.expiresAt as number)) {
        try {
          const response = await fetch('https://repo-s7h0.onrender.com/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: token.refreshToken }),
          })

          const refreshedTokens = await response.json()

          if (!response.ok) throw refreshedTokens

          // Update access token in local storage
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', refreshedTokens.access)
          }

          return {
            ...token,
            accessToken: refreshedTokens.access,
            expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
          }
        } catch (error) {
          console.error('Error refreshing access token', error)
          return { ...token, error: 'RefreshAccessTokenError' }
        }
      }

      return token
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string
      session.user.refreshToken = token.refreshToken as string
      session.error = token.error as string | undefined
      return session
    }
  },
  events: {
    async signOut({ token }) {
      // Remove access token from local storage on sign out
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
      }
      // Optionally, you can add logic here to invalidate the refresh token on the server
    }
  }
}

export default authConfig