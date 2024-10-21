import { Suspense } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Metadata } from 'next'

const UserAuthForm = dynamic(() => import('@/components/forms/user-auth-form'), {
  loading: () => <LoadingPlaceholder />,
  ssr: false
})

const LoadingPlaceholder = () => (
  <div className="w-full h-[200px] flex items-center justify-center">
    Cargando formulario...
  </div>
)

export const metadata: Metadata = {
  title: 'Iniciar sesión | Repify',
  description: 'Ingresa a tu cuenta de Repify para una experiencia única de aprendizaje',
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
      <Suspense fallback={<LoadingPlaceholder />}>
        <UserAuthForm />
      </Suspense>
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