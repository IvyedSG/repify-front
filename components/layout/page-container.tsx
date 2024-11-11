import React from 'react'

export default function PageContainer({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container py-6 min-h-[calc(100vh-4rem)]">
      {children}
    </div>
  )
}