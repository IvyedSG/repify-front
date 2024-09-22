import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const DynamicContent = dynamic(() => import('@/components/DynamicContent'), {
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>,
  ssr: false
})

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className="relative hidden w-1/2 flex-col bg-black p-10 text-white lg:flex">
        <div className="flex items-center text-lg font-medium">
          <Image
            src="/logo.webp"
            alt="Logo"
            width={40}
            height={40}
            className="mr-2"
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