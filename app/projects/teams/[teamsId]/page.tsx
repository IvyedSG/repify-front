"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Pencil, Save, X, Trash2, AlertCircle } from 'lucide-react'
import { Project } from '@/types/types'
import ProjectConfigSidebar from '@/components/teams/ProjectConfigSidebar'
import GeneralSection from '@/components/teams/GeneralSection'
import DetailsSection from '@/components/teams/DetailsSection'
import TeamSection from '@/components/teams/TeamSection'
import ProgressSection from '@/components/teams/ProgressSection'
import RequirementsSection from '@/components/teams/RequirementsSection'
import ApplicationsSection from '@/components/teams/AplicationSection'
import ProjectJoinRequests from '@/components/teams/ProjectJoinRequests'

export default function ProjectConfigPage() {
  const { teamsId } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('general')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (session?.user?.accessToken) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/projects/get-project-id/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.user.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_project: Number(teamsId) })
          })
          if (response.ok) {
            const projectData = await response.json();
            setProject({
              ...projectData,
              name_responsible: projectData.name_responsible || 'Unknown'
            });
          } else {
            router.push('/not-found');
          }
        } catch (error) {
          router.push('/not-found');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProjectDetails();
  }, [session, teamsId, router]);

  const handleSave = async () => {
    if (session?.user?.accessToken && project) {
      try {
        const payload = {
          project_id: project.id,
          name: project.name,
          description: project.description,
          start_date: project.start_date,
          end_date: project.end_date,
          status: project.status,
          project_type: project.project_type,
          priority: project.priority,
          responsible: project.responsible,
          name_responsible: project.name_responsible,
          detailed_description: project.detailed_description,
          objectives: project.objectives,
          necessary_requirements: project.necessary_requirements,
          progress: project.progress,
          accepting_applications: project.accepting_applications,
          type_aplyuni: project.type_aplyuni
        };
  
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/projects/update_project/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
  
        if (response.ok) {
          toast({
            title: "Éxito",
            description: "Proyecto actualizado correctamente",
          });
          setIsEditing(false);
        } else {
          throw new Error('Failed to update project');
        }
      } catch (error) {
        console.error('Error updating project:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el proyecto",
          variant: "destructive",
        });
      }
    }
  };
  

  const handleDelete = async () => {
    if (session?.user?.accessToken && project) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/projects/delete_project/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: project.id })
        })
        if (response.ok) {
          toast({
            title: "Éxito",
            description: "Proyecto eliminado correctamente",
          })
          router.push('/projects/teams') 
        } else {
          throw new Error('Failed to delete project')
        }
      } catch (error) {
        console.error('Error deleting project:', error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el proyecto",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="w-16 h-16 mb-4 text-red-500" />
        <p className="text-xl font-semibold text-red-600">{error || 'Project not found'}</p>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between mb-4 lg:flex-row lg:items-center lg:mb-8">
            <h1 className="mb-4 text-2xl font-bold text-gray-800 md:text-3xl lg:text-4xl dark:text-white lg:mb-0">
              {project.name}
            </h1>
            <div className="flex items-center space-x-2 md:space-x-4">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleSave} 
                    className="text-sm text-white bg-green-500 hover:bg-green-600 md:text-base"
                  >
                    <Save className="w-4 h-4 mr-1 md:mr-2" />
                    Guardar Cambios
                  </Button>
                  <Button 
                    onClick={() => setIsEditing(false)} 
                    variant="outline" 
                    className="text-sm md:text-base"
                  >
                    <X className="w-4 h-4 mr-1 md:mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)} 
                  className="text-sm text-white bg-blue-500 hover:bg-blue-600 md:text-base"
                >
                  <Pencil className="w-4 h-4 mr-1 md:mr-2" />
                  Editar Proyecto
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="text-sm md:text-base">
                    <Trash2 className="w-4 h-4 mr-1 md:mr-2" />
                    Eliminar Proyecto
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro de que quieres eliminar este proyecto?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente el proyecto y todos sus datos asociados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
  
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8">
            <ProjectConfigSidebar 
              className="mb-4 lg:col-span-3 lg:mb-0" 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
            />
  
            <Card className="col-span-1 overflow-hidden rounded-lg shadow-lg lg:col-span-9">
              <CardContent className="p-4 md:p-6 lg:p-8">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeSection === 'general' && (
                    <GeneralSection project={project} setProject={setProject} isEditing={isEditing} />
                  )}
                  {activeSection === 'detalles' && (
                    <DetailsSection project={project} setProject={setProject} isEditing={isEditing} />
                  )}
                  {activeSection === 'equipo' && project && (
                    <TeamSection project={project} />
                  )}
                  {activeSection === 'progreso' && (
                    <ProgressSection project={project} setProject={setProject} isEditing={isEditing} />
                  )}
                  {activeSection === 'requerimientos' && (
                    <RequirementsSection project={project} setProject={setProject} isEditing={isEditing} />
                  )}
                  {activeSection === 'aplicaciones' && (
                    <ApplicationsSection project={project} setProject={setProject} isEditing={isEditing} />
                  )}
                  {activeSection === 'solicitudes' && (
                    <ProjectJoinRequests projectId={project.id} />
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );   
}