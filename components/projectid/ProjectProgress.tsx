import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface ProjectProgressProps {
  progress: number;
}

export default function ProjectProgress({ progress }: ProjectProgressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Progreso del Proyecto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-right font-medium">{progress}% Completado</p>
        </div>
      </CardContent>
    </Card>
  )
}