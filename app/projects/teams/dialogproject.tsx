import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Flag, Users, CheckCircle, AlertCircle, FileText, Target, List, UserPlus, BarChart } from 'lucide-react'

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
      case 'en progreso': return <AlertCircle className="h-5 w-5 text-blue-500" />
      case 'completado': return <CheckCircle className="h-5 w-5 text-green-500" />
      default: return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta': return 'bg-red-100 text-red-800'
      case 'media': return 'bg-yellow-100 text-yellow-800'
      case 'baja': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{project.name}</DialogTitle>
          <DialogDescription>{project.description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(project.status)}
                <span className="font-medium">{project.status}</span>
              </div>
              <Badge className={getPriorityColor(project.priority)}>
                {project.priority}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Inicio: {project.start_date}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Fin: {project.end_date}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>{project.name_uniuser}</span>
              </div>
              <div className="flex items-center">
                <Flag className="h-4 w-4 mr-2" />
                <span>{project.type_aplyuni === "LIBRE" ? "Libre" : "Solo UPC"}</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Descripción Detallada
              </h3>
              <p className="text-sm text-gray-600">{project.detailed_description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Objetivos
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {project.objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <List className="h-4 w-4 mr-2" />
                Requisitos Necesarios
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {project.necessary_requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Tipo de Proyecto
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.project_type.map((type, index) => (
                  <Badge key={index} variant="outline">{type}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Progreso del Proyecto
              </h3>
              <div className="flex items-center">
                <Progress value={project.progress} className="flex-grow h-2" />
                <span className="ml-2 text-sm font-medium">{project.progress}%</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Colaboradores ({project.collaboration_count})
              </h3>
              {project.collaborators.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {project.collaborators.map((collaborator, index) => (
                    <li key={index}>{collaborator}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">No hay colaboradores aún.</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center">
                <UserPlus className="h-4 w-4 mr-2" />
                {project.accepting_applications ? "Aceptando solicitudes" : "No aceptando solicitudes"}
              </span>
              <Badge variant={project.accepting_applications ? "default" : "secondary"}>
                {project.accepting_applications ? "Abierto" : "Cerrado"}
              </Badge>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}