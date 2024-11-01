import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProjectRequirementsProps {
  requirements: string[];
}

export default function ProjectRequirements({ requirements }: ProjectRequirementsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Requisitos del Proyecto</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2 text-foreground">
          {requirements.map((requirement, index) => (
            <li key={index}>{requirement}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}