import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Metadata } from 'next'
import { SkeletonHeader } from '@/components/skeletons/SkeletonHeader'
import { SkeletonSidebar } from '@/components/skeletons/SkeletonSidebar'

const Header = dynamic(() => import('@/components/layout/header'), { 
  loading: () => <SkeletonHeader />,
  ssr: false 
})
const Sidebar = dynamic(() => import('@/components/layout/sidebar'), { 
  loading: () => <SkeletonSidebar />,
  ssr: false 
})

export const metadata: Metadata = {
  title: 'Proyectos | Repify',
  description: 'Explora oportunidades'
}

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Suspense fallback={<SkeletonSidebar />}>
        <Sidebar />
      </Suspense>
      <div className="flex flex-col flex-1 h-screen">
        <Suspense fallback={<SkeletonHeader />}>
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