import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { signOut } from 'next-auth/react';

const protectedRoutes = ['/projects'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return redirectToLogin(req);
    }

    if (token.error === 'RefreshTokenExpired') {
      return redirectToLogin(req);
    }


    const response = await fetch(req.url, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (response.status === 401) {
      // Cierra la sesión automáticamente
      await signOut({ callbackUrl: '/' });
      return redirectToLogin(req);
    }
  } catch (error) {
    console.error('Error en la autenticación:', error);
    return redirectToLogin(req); 
  }

  return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
  return NextResponse.redirect(new URL('/', req.url));
}

export const config = {
  matcher: ['/projects/:path*'],
};
