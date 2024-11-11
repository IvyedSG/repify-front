import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ScrollArea } from '@/components/ui/scroll-area'
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
    <div className="flex h-screen overflow-hidden bg-background">
      <Suspense fallback={<SkeletonSidebar />}>
        <Sidebar />
      </Suspense>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Suspense fallback={<SkeletonHeader />}>
          <Header />
        </Suspense>
        <ScrollArea className="flex-1 overflow-auto">
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </ScrollArea>
      </div>
    </div>
  )
}