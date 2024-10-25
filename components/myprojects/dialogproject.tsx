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
  isDarkMode: boolean
}

export function DetailedProjectDialog({ project, isOpen, onOpenChange, isDarkMode }: DetailedProjectDialogProps) {
  if (!project) return null

  const getStatusIcon = (status: string) => {
    const iconColor = isDarkMode ? {
      'en progreso': "text-blue-500",
      'completado': "text-green-500",
      'default': "text-yellow-500"
    } : {
      'en progreso': "text-blue-600",
      'completado': "text-green-600",
      'default': "text-yellow-600"
    }

    switch (status.toLowerCase()) {
      case 'en progreso': return <AlertCircle className={`w-4 h-4 ${iconColor['en progreso']} sm:w-5 sm:h-5`} />
      case 'completado': return <CheckCircle className={`w-4 h-4 ${iconColor['completado']} sm:w-5 sm:h-5`} />
      default: return <Clock className={`w-4 h-4 ${iconColor['default']} sm:w-5 sm:h-5`} />
    }
  }

  const getPriorityColor = (priority: string) => {
    if (isDarkMode) {
      switch (priority.toLowerCase()) {
        case 'alta': return 'bg-red-500 text-white'
        case 'media': return 'bg-yellow-500 text-black'
        case 'baja': return 'bg-green-500 text-white'
        default: return 'bg-gray-500 text-white'
      }
    } else {
      switch (priority.toLowerCase()) {
        case 'alta': return 'bg-red-100 text-red-800'
        case 'media': return 'bg-yellow-100 text-yellow-800'
        case 'baja': return 'bg-green-100 text-green-800'
        default: return 'bg-gray-100 text-gray-800'
      }
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
    background: isDarkMode ? 'bg-gray-900' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-800',
    subtext: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    sectionBg: isDarkMode ? 'bg-gray-800' : 'bg-gray-100',
    separator: isDarkMode ? 'bg-gray-700' : 'bg-gray-300',
    icon: isDarkMode ? 'text-purple-400' : 'text-purple-600',
    badge: isDarkMode ? 'text-purple-200 bg-purple-900 border-purple-500' : 'text-purple-800 bg-purple-100 border-purple-300',
    progressBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-300',
    progressIndicator: isDarkMode ? 'bg-purple-500' : 'bg-purple-600',
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`w-[95vw] max-w-[95vw] h-[90vh] max-h-[90vh] sm:max-w-[90vw] sm:h-[80vh] ${themeStyles.background} ${themeStyles.text} p-4 sm:p-6`}>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold sm:text-3xl">{project.name}</DialogTitle>
          <DialogDescription className={`text-sm ${themeStyles.subtext} sm:text-base`}>{project.description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(100%-6rem)] pr-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            <div className="space-y-4 sm:col-span-2 sm:space-y-6">
              <div className={`flex flex-col justify-between p-3 ${themeStyles.sectionBg} rounded-lg sm:flex-row sm:items-center sm:p-4`}>
                <div className="flex items-center mb-2 space-x-2 sm:mb-0">
                  {getStatusIcon(project.status)}
                  <span className="text-base font-medium sm:text-lg">{project.status}</span>
                </div>
                <Badge className={`${getPriorityColor(project.priority)} text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1`}>
                  {project.priority}
                </Badge>
              </div>

              <div className={`grid grid-cols-1 gap-3 p-3 text-xs ${themeStyles.sectionBg} rounded-lg sm:grid-cols-2 sm:gap-4 sm:p-4 sm:text-sm`}>
                <div className="flex items-center">
                  <Calendar className={`w-4 h-4 mr-2 ${themeStyles.icon} sm:w-5 sm:h-5`} />
                  <span>Inicio: {project.start_date}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className={`w-4 h-4 mr-2 ${themeStyles.icon} sm:w-5 sm:h-5`} />
                  <span>Fin: {project.end_date}</span>
                </div>
                <div className="flex items-center">
                  <Users className={`w-4 h-4 mr-2 ${themeStyles.icon} sm:w-5 sm:h-5`} />
                  <span>{project.name_uniuser}</span>
                </div>
                <div className="flex items-center">
                  <Flag className={`w-4 h-4 mr-2 ${themeStyles.icon} sm:w-5 sm:h-5`} />
                  <span>{getUniversityDisplay(project.type_aplyuni)}</span>
                </div>
              </div>

              <Separator className={themeStyles.separator} />

              <div className={`p-3 ${themeStyles.sectionBg} rounded-lg sm:p-4`}>
                <h3 className="flex items-center mb-2 text-base font-semibold sm:text-lg">
                  <FileText className={`w-4 h-4 mr-2 ${themeStyles.icon} sm:w-5 sm:h-5`} />
                  Descripción Detallada
                </h3>
                <p className={`text-xs ${themeStyles.subtext} sm:text-sm`}>{project.detailed_description}</p>
              </div>

              <div className={`p-3 ${themeStyles.sectionBg} rounded-lg sm:p-4`}>
                <h3 className="flex items-center mb-2 text-base font-semibold sm:text-lg">
                  <Target className={`w-4 h-4 mr-2 ${themeStyles.icon} sm:w-5 sm:h-5`} />
                  Objetivos
                </h3>
                <ul className={`text-xs ${themeStyles.subtext} list-disc list-inside sm:text-sm`}>
                  {project.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>

              <div className={`p-3 ${themeStyles.sectionBg} rounded-lg sm:p-4`}>
                <h3 className="flex items-center mb-2 text-base font-semibold sm:text-lg">
                  <List className={`w-4 h-4 mr-2 ${themeStyles.icon} sm:w-5 sm:h-5`} />
                  Requisitos Necesarios
                </h3>
                <ul className={`text-xs ${themeStyles.subtext} list-disc list-inside sm:text-sm`}>
                  {project.necessary_requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className={`p-3 ${themeStyles.sectionBg} rounded-lg sm:p-4`}>
                <h3 className="flex items-center mb-2 text-base font-semibold sm:text-lg">
                  <FileText className={`w-4 h-4 mr-2 ${themeStyles.icon} sm:w-5 sm:h-5`} />
                  Tipo de Proyecto
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.project_type.map((type, index) => (
                    <Badge key={index} variant="outline" className={`text-xs ${themeStyles.badge} sm:text-sm`}>{type}</Badge>
                  ))}
                </div>
              </div>

              <div className={`p-3 ${themeStyles.sectionBg} rounded-lg sm:p-4`}>
                <h3 className="flex items-center mb-2 text-base font-semibold sm:text-lg">
                  <BarChart className={`w-4 h-4 mr-2 ${themeStyles.icon} sm:w-5 sm:h-5`} />
                  Progreso del Proyecto
                </h3>
                <div className="flex items-center">
                  <Progress value={project.progress} className={`flex-grow h-2 ${themeStyles.progressBg}`} indicatorClassName={themeStyles.progressIndicator} />
                  <span className="ml-2 text-xs font-medium sm:text-sm">{project.progress}%</span>
                </div>
              </div>

              <div className={`p-3 ${themeStyles.sectionBg} rounded-lg sm:p-4`}>
                <h3 className="flex items-center mb-2 text-base font-semibold sm:text-lg">
                  <Users className={`w-4 h-4 mr-2 ${themeStyles.icon} sm:w-5 sm:h-5`} />
                  Colaboradores ({project.collaboration_count})
                </h3>
                {project.collaborators.length > 0 ? (
                  <ul className={`text-xs ${themeStyles.subtext} list-disc list-inside sm:text-sm`}>
                    {project.collaborators.map((collaborator, index) => (
                      <li key={index}>{collaborator}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={`text-xs ${themeStyles.subtext} sm:text-sm`}>No hay colaboradores aún.</p>
                )}
              </div>

              <div className={`flex flex-col justify-between p-3 ${themeStyles.sectionBg} rounded-lg sm:flex-row sm:items-center sm:p-4`}>
                <span className="flex items-center mb-2 text-xs font-medium sm:text-sm sm:mb-0">
                  <UserPlus className={`w-4 h-4 mr-2 ${themeStyles.icon} sm:w-5 sm:h-5`} />
                  {project.accepting_applications ? "Aceptando solicitudes" : "No aceptando solicitudes"}
                </span>
                <Badge 
                  variant={project.accepting_applications ? "default" : "secondary"} 
                  className={`text-xs sm:text-sm ${
                    project.accepting_applications 
                      ? (isDarkMode ? "bg-green-500 text-white" : "bg-green-100 text-green-800")
                      : (isDarkMode ? "bg-gray-500 text-white" : "bg-gray-100 text-gray-800")
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