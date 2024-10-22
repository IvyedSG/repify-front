'use client'

import { ReactNode, useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const ThreeJsLoader = dynamic(() => import('@/components/loader'), { ssr: false })
const DynamicContent = dynamic(() => import('@/components/DynamicContent'), { ssr: false })

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadDynamicContent, setLoadDynamicContent] = useState(true) // Activado por defecto
  const fpsRef = useRef<number[]>([]) // Guardar los FPS medidos

  // Medir rendimiento usando requestAnimationFrame
  const measurePerformance = () => {
    let lastTimestamp = performance.now()

    const updateFPS = (now: number) => {
      const delta = now - lastTimestamp
      lastTimestamp = now

      const fps = 1000 / delta
      fpsRef.current.push(fps)

      // Limitar las mediciones a las últimas 60
      if (fpsRef.current.length > 60) fpsRef.current.shift()

      // Calcular el promedio de FPS y desactivar contenido si es bajo
      const avgFPS = fpsRef.current.reduce((a, b) => a + b) / fpsRef.current.length
      if (avgFPS < 30) setLoadDynamicContent(false) // Desactivar si FPS < 30

      requestAnimationFrame(updateFPS)
    }

    requestAnimationFrame(updateFPS)
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000) // Ajusta si es necesario
    measurePerformance() // Iniciar medición de FPS

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <ThreeJsLoader onLoadComplete={() => setIsLoading(false)} />
  }

  // Mostrar solo el login si el contenido dinámico está desactivado
  if (!loadDynamicContent) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        {children}
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <div className="relative hidden w-1/2 flex-col bg-black p-10 text-white lg:flex">
        <div className="flex items-center text-lg font-medium">
          <Image
            src="/logo.webp"
            alt="Logo de Repify"
            width={40}
            height={40}
            className="mr-2"
            priority
          />
          Repify
        </div>
        <DynamicContent />
      </div>
      <div className="flex w-full items-center justify-center lg:w-1/2">
        {children}
      </div>
    </div>
  )
}
