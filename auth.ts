import NextAuth from 'next-auth'
import authConfig from './auth.config'

export default NextAuth(authConfig)

export { signOut, signIn } from 'next-auth/react'
