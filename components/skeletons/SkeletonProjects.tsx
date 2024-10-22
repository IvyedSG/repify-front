import { SkeletonProjectCard } from './SkeletonProjectCard'

export function SkeletonProjects() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-grow h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-[200px] h-10 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonProjectCard key={i} />
        ))}
      </div>
    </div>
  )
}