"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Pencil, Save, X, Trash2 } from 'lucide-react'
import { Project } from '@/types/types'
import ProjectConfigSidebar from '@/components/teams/ProjectConfigSidebar'
import GeneralSection from '@/components/teams/GeneralSection'
import DetailsSection from '@/components/teams/DetailsSection'
import TeamSection from '@/components/teams/TeamSection'
import ProgressSection from '@/components/teams/ProgressSection'
import RequirementsSection from '@/components/teams/RequirementsSection'
import ApplicationsSection from '@/components/teams/AplicationSection'

export default function ProjectConfigPage() {
  const { teamsId } = useParams()
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
          const response = await fetch('http://127.0.0.1:8000/usuario/projects/get-project-id/', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.user.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_project: Number(teamsId) })
          })
          if (response.ok) {
            const projectData = await response.json()
            setProject(projectData)
          } else {
            setError('Failed to fetch project details')
          }
        } catch (error) {
          console.error('Error fetching project details:', error)
          setError('Error fetching project details')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchProjectDetails()
  }, [session, teamsId])

  const handleSave = async () => {
    if (session?.user?.accessToken && project) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/usuario/projects/update-project/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id_project: project.id,
            name: project.name,
            description: project.description,
            start_date: project.start_date,
            end_date: project.end_date,
            status: project.status,
            project_type: project.project_type.join(', '),
            priority: project.priority,
            responsible: 0, // Assuming this is not editable in the UI
            detailed_description: project.detailed_description,
            objectives: project.objectives,
            necessary_requirements: project.necessary_requirements,
            progress: project.progress,
            accepting_applications: project.accepting_applications,
            type_aplyuni: project.type_aplyuni,
            name_responsible: project.name_responsible
          })
        })
        if (response.ok) {
          toast({
            title: "Éxito",
            description: "Proyecto actualizado correctamente",
          })
          setIsEditing(false)
        } else {
          throw new Error('Failed to update project')
        }
      } catch (error) {
        console.error('Error updating project:', error)
        toast({
          title: "Error",
          description: "No se pudo actualizar el proyecto",
          variant: "destructive",
        })
      }
    }
  }

  const handleDelete = async () => {
    // This is a placeholder for the delete functionality
    toast({
      title: "Información",
      description: "La funcionalidad de eliminación aún no está implementada.",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-xl font-semibold text-red-600">{error || 'Project not found'}</p>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{project.name}</h1>
            <div className="flex items-center space-x-4">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar Proyecto
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
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

          <div className="grid grid-cols-12 gap-8">
            <ProjectConfigSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

            <Card className="col-span-9 shadow-lg rounded-lg overflow-hidden">
              <CardContent className="p-6">
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
                  {activeSection === 'details' && (
                    <DetailsSection project={project} setProject={setProject} isEditing={isEditing} />
                  )}
                  {activeSection === 'team' && (
                    <TeamSection project={project} />
                  )}
                  {activeSection === 'progress' && (
                    <ProgressSection project={project} setProject={setProject} isEditing={isEditing} />
                  )}
                  {activeSection === 'requirements' && (
                    <RequirementsSection project={project} setProject={setProject} isEditing={isEditing} />
                  )}
                  {activeSection === 'applications' && (
                    <ApplicationsSection project={project} setProject={setProject} isEditing={isEditing} />
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}