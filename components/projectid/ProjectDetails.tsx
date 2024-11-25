import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Users, Target, FileText } from 'lucide-react'

interface Project {
  status: string
  start_date: string
  end_date: string
  priority: string
  project_type: string[] | null
  collaboration_count: number
  detailed_description: string
}

interface ProjectDetailsProps {
  project: Project
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta':
        return 'text-red-500'
      case 'media':
        return 'text-yellow-500'
      case 'baja':
        return 'text-green-500'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Detalles del Proyecto</CardTitle>
        <Badge variant="secondary" className="bg-primary text-primary-foreground">
          {project.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center text-muted-foreground">
            <CalendarIcon className="mr-2 h-5 w-5" />
            <span>{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
          </div>
          <div className={`flex items-center ${getPriorityColor(project.priority)}`}>
            <Target className="mr-2 h-5 w-5" />
            <span>Prioridad {project.priority}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <FileText className="mr-2 h-5 w-5" />
            <span>{project.project_type && project.project_type.length > 0 ? project.project_type.join(', ') : 'No especificado'}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="mr-2 h-5 w-5" />
            <span>{project.collaboration_count} Miembro{project.collaboration_count !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Descripción Detallada</h3>
          <p className="text-foreground whitespace-pre-wrap">{project.detailed_description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

