import Link from 'next/link'
import UserAuthForm from '@/components/forms/user-auth-form'

export const metadata = {
  title: 'Login',
  description: 'Ingresa',
}

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Ingresa
        </h1>
        <p className="text-sm text-muted-foreground">
          ¡Prepárate para una experiencia única aprendiendo!
        </p>
      </div>
      <UserAuthForm />
      <div className="text-center text-sm">
        <Link
          href="/reset-password"
          className="text-muted-foreground underline underline-offset-4 hover:text-primary"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{' '}
        <Link
          href="/register"
          className="underline underline-offset-4 hover:text-primary"
        >
          Regístrate aquí
        </Link>
      </p>
    </div>
  )
}