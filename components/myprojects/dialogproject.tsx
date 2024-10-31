import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Flag, Users, CheckCircle, AlertCircle, FileText, Target, List, UserPlus, BarChart } from 'lucide-react'
import { convertToUniversitySiglas } from '@/lib/universityConverter'

interface Project {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  status: string
  project_type: string[]
  priority: string
  detailed_description: string
  objectives: string[]
  necessary_requirements: string[]
  progress: number
  accepting_applications: boolean
  name_uniuser: string
  collaboration_count: number
  collaborators: string[]
  type_aplyuni: string
}

interface DetailedProjectDialogProps {
  project: Project | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function DetailedProjectDialog({ project, isOpen, onOpenChange }: DetailedProjectDialogProps) {
  if (!project) return null

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en progreso': return <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
      case 'completado': return <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
      default: return <Clock className="w-3 h-3 md:w-4 md:h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta': return 'bg-red-500 text-white'
      case 'media': return 'bg-yellow-500 text-black'
      case 'baja': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getUniversityDisplay = (type_aplyuni: string) => {
    if (type_aplyuni.toLowerCase() === "libre") {
      return "Libre"
    } else {
      const siglas = convertToUniversitySiglas(type_aplyuni)
      return `Solo ${siglas}`
    }
  }

  const themeStyles = {
    text: 'text-gray-700',
    subtext: 'text-gray-500',
    icon: 'text-purple-600',
    badge: 'text-purple-700 bg-purple-200 border-purple-400',
    progressBg: 'bg-gray-300',
    progressIndicator: 'bg-purple-600',
    title: 'text-purple-800',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[70vw] md:max-w-[95vw] lg:max-w-[80vw] h-full max-h-[80vh] p-3 md:p-6 overflow-hidden rounded-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-bold md:text-2xl lg:text-3xl">{project.name}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 lg:text-base">{project.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(100%-6rem)] md:h-[calc(100%-8rem)] pr-2 overflow-auto">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4 lg:gap-6">
            
            {/* Información Principal */}
            <div className="space-y-3 md:col-span-2">
              
              {/* Estado y Prioridad */}
              <div className="flex flex-col justify-between p-2 rounded-lg md:flex-row md:p-3">
                <div className="flex items-center mb-2 space-x-2 md:mb-0">
                  {getStatusIcon(project.status)}
                  <span className="text-sm font-medium md:text-base">{project.status}</span>
                </div>
                <Badge className={`text-xs md:text-sm px-2 py-1 ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </Badge>
              </div>

              {/* Fechas e Información de Universidad */}
              <div className="grid grid-cols-1 gap-2 p-2 text-xs rounded-lg md:grid-cols-2 md:p-3 md:text-sm">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1 md:w-4 md:h-4 md:mr-2" />
                  <span>Inicio: {project.start_date}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1 md:w-4 md:h-4 md:mr-2" />
                  <span>Fin: {project.end_date}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1 md:w-4 md:h-4 md:mr-2" />
                  <span>{project.name_uniuser}</span>
                </div>
                <div className="flex items-center">
                  <Flag className="w-3 h-3 mr-1 md:w-4 md:h-4 md:mr-2" />
                  <span>{getUniversityDisplay(project.type_aplyuni)}</span>
                </div>
              </div>

              <Separator className="bg-gray-300" />

              {/* Descripción Detallada */}
              <div className="p-2 rounded-lg md:p-3">
                <h3 className="flex items-center mb-2 text-sm font-semibold md:text-base">
                  <FileText className="w-3 h-3 mr-1 text-purple-600 md:w-4 md:h-4 md:mr-2" />
                  Descripción Detallada
                </h3>
                <p className="text-xs md:text-sm">{project.detailed_description}</p>
              </div>

              {/* Objetivos */}
              <div className="p-2 rounded-lg md:p-3">
                <h3 className="flex items-center mb-2 text-sm font-semibold md:text-base">
                  <Target className="w-3 h-3 mr-1 text-purple-600 md:w-4 md:h-4 md:mr-2" />
                  Objetivos
                </h3>
                <ul className="text-xs list-disc list-inside md:text-sm">
                  {project.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>

              {/* Requisitos */}
              <div className="p-2 rounded-lg md:p-3">
                <h3 className="flex items-center mb-2 text-sm font-semibold md:text-base">
                  <List className="w-3 h-3 mr-1 text-purple-600 md:w-4 md:h-4 md:mr-2" />
                  Requisitos Necesarios
                </h3>
                <ul className="text-xs list-disc list-inside md:text-sm">
                  {project.necessary_requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Información adicional */}
            <div className="space-y-3">
              
              {/* Tipo de Proyecto */}
              <div className="p-2 rounded-lg md:p-3">
                <h3 className="flex items-center mb-2 text-sm font-semibold md:text-base">
                  <FileText className="w-3 h-3 mr-1 text-purple-600 md:w-4 md:h-4 md:mr-2" />
                  Tipo de Proyecto
                </h3>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {project.project_type.map((type, index) => (
                    <Badge key={index} className="text-xs text-purple-700 bg-purple-200 border-purple-400 md:text-sm">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Progreso del Proyecto */}
              <div className="p-2 rounded-lg md:p-3">
                <h3 className="flex items-center mb-2 text-sm font-semibold md:text-base">
                  <BarChart className="w-3 h-3 mr-1 text-purple-600 md:w-4 md:h-4 md:mr-2" />
                  Progreso del Proyecto
                </h3>
                <Progress value={project.progress} className="w-full h-1 bg-gray-300 rounded-full md:h-2">
                  <div className="bg-purple-600" style={{ width: `${project.progress}%` }} />
                </Progress>
                <p className="mt-1 text-xs md:text-sm">{project.progress}% completado</p>
              </div>

              
              <div className="p-2 rounded-lg md:p-3">
                <h3 className="flex items-center mb-2 text-sm font-semibold md:text-base">
                  <UserPlus className="w-3 h-3 mr-1 text-purple-600 md:w-4 md:h-4 md:mr-2" />
                  Miembros ({project.collaboration_count})
                </h3>
                <ul className="text-xs list-disc list-inside md:text-sm">
                  {project.collaborators.map((collaborator, index) => (
                    <li key={index}>{collaborator}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}




