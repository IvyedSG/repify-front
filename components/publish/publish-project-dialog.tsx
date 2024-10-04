'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { ProjectBasicInfo } from './project-basic-info'
import { ProjectDetails } from './project-details'
import { ProjectAdditionalInfo } from './project-additional-info'

interface PublishProjectDialogProps {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function PublishProjectDialog({ setIsDialogOpen }: PublishProjectDialogProps) {
  const { data: session } = useSession()
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
    expected_benefits: '',
    necessary_requirements: '',
    progress: 0,
    accepting_applications: true,
    type_aplyuni: 'LIBRE'
  })

  const handleInputChange = (name: string, value: any) => {
    setNewProject(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const projectData = {
      ...newProject,
      project_type: newProject.project_type.join(', '),
      responsible: session?.user.id,
      progress: parseInt(newProject.progress.toString(), 10),
      type_aplyuni: newProject.type_aplyuni === 'LIBRE' ? 'LIBRE' : session?.user.university
    }
  
    console.log('Data being sent:', projectData)

    try {
      const response = await fetch('http://127.0.0.1:8000/usuario/projects/create_proyect/', {
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
      } else {
        throw new Error('Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      toast({
        title: "Error",
        description: "Hubo un problema al crear el proyecto. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader>
        <DialogTitle>Publicar Nuevo Proyecto</DialogTitle>
        <DialogDescription>
          Completa la información de tu nuevo proyecto. Avanza por los pasos para llenar todos los detalles.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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