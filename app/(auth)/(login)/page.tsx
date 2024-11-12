import { Suspense } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Metadata } from 'next'

const UserAuthForm = dynamic(() => import('@/components/forms/user-auth-form'), {
  loading: () => <LoadingPlaceholder />,
  ssr: false
})

const LoadingPlaceholder = () => (
  <div className="w-full h-[300px] flex items-center justify-center">
    Cargando formulario...
  </div>
)

export const metadata: Metadata = {
  title: 'Iniciar sesión | Repify',
  description: 'Ingresa a tu cuenta de Repify para una experiencia única de aprendizaje',
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto space-y-8 sm:max-w-sm md:max-w-md lg:max-w-lg">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-2xl md:text-4xl">
          Ingresa
        </h1>
        <p className="text-sm sm:text-xs md:text-base text-muted-foreground">
          ¡Prepárate para una experiencia única!
        </p>
      </div>
      <Suspense fallback={<LoadingPlaceholder />}>
        <UserAuthForm />
      </Suspense>
      <div className="text-base text-center">
        <Link
          href="/reset-password"
          className="underline text-muted-foreground underline-offset-4 hover:text-primary"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
      <p className="text-sm text-center sm:text-xs md:text-base text-muted-foreground">
        ¿No tienes una cuenta?{' '}
        <Link
          href="/register"
          className="underline underline-offset-4 hover:text-primary"
        >
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
  
}
