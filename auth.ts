import NextAuth from 'next-auth';
import authConfig from './auth.config';

// Exporta NextAuth directamente como default
const auth = NextAuth(authConfig);

export { auth }; // Exporta auth si quieres usarlo en otro lugar

// Para los handlers GET y POST, esto no es necesario con NextAuth.
export const handlers = {
  GET: auth,
  POST: auth,
};

// Si necesitas manejar signIn y signOut por separado, usa estos helpers.
export { signOut, signIn } from 'next-auth/react';
