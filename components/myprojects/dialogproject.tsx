import React from 'react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Flag, Users, CheckCircle, AlertCircle, FileText, Target, List, UserPlus, BarChart } from 'lucide-react'
import { convertToUniversitySiglas } from '@/lib/universityConverter'

interface Collaborator {
  id: number;
  name: string;
}

interface Project {
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
  project: Project | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DetailedProjectDialog({ project, isOpen, onOpenChange }: DetailedProjectDialogProps) {
  if (!project) return null;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en progreso': return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'completado': return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
      default: return <Clock className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta': return 'bg-red-500 text-white';
      case 'media': return 'bg-yellow-500 text-black';
      case 'baja': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getUniversityDisplay = (type_aplyuni: string) => {
    if (type_aplyuni?.toLowerCase() === "libre") {
      return "Libre";
    } else {
      const siglas = convertToUniversitySiglas(type_aplyuni || '');
      return `Solo ${siglas}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[95vw] overflow-hidden p-0 sm:max-h-[85vh] sm:max-w-[85vw] md:max-w-[75vw]">
        <DialogHeader className="px-4 py-3 sm:p-6">
          <DialogTitle className="text-xl font-bold sm:text-2xl">{project.name}</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">{project.description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-8rem)] px-4 sm:h-[calc(85vh-9rem)] sm:px-6">
          <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-3 sm:gap-6">
            <div className="space-y-4 sm:col-span-2">
              <div className="flex flex-col justify-between p-3 rounded-lg bg-muted/50 sm:flex-row sm:items-center sm:p-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(project.status)}
                  <span className="text-sm font-medium sm:text-base">{project.status}</span>
                </div>
                <Badge
                  className={`${getPriorityColor(project.priority)} mt-2 w-fit text-xs sm:mt-0 sm:text-sm`}
                >
                  {project.priority}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 p-3 text-xs rounded-lg bg-muted/50 sm:grid-cols-2 sm:gap-4 sm:p-4 sm:text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 shrink-0 sm:h-5 sm:w-5" />
                  <span className="truncate">Inicio: {project.start_date}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 shrink-0 sm:h-5 sm:w-5" />
                  <span className="truncate">Fin: {project.end_date}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 shrink-0 sm:h-5 sm:w-5" />
                  <span className="truncate">{project.name_uniuser}</span>
                </div>
                <div className="flex items-center">
                  <Flag className="w-4 h-4 mr-2 shrink-0 sm:h-5 sm:w-5" />
                  <span className="truncate">{getUniversityDisplay(project.type_aplyuni)}</span>
                </div>
              </div>

              <Separator />

              <div className="p-3 rounded-lg bg-muted/50 sm:p-4">
                <h3 className="flex items-center text-base font-semibold sm:text-lg">
                  <FileText className="w-4 h-4 mr-2 shrink-0 sm:h-5 sm:w-5" />
                  Descripción Detallada
                </h3>
                <p className="mt-2 text-xs sm:text-sm">{project.detailed_description}</p>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 sm:p-4">
                <h3 className="flex items-center text-base font-semibold sm:text-lg">
                  <Target className="w-4 h-4 mr-2 shrink-0 sm:h-5 sm:w-5" />
                  Objetivos
                </h3>
                <ul className="mt-2 text-xs list-disc list-inside sm:text-sm">
                  {project.objectives.map((objective: string, index: number) => (
                    <li key={index} className="truncate">
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 sm:p-4">
                <h3 className="flex items-center text-base font-semibold sm:text-lg">
                  <List className="w-4 h-4 mr-2 shrink-0 sm:h-5 sm:w-5" />
                  Requisitos del Proyecto
                </h3>
                <ul className="mt-2 text-xs list-disc list-inside sm:text-sm">
                  {project.necessary_requirements.map((requirement: string, index: number) => (
                    <li key={index} className="truncate">
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 sm:p-4">
                <h3 className="flex items-center text-base font-semibold sm:text-lg">
                  <FileText className="w-4 h-4 mr-2 shrink-0 sm:h-5 sm:w-5" />
                  Tipo de Proyecto
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.project_type.map((type: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs sm:text-sm">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 sm:p-4">
                <h3 className="flex items-center text-base font-semibold sm:text-lg">
                  <BarChart className="w-4 h-4 mr-2 shrink-0 sm:h-5 sm:w-5" />
                  Progreso del Proyecto
                </h3>
                <div className="flex items-center mt-2">
                  <Progress value={project.progress} className="flex-grow h-2" />
                  <span className="ml-2 text-xs font-medium sm:text-sm">{project.progress}%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 sm:p-4">
                <h3 className="flex items-center text-base font-semibold sm:text-lg">
                  <Users className="w-4 h-4 mr-2 shrink-0 sm:h-5 sm:w-5" />
                  Miembros ({project.collaboration_count})
                </h3>
                {project.collaborators.length > 0 ? (
                  <ul className="mt-2 text-xs list-disc list-inside sm:text-sm">
                    {project.collaborators.map((collaborator: any) => (
                      <li key={collaborator.id} className="truncate">
                        <Link href={`/projects/profiles/${collaborator.id}`} className="hover:underline">
                          {collaborator.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs sm:text-sm">No hay colaboradores aún.</p>
                )}
              </div>

              <div className="flex flex-col justify-between p-3 rounded-lg bg-muted/50 sm:flex-row sm:items-center sm:p-4">
                <span className="flex items-center text-xs font-medium sm:text-sm">
                  <UserPlus className="w-4 h-4 mr-2 shrink-0 sm:h-5 sm:w-5" />
                  {project.accepting_applications ? "Aceptando solicitudes" : "No aceptando solicitudes"}
                </span>
                <Badge
                  variant={project.accepting_applications ? "default" : "secondary"}
                  className={`mt-2 w-fit text-xs sm:mt-0 sm:text-sm ${
                    project.accepting_applications ? "bg-green-500" : "bg-gray-500"
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