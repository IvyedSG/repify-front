import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Metadata } from 'next'

const Header = dynamic(() => import('@/components/layout/header'), { ssr: false })
const Sidebar = dynamic(() => import('@/components/layout/sidebar'), { ssr: false })

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects in repify'
}

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <Sidebar />
      </Suspense>
      <div className="flex flex-col flex-1 h-screen">
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>
        <ScrollArea className="flex-1 h-full">
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </ScrollArea>
      </div>
    </div>
  )
}