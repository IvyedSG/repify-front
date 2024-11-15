'use client'

import React, { useState, useEffect, lazy, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import PageContainer from '@/components/layout/page-container'
import { toast } from '@/components/ui/use-toast'
import { useTheme } from "next-themes"
import { ProjectSkeleton } from '@/components/skeletons/ProjectSkeleton'
import { ApplicationDialog } from '@/components/projectid/application-dialog'

const ProjectDetails = lazy(() => import('@/components/projectid/ProjectDetails'))
const ProjectObjectives = lazy(() => import('@/components/projectid/ProjectObjectives'))
const ProjectRequirements = lazy(() => import('@/components/projectid/ProjectRequirements'))
const ProjectProgress = lazy(() => import('@/components/projectid/ProjectProgress'))
const ProjectLeader = lazy(() => import('@/components/projectid/ProjectLeader'))

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
  name_uniuser: string;
  detailed_description: string;
  objectives: string[];
  progress: number;
  necessary_requirements: string[];
  accepting_applications: boolean;
  type_aplyuni: string;
  creator_name: string;
  collaboration_count: number;
  has_applied: boolean;
  photo?: string;
}

export default function ProjectDetailsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { theme } = useTheme()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const projectId = window.location.pathname.split('/').pop()
      if (!projectId) return

      try {
        const response = await fetch(`${process.env.NEXT_SECRET_API_URL}/usuario/projects/view_project_id/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.user.accessToken}`
          },
          body: JSON.stringify({ id: parseInt(projectId) })
        })

        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          router.push('/not-found');
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        router.push('/not-found');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchProjectDetails();
    }
  }, [session, router]);

  const validateAchievements = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_SECRET_API_URL}/usuario/achievement/validate_achievements/`, {
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

  const handleApply = async (message: string) => {
    if (!project || project.has_applied) return

    setApplying(true)
    try {
      const response = await fetch(`${process.env.NEXT_SECRET_API_URL}/usuario/applications/ApplyProject/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user.accessToken}`
        },
        body: JSON.stringify({ 
          project_id: project.id,
          message: message
        })
      })

      if (response.ok) {
        toast({
          title: "Aplicación enviada",
          description: "Tu solicitud ha sido enviada exitosamente.",
        })
        setProject({ ...project, has_applied: true })
        
       
        await validateAchievements()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to apply to the project')
      }
    } catch (error) {
      console.error('Error applying to project:', error)
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu aplicación. Por favor, intenta de nuevo más tarde.",
        variant: "destructive"
      })
    } finally {
      setApplying(false)
      setIsDialogOpen(false)
    }
  }

  if (loading) {
    return <ProjectSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">No se encontró el proyecto.</p>
      </div>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-6 min-h-full">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">{project.name}</h1>
          <p className="text-xl text-muted-foreground">{project.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<ProjectSkeleton />}>
              <ProjectDetails project={project} />
            </Suspense>

            <Suspense fallback={<ProjectSkeleton />}>
              <ProjectObjectives objectives={project.objectives} />
            </Suspense>

            <Suspense fallback={<ProjectSkeleton />}>
              <ProjectRequirements requirements={project.necessary_requirements} />
            </Suspense>
          </div>

          <div className="space-y-6">
            <Suspense fallback={<ProjectSkeleton />}>
              <ProjectProgress progress={project.progress} />
            </Suspense>

            <Suspense fallback={<ProjectSkeleton />}>
              <ProjectLeader
                photo={project.photo}
                creator={project.creator_name} 
                university={project.name_uniuser} 
                responsible={project.responsible} 
              />
            </Suspense>

            <Button 
              onClick={() => setIsDialogOpen(true)} 
              disabled={!project.accepting_applications || applying || project.has_applied}
              className="w-full py-6 text-lg"
            >
              {applying ? 'Enviando aplicación...' : 
               project.has_applied ? 'Ya has aplicado' :
               project.accepting_applications ? 'Aplicar al Proyecto' : 'No se aceptan aplicaciones'}
            </Button>
          </div>
        </div>
      </div>

      <ApplicationDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleApply}
        projectName={project.name}
      />
    </PageContainer>
  )
}