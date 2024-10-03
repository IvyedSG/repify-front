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
        token.accessTokenExpires = Date.now() + 10 * 60 * 1000 // 10 minutos
        token.refreshTokenExpires = Date.now() + 24 * 60 * 60 * 1000 // 1 día
      }

      // Si el token de acceso aún no ha expirado, devolverlo
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // Si el refresh token ha expirado, forzar el inicio de sesión
      if (Date.now() > (token.refreshTokenExpires as number)) {
        return { ...token, error: 'RefreshTokenExpired' }
      }

      // De lo contrario, intentar actualizar el token
      return refreshAccessToken(token)
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
      // Opcionalmente, se puede añadir lógica para invalidar el refresh token en el servidor
    }
  }
}

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch('https://repo-s7h0.onrender.com/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: token.refreshToken }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) throw refreshedTokens

    return {
      ...token,
      accessToken: refreshedTokens.access,
      accessTokenExpires: Date.now() + 10 * 60 * 1000, // 10 minutos
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