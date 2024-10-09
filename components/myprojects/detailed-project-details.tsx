import { Dialog, DialogContent, DialogHeader, DialogTitle } from  "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Flag, Users } from "lucide-react"

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

type DetailedProjectDialogProps = {
  project: Project | null
}

export function DetailedProjectDialog({ project }: DetailedProjectDialogProps) {
  if (!project) return null

  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>{project.name}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 items-center gap-4">
          <Badge>{project.status}</Badge>
          <div className="flex items-center">
            <Flag className={`h-4 w-4 mr-2 ${getPriorityColor(project.priority)}`} />
            <span>{project.priority}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{project.start_date} - {project.end_date}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>{project.name_uniuser}</span>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Descripción Detallada</h4>
          <p className="text-sm">{project.detailed_description}</p>
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
          <p className="text-sm">{project.type_aplyuni}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Beneficios Esperados</h4>
          <p className="text-sm">{project.expected_benefits}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Requisitos Necesarios</h4>
          <p className="text-sm">{project.necessary_requirements}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Progreso del Proyecto</h4>
          <div className="flex items-center">
            <Progress value={project.progress} className="flex-grow h-2" />
            <span className="ml-2 text-sm font-medium">{project.progress}%</span>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Estado de Aplicaciones</h4>
          <Badge variant={project.accepting_applications ? "default" : "secondary"}>
            {project.accepting_applications ? "Aceptando Aplicaciones" : "Aplicaciones Cerradas"}
          </Badge>
        </div>
      </div>
    </DialogContent>
  )
}

function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case 'alta': return 'text-red-500'
    case 'media': return 'text-yellow-500'
    case 'baja': return 'text-green-500'
    default: return 'text-gray-500'
  }
}