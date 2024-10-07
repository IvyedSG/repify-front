import Header from '@/components/layout/header'
import Sidebar from '@/components/layout/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Metadata } from 'next'

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
      <Sidebar />
      <div className="flex flex-col flex-1 h-screen"> {/* Ensure it takes full screen height */}
        <Header />
        <ScrollArea className="flex-1 h-full"> {/* Adjusted to take full height */}
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </ScrollArea>
      </div>
    </div>
  )
}
