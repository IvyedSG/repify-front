import Link from 'next/link'
import UserRegisterForm from '@/components/forms/user-register-form'

export const metadata = {
  title: 'Registro',
  description: 'Crea una cuenta en Repify',
}

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Regístrate
        </h1>
        <p className="text-sm text-muted-foreground">
          ¡Cada vez más cerca de unirte a nuestra comunidad!
        </p>
      </div>
      <UserRegisterForm />
      <p className="text-center text-sm text-muted-foreground">
        Al hacer clic en continuar, aceptas nuestros{' '}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Términos de Servicio
        </Link>{' '}
        y{' '}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Política de Privacidad
        </Link>
        .
      </p>
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{' '}
        <Link
          href="/"
          className="underline underline-offset-4 hover:text-primary"
        >
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  )
}