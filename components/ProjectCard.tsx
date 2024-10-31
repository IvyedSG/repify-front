import React, { memo } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, Users, GraduationCap, Briefcase, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  status: string
  project_type: string[]
  priority: string
  progress: number
  accepting_applications: boolean
  creator_name: string | null
  collaboration_count: number
  type_aplyuni: string
  responsible: number
}

interface ProjectCardProps {
  project: Project
  onViewDetails: (project: Project) => void
}

const universityColors: { [key: string]: { main: string, text: string } } = {
  UNMSM: { main: '#8D4925', text: '#FFFFFF' },
  UNI: { main: '#E63946', text: '#FFFFFF' },
  UNALM: { main: '#2A9D8F', text: '#FFFFFF' },
  UNFV: { main: '#E9C46A', text: '#000000' },
  UNTELS: { main: '#F4A261', text: '#000000' },
  PUCP: { main: '#264653', text: '#FFFFFF' },
  UPCH: { main: '#F4A261', text: '#000000' },
  UL: { main: '#F4A261', text: '#000000' },
  USMP: { main: '#E63946', text: '#FFFFFF' },
  URP: { main: '#2A9D8F', text: '#FFFFFF' },
  UPC: { main: '#E63946', text: '#FFFFFF' },
  UPNW: { main: '#48CAE4', text: '#000000' },
  UPSJB: { main: '#E63946', text: '#FFFFFF' },
  UTP: { main: '#E63946', text: '#FFFFFF' },
  UCSUR: { main: '#264653', text: '#FFFFFF' },
  UA: { main: '#F4A261', text: '#000000' },
  LIBRE: { main: '#2A9D8F', text: '#FFFFFF' }
}

const ProjectCard = memo(({ project, onViewDetails }: ProjectCardProps) => {
  const getInitials = (name: string | null) => {
    if (!name) return 'N/A'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date))
  }

  const priorityColors = {
    'Alta': 'text-red-600 dark:text-red-400',
    'Media': 'text-yellow-600 dark:text-yellow-400',
    'Baja': 'text-green-600 dark:text-green-400'
  }

  const getUniversityColor = (uni: string) => {
    return universityColors[uni] || { main: '#6B7280', text: '#FFFFFF' }
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg dark:bg-gray-800 bg-white border-t-4" style={{ borderTopColor: getUniversityColor(project.type_aplyuni).main }}>
      <CardContent className="flex-grow p-6 space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold dark:text-white text-gray-900">{project.name}</h3>
            <div className={`flex items-center ${priorityColors[project.priority as keyof typeof priorityColors]}`}>
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{project.priority}</span>
            </div>
          </div>
          <p className="text-sm dark:text-gray-300 text-gray-600">{project.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex flex-wrap items-center dark:text-gray-300 text-gray-600">
            <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
            {project.project_type?.map((type, index) => (
              <span key={index} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                {type}
              </span>
            )) || <span>No especificado</span>}
            </div>
          </div>
          <div className="flex items-center">
            <div 
              className="flex items-center px-3 py-1 rounded-full shadow-md" 
              style={{ 
                backgroundColor: getUniversityColor(project.type_aplyuni).main,
                color: getUniversityColor(project.type_aplyuni).text,
              }}
            >
              <GraduationCap className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="font-medium">
                {project.type_aplyuni === 'LIBRE' ? 'LIBRE' : `Solo ${project.type_aplyuni}`}
              </span>
            </div>
          </div>
          <div className={`flex items-center ${project.accepting_applications ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{project.accepting_applications ? 'Aceptando solicitudes' : 'Cerrado'}</span>
          </div>
          <div className="flex items-center dark:text-gray-300 text-gray-600">
            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{project.collaboration_count} Miembros</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${project.creator_name}`} />
            <AvatarFallback>{getInitials(project.creator_name)}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/projects/profiles/${project.responsible}`} className="text-sm font-medium dark:text-white text-gray-900 hover:underline">
              {project.creator_name || 'Sin líder asignado'}
            </Link>
            <p className="text-xs dark:text-gray-400 text-gray-500">Líder del Proyecto</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm dark:text-white text-gray-900">
            <span className="font-medium">Progreso del Proyecto</span>
            <span>{project.progress}% Completo</span>
          </div>
          <Progress value={project.progress} className="h-2 bg-gray-200 dark:bg-gray-700">
            <div className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300 ease-in-out" style={{ width: `${project.progress}%` }} />
          </Progress>
        </div>

        <div className="flex items-center text-sm dark:text-gray-400 text-gray-500">
        <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
        <span>
          Del {formatDate(project.start_date)} al {formatDate(project.end_date)}
        </span>
      </div>
      </CardContent>
      
      <CardFooter className="p-6 flex justify-between items-center border-t dark:border-gray-700 border-gray-200">
        <div className="px-3 py-1 rounded-full text-sm font-medium dark:bg-blue-900 dark:text-blue-100 bg-blue-100 text-blue-800">
          {project.status}
        </div>
        <Button onClick={() => onViewDetails(project)} variant="default" className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600">
          Ver Detalles
        </Button>
      </CardFooter>
    </Card>
  )
})

ProjectCard.displayName = 'ProjectCard'

export { ProjectCard }