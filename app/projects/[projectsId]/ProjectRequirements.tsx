import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProjectRequirements({ requirements }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Requisitos Necesarios</CardTitle>
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