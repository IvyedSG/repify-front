import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terminos y Servicios',
  description: 'La seguridad es lo mas importante',
}

export default function TermsAndServices() {
  return (
    
    <div className="flex min-h-screen text-white bg-black">
      <div className="relative flex flex-col items-center justify-center w-1/2 p-8 overflow-hidden">
        <h1 className="z-10 mb-4 text-4xl font-bold">Términos y Servicios</h1>
        <p className="z-10 text-xl text-blue-400">Conoce nuestras políticas y acuerdos</p>
      </div>

      {/* Right side with terms content */}
      <div className="w-1/2 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <h2 className="mb-4 text-2xl font-semibold">1. Aceptación de los Términos</h2>
          <p className="mb-4">
            Al acceder y utilizar este servicio, usted acepta estar sujeto a estos términos y condiciones.
            Si no está de acuerdo con alguna parte de los términos, no podrá utilizar nuestro servicio.
          </p>

          <h2 className="mb-4 text-2xl font-semibold">2. Cambios en los Términos</h2>
          <p className="mb-4">
            Nos reservamos el derecho de modificar estos términos en cualquier momento.
            Su uso continuado del servicio después de dichos cambios constituye su aceptación de los nuevos términos.
          </p>

          <h2 className="mb-4 text-2xl font-semibold">3. Privacidad</h2>
          <p className="mb-4">
            Su privacidad es importante para nosotros. Consulte nuestra Política de Privacidad para entender
            cómo recopilamos, usamos y protegemos su información personal.
          </p>

          <h2 className="mb-4 text-2xl font-semibold">4. Uso del Servicio</h2>
          <p className="mb-4">
            Usted se compromete a utilizar el servicio solo para fines legales y de acuerdo con estos términos.
            No debe usar el servicio de ninguna manera que pueda dañar, deshabilitar o sobrecargar nuestros sistemas.
          </p>

          <h2 className="mb-4 text-2xl font-semibold">5. Cuenta de Usuario</h2>
          <p className="mb-4">
            Si crea una cuenta en nuestro servicio, es responsable de mantener la seguridad de su cuenta
            y de todas las actividades que ocurran bajo su cuenta.
          </p>

          <Button className="mt-8 text-white bg-blue-600 hover:bg-blue-700">
            Aceptar Términos
          </Button>

          <p className="mt-4 text-sm text-gray-400">
            ¿Ya tienes una cuenta? <Link href="/login" className="text-blue-400 hover:underline">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  )
}