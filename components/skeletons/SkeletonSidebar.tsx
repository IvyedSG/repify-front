import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonSidebar() {
  return (
    <div className="w-64 h-screen p-4 border-r">
      <Skeleton className="h-8 w-32 mb-4" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-6 w-full mb-2" />
      ))}
    </div>
  )
}