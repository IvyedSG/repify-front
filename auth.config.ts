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
      // Primera vez que el usuario inicia sesión
      if (user && account) {
        token.id = user.id; // Guardamos el id del usuario en el token
        token.email = user.email; // Guardamos el email del usuario en el token
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
        token.refreshTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 1 día
      }
  
      // En las próximas solicitudes, ya no tendrás acceso al `user`, pero sí al `token`
      // Aquí validamos si el token sigue siendo válido
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }
  
      // Si el refresh token ha expirado, forzar el inicio de sesión
      if (Date.now() > (token.refreshTokenExpires as number)) {
        return { ...token, error: 'RefreshTokenExpired' };
      }
  
      // Si el token ha expirado, intenta actualizarlo
      return refreshAccessToken(token);
    },
  
    async session({ session, token }) {
      // Pasamos el id y email del token al objeto `user` de la sesión
      session.user.id = token.id as string; // Ahora el id viene del token
      session.user.email = token.email as string; // El email también del token
      session.user.accessToken = token.accessToken as string;
      session.user.refreshToken = token.refreshToken as string;
      session.error = token.error as string | undefined;
      return session;
    }
  },
  events: {
    async signOut({ token }) {
      signOut({ callbackUrl: '/' });
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