import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
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

export function DetailedProjectDialog({ project, isOpen, onOpenChange }: DetailedProjectDialogProps) {
  if (!project) return null

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en progreso': return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
      case 'completado': return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
      default: return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[95vw] h-[90vh] max-h-[90vh] sm:max-w-[90vw] sm:h-[80vh] bg-gray-900 text-white p-4 sm:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl sm:text-3xl font-bold">{project.name}</DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-400">{project.description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(100%-6rem)] pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="sm:col-span-2 space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                  {getStatusIcon(project.status)}
                  <span className="text-base sm:text-lg font-medium">{project.status}</span>
                </div>
                <Badge className={`${getPriorityColor(project.priority)} text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1`}>
                  {project.priority}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 text-xs sm:text-sm bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                  <span>Inicio: {project.start_date}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                  <span>Fin: {project.end_date}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                  <span>{project.name_uniuser}</span>
                </div>
                <div className="flex items-center">
                  <Flag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                  <span>{getUniversityDisplay(project.type_aplyuni)}</span>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div className="p-3 sm:p-4 bg-gray-800 rounded-lg">
                <h3 className="flex items-center mb-2 text-base sm:text-lg font-semibold">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                  Descripción Detallada
                </h3>
                <p className="text-xs sm:text-sm text-gray-300">{project.detailed_description}</p>
              </div>

              <div className="p-3 sm:p-4 bg-gray-800 rounded-lg">
                <h3 className="flex items-center mb-2 text-base sm:text-lg font-semibold">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                  Objetivos
                </h3>
                <ul className="text-xs sm:text-sm text-gray-300 list-disc list-inside">
                  {project.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 sm:p-4 bg-gray-800 rounded-lg">
                <h3 className="flex items-center mb-2 text-base sm:text-lg font-semibold">
                  <List className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                  Requisitos Necesarios
                </h3>
                <ul className="text-xs sm:text-sm text-gray-300 list-disc list-inside">
                  {project.necessary_requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="p-3 sm:p-4 bg-gray-800 rounded-lg">
                <h3 className="flex items-center mb-2 text-base sm:text-lg font-semibold">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                  Tipo de Proyecto
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.project_type.map((type, index) => (
                    <Badge key={index} variant="outline" className="text-xs sm:text-sm text-purple-200 bg-purple-900 border-purple-500">{type}</Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-gray-800 rounded-lg">
                <h3 className="flex items-center mb-2 text-base sm:text-lg font-semibold">
                  <BarChart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                  Progreso del Proyecto
                </h3>
                <div className="flex items-center">
                  <Progress value={project.progress} className="flex-grow h-2 bg-gray-700" indicatorClassName="bg-purple-500" />
                  <span className="ml-2 text-xs sm:text-sm font-medium">{project.progress}%</span>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-gray-800 rounded-lg">
                <h3 className="flex items-center mb-2 text-base sm:text-lg font-semibold">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                  Colaboradores ({project.collaboration_count})
                </h3>
                {project.collaborators.length > 0 ? (
                  <ul className="text-xs sm:text-sm text-gray-300 list-disc list-inside">
                    {project.collaborators.map((collaborator, index) => (
                      <li key={index}>{collaborator}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-300">No hay colaboradores aún.</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-800 rounded-lg">
                <span className="flex items-center text-xs sm:text-sm font-medium mb-2 sm:mb-0">
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                  {project.accepting_applications ? "Aceptando solicitudes" : "No aceptando solicitudes"}
                </span>
                <Badge variant={project.accepting_applications ? "default" : "secondary"} className={`text-xs sm:text-sm ${project.accepting_applications ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                  {project.accepting_applications ? "Abierto" : "Cerrado"}
                </Badge>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}