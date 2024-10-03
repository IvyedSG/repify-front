import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token obtained from middleware:', token)

  const { pathname } = req.nextUrl
  const protectedRoutes = ['/projects']

  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (token && token.error === 'RefreshTokenExpired') {
    // If the refresh token has expired, redirect to login
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/projects/:path*'],
}