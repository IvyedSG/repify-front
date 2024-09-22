import Link from 'next/link'
import UserRegisterForm from '@/components/forms/user-register-form'

export const metadata = {
  title: 'Register',
  description: 'Crea una cuenta',
}

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Crea una cuenta
        </h1>
        <p className="text-sm text-muted-foreground">
          ¡Cada vez más cerca!
        </p>
      </div>
      <UserRegisterForm />
      <p className="text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{' '}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/"
          className="underline underline-offset-4 hover:text-primary"
        >
          Login here
        </Link>
      </p>
    </div>
  )
}