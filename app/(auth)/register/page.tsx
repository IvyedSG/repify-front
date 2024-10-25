import { Suspense } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Metadata } from 'next'

const UserRegisterForm = dynamic(() => import('@/components/forms/user-register-form'), {
  loading: () => <LoadingPlaceholder />,
  ssr: false
})

const LoadingPlaceholder = () => (
  <div className="w-full h-[400px] flex items-center justify-center">
    Cargando formulario de registro...
  </div>
)

export const metadata: Metadata = {
  title: 'Registro | Repify',
  description: 'Crea una cuenta en Repify y únete a nuestra comunidad de aprendizaje',
}

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Regístrate
        </h1>
        <p className="text-sm text-muted-foreground">
          ¡Cada vez más cerca de unirte a nuestra comunidad!
        </p>
      </div>
      <Suspense fallback={<LoadingPlaceholder />}>
        <UserRegisterForm />
      </Suspense>
      <p className="text-sm text-center text-muted-foreground">
        Al hacer clic en continuar, aceptas nuestros{' '}
        <Link
          href="/servicios"
          className="underline underline-offset-4 hover:text-primary"
        >
          Términos de Servicio
        </Link>{' '}
        y{' '}
        <Link
          href="/terminos"
          className="underline underline-offset-4 hover:text-primary"
        >
          Política de Privacidad
        </Link>
        .
      </p>
      <p className="text-sm text-center text-muted-foreground">
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