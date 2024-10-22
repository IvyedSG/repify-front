'use client'

import { ReactNode, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const ThreeJsLoader = dynamic(() => import('@/components/loader'), {
  ssr: false,
})

const DynamicContent = dynamic(() => import('@/components/DynamicContent'), {
  ssr: false,
})

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000) // Adjust this time as needed

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex h-screen">
      {isLoading ? (
        <ThreeJsLoader onLoadComplete={() => setIsLoading(false)} />
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}