'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { ProjectBasicInfo } from './project-basic-info'
import { ProjectDetails } from './project-details'
import { ProjectAdditionalInfo } from './project-additional-info'
import { convertToUniversitySiglas } from '@/lib/universityConverter'

interface PublishProjectDialogProps {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function PublishProjectDialog({ setIsDialogOpen }: PublishProjectDialogProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    end_date: '',
    status: '',
    project_type: [] as string[],
    priority: '',
    detailed_description: '',
    objectives: [] as string[],
    necessary_requirements: [] as string[],
    progress: 0,
    accepting_applications: true,
    type_aplyuni: 'LIBRE'
  })

  const handleInputChange = (name: string, value: any) => {
    setNewProject(prev => ({ ...prev, [name]: value }))
  }

  const validateAchievements = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/achievement/validate_achievements/`, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${session?.user.accessToken}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to validate achievements')
      }
    } catch (error) {
      console.error('Error validating achievements:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const requiredFields = ['name', 'description', 'end_date', 'status', 'project_type', 'priority', 'detailed_description']
    const missingFields = requiredFields.filter(field => !newProject[field as keyof typeof newProject])

    if (missingFields.length > 0 || newProject.objectives.length === 0 || newProject.necessary_requirements.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos requeridos y asegúrese de incluir al menos un objetivo y un requisito.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    const projectData = {
      name: newProject.name,
      description: newProject.description,
      end_date: newProject.end_date,
      status: newProject.status,
      project_type: newProject.project_type,
      priority: newProject.priority,
      detailed_description: newProject.detailed_description,
      objectives: newProject.objectives,
      necessary_requirements: newProject.necessary_requirements,
      progress: parseInt(newProject.progress.toString(), 10),
      accepting_applications: newProject.accepting_applications,
      type_aplyuni: newProject.type_aplyuni === 'LIBRE' ? 'LIBRE' : convertToUniversitySiglas(session?.user.university || '')
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/projects/create_project/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user.accessToken}`
        },
        body: JSON.stringify(projectData)
      })

      if (response.ok) {
        toast({
          title: "Proyecto creado",
          description: "Tu proyecto ha sido publicado exitosamente.",
        })
        setIsDialogOpen(false)
        
        // Refresh the current route
        router.refresh()

        // Validate achievements after successful project creation
        await validateAchievements()

        // Enviar evento a Google Tag Manager (GTM) en caso de éxito
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'project_created',
            user: {
              email: session?.user.email,
              university: session?.user.university,
              career: session?.user.career,
            },
            project: {
              name: newProject.name,
              description: newProject.description,
              status: newProject.status,
              type: newProject.project_type,
            }
          })
        }
      } else {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un problema al crear el proyecto. Por favor, intenta de nuevo.",
        variant: "destructive",
      })

      // Enviar evento a GTM en caso de error
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'project_creation_failed',
          user: {
            email: session?.user.email,
            university: session?.user.university,
            career: session?.user.career,
          },
          project: {
            name: newProject.name,
            description: newProject.description,
          }
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep === 1) {
      if (!newProject.name || !newProject.description || newProject.project_type.length === 0) {
        toast({
          title: "Error",
          description: "Por favor, complete todos los campos antes de continuar.",
          variant: "destructive",
        })
        return
      }
    } else if (currentStep === 2) {
      if (!newProject.status || !newProject.priority || !newProject.end_date) {
        toast({
          title: "Error",
          description: "Por favor, complete todos los campos antes de continuar.",
          variant: "destructive",
        })
        return
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3))
  }

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <DialogContent className="sm:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>Publicar Nuevo Proyecto</DialogTitle>
        <DialogDescription>
          Completa la información de tu nuevo proyecto. Avanza por los pasos para llenar todos los detalles.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-8">
        {currentStep === 1 && (
          <ProjectBasicInfo 
            newProject={newProject} 
            handleInputChange={handleInputChange} 
          />
        )}

        {currentStep === 2 && (
          <ProjectDetails 
            newProject={newProject} 
            handleInputChange={handleInputChange} 
          />
        )}

        {currentStep === 3 && (
          <ProjectAdditionalInfo 
            newProject={newProject} 
            handleInputChange={handleInputChange} 
            userUniversity={session?.user.university}
          />
        )}

        <DialogFooter>
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              Anterior
            </Button>
          )}
          {currentStep < 3 ? (
            <Button type="button" onClick={nextStep}>
              Siguiente
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                'Publicar Proyecto'
              )}
            </Button>
          )}
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
