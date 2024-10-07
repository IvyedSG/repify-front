import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Flag, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react'

type Project = {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  status: string
  project_type: string[]
  priority: string
  responsible: number
  detailed_description: string
  type_aplyuni: string
  expected_benefits: string
  necessary_requirements: string
  progress: number
  accepting_applications: boolean
  name_uniuser: string
}

interface DetailedProjectDialogProps {
  project: Project | null
}

export function DetailedProjectDialog({ project }: DetailedProjectDialogProps) {
  if (!project) return null

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en espera': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'en progreso': return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'completado': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta': return 'text-red-500'
      case 'media': return 'text-yellow-500'
      case 'baja': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>{project.name}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 items-center gap-4">
          <div className="flex items-center">
            {getStatusIcon(project.status)}
            <span className="ml-2">{project.status}</span>
          </div>
          <div className="flex items-center">
            <Flag className={`h-4 w-4 ${getPriorityColor(project.priority)}`} />
            <span className="ml-2">{project.priority}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="ml-2">Inicio: {project.start_date}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="ml-2">Fin: {project.end_date}</span>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Descripción</h4>
          <p className="text-sm text-gray-500">{project.description}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Descripción Detallada</h4>
          <p className="text-sm text-gray-500">{project.detailed_description}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Tipo de Proyecto</h4>
          <div className="flex flex-wrap gap-2">
            {project.project_type.map((type, index) => (
              <Badge key={index} variant="outline">{type}</Badge>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Tipo de Aplicación Universitaria</h4>
          <p className="text-sm text-gray-500">{project.type_aplyuni}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Beneficios Esperados</h4>
          <p className="text-sm text-gray-500">{project.expected_benefits}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Requisitos Necesarios</h4>
          <p className="text-sm text-gray-500">{project.necessary_requirements}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Progreso del Proyecto</h4>
          <div className="flex items-center">
            <Progress value={project.progress} className="flex-grow h-2" />
            <span className="ml-2 text-sm font-medium">{project.progress}%</span>
          </div>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 text-gray-500 mr-2" />
          <span>Responsable: {project.name_uniuser}</span>
        </div>
        <div>
          <Badge variant={project.accepting_applications ? "default" : "secondary"}>
            {project.accepting_applications ? "Aceptando aplicaciones" : "No aceptando aplicaciones"}
          </Badge>
        </div>
      </div>
    </DialogContent>
  )
}