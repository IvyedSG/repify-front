import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Users, Target, FileText } from 'lucide-react'

export default function ProjectDetails({ project }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Detalles del Proyecto</CardTitle>
        <Badge variant="secondary" className="bg-primary text-primary-foreground">
          {project.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-muted-foreground">
            <CalendarIcon className="mr-2 h-5 w-5" />
            <span>{new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Target className="mr-2 h-5 w-5" />
            <span>Prioridad {project.priority}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <FileText className="mr-2 h-5 w-5" />
            <span>{project.project_type.join(', ')}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="mr-2 h-5 w-5" />
            <span>{project.collaboration_count} Colaboradores</span>
          </div>
        </div>
        <p className="text-foreground">{project.detailed_description}</p>
      </CardContent>
    </Card>
  )
}