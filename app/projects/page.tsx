import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { SkeletonProjects } from '@/components/skeletons/SkeletonProjects'

const ViewProjects = dynamic(() => import('@/components/ViewProjects'), {
  loading: () => <SkeletonProjects />,
  ssr: false
})

export default function ProjectsPage() {
  return (
    <div className="w-full max-w-full mx-auto px-4 py-6 h-full">
      <Suspense fallback={<SkeletonProjects />}>
        <ViewProjects />
      </Suspense>
    </div>
  )
}