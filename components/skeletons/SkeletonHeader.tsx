import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Skeleton className="h-8 w-32" />
      <div className="flex space-x-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-24" />
      </div>
    </header>
  )
}