import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const ViewProjects = dynamic(() => import('@/components/ViewProjects'), {
  loading: () => <div>Loading projects...</div>,
  ssr: false
})

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-0 h-full">
      <Suspense fallback={<div>Loading projects...</div>}>
        <ViewProjects />
      </Suspense>
    </div>
  )
}