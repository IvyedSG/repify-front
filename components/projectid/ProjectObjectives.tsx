import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProjectObjectivesProps {
  objectives?: string[]; 
}

export default function ProjectObjectives({ objectives = [] }: ProjectObjectivesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Objetivos del Proyecto</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2 text-foreground">
          {objectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
