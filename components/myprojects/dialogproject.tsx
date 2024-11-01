import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Flag, Users, CheckCircle, AlertCircle, FileText, Target, List, UserPlus, BarChart } from 'lucide-react'
import { convertToUniversitySiglas } from '@/lib/universityConverter'

type Collaborator = {
  id: number;
  name: string;
}

type Project = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  project_type: string[];
  priority: string;
  responsible: number;
  name_responsible: string;
  detailed_description: string;
  type_aplyuni: string;
  objectives: string[];
  necessary_requirements: string[];
  progress: number;
  accepting_applications: boolean;
  name_uniuser: string;
  collaboration_count: number;
  collaborators: Collaborator[];
}

interface DetailedProjectDialogProps {
  project: Project | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function DetailedProjectDialog({ project, isOpen, onOpenChange }: DetailedProjectDialogProps) {
  if (!project) return null

  // Ensure array properties exist with fallbacks
  const projectTypes = Array.isArray(project.project_type) ? project.project_type : []
  const objectives = Array.isArray(project.objectives) ? project.objectives : []
  const requirements = Array.isArray(project.necessary_requirements) ? project.necessary_requirements : []
  const collaborators = Array.isArray(project.collaborators) ? project.collaborators : []

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en progreso': return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
      case 'completado': return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
      default: return <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
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
    if (type_aplyuni?.toLowerCase() === "libre") {
      return "Libre"
    } else {
      const siglas = convertToUniversitySiglas(type_aplyuni || '')
      return `Solo ${siglas}`
    }
  }

  // Ensure primitive values have fallbacks
  const name = typeof project.name === 'string' ? project.name : ''
  const description = typeof project.description === 'string' ? project.description : ''
  const status = typeof project.status === 'string' ? project.status : ''
  const priority = typeof project.priority === 'string' ? project.priority : ''
  const startDate = typeof project.start_date === 'string' ? project.start_date : ''
  const endDate = typeof project.end_date === 'string' ? project.end_date : ''
  const nameUniuser = typeof project.name_uniuser === 'string' ? project.name_uniuser : ''
  const detailedDescription = typeof project.detailed_description === 'string' ? project.detailed_description : ''
  const progress = typeof project.progress === 'number' ? project.progress : 0
  const collaborationCount = typeof project.collaboration_count === 'number' ? project.collaboration_count : 0

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[95vw] h-[90vh] max-h-[90vh] sm:max-w-[90vw] sm:h-[80vh] p-4 sm:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold sm:text-3xl">{name}</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">{description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(100%-6rem)] pr-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            <div className="space-y-4 sm:col-span-2 sm:space-y-6">
              <div className="flex flex-col justify-between p-3 rounded-lg sm:flex-row sm:items-center sm:p-4">
                <div className="flex items-center mb-2 space-x-2 sm:mb-0">
                  {getStatusIcon(status)}
                  <span className="text-base font-medium sm:text-lg">{status}</span>
                </div>
                <Badge className={`${getPriorityColor(priority)} text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1`}>
                  {priority}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 p-3 text-xs rounded-lg sm:grid-cols-2 sm:gap-4 sm:p-4 sm:text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                  <span>Inicio: {startDate}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                  <span>Fin: {endDate}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                  <span>{nameUniuser}</span>
                </div>
                <div className="flex items-center">
                  <Flag className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                  <span>{getUniversityDisplay(project.type_aplyuni)}</span>
                </div>
              </div>

              <Separator />

              <div className="p-3 rounded-lg sm:p-4">
                <h3 className="flex items-center mb-2 text-base font-semibold sm:text-lg">
                  <FileText className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                  Descripción Detallada
                </h3>
                <p className="text-xs sm:text-sm">{detailedDescription}</p>
              </div>

              <div className="p-3 rounded-lg sm:p-4">
                <h3 className="flex items-center mb-2 text-base font-semibold sm:text-lg">
                  <Target className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                  Objetivos
                </h3>
                <ul className="text-xs list-disc list-inside sm:text-sm">
                  {objectives.map((objective, index) => (
                    <li key={index}>{typeof objective === 'string' ? objective : ''}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg sm:p-4">
                <h3 className="flex items-center mb-2 text-base font-semibold sm:text-lg">
                  <List className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                  Requisitos Necesarios
                </h3>
                <ul className="text-xs list-disc list-inside sm:text-sm">
                  {requirements.map((requirement, index) => (
                    <li key={index}>{typeof requirement === 'string' ? requirement : ''}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="p-3 rounded-lg sm:p-4">
                <h3 className="flex items-center mb-2 text-base font-semibold sm:text-lg">
                  <FileText className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                  Tipo de Proyecto
                </h3>
                <div className="flex flex-wrap gap-2">
                  {projectTypes.map((type, index) => (
                    <Badge key={index} variant="outline" className="text-xs sm:text-sm">
                      {typeof type === 'string' ? type : ''}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg sm:p-4">
                <h3 className="flex items-center mb-2 text-base font-semibold sm:text-lg">
                  <BarChart className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                  Progreso del Proyecto
                </h3>
                <div className="flex items-center">
                  <Progress value={progress} className="flex-grow h-2" />
                  <span className="ml-2 text-xs font-medium sm:text-sm">{progress}%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg sm:p-4">
                <h3 className="flex items-center mb-2 text-base font-semibold sm:text-lg">
                  <Users className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                  Colaboradores ({collaborationCount})
                </h3>
                {collaborators.length > 0 ? (
                  <ul className="text-xs list-disc list-inside sm:text-sm">
                    {collaborators.map((collaborator, index) => (
                      <li key={index}>{typeof collaborator === 'string' ? collaborator : ''}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs sm:text-sm">No hay colaboradores aún.</p>
                )}
              </div>

              <div className="flex flex-col justify-between p-3 rounded-lg sm:flex-row sm:items-center sm:p-4">
                <span className="flex items-center mb-2 text-xs font-medium sm:text-sm sm:mb-0">
                  <UserPlus className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                  {project.accepting_applications ? "Aceptando solicitudes" : "No aceptando solicitudes"}
                </span>
                <Badge 
                  variant={project.accepting_applications ? "default" : "secondary"} 
                  className={`text-xs sm:text-sm ${
                    project.accepting_applications 
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
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