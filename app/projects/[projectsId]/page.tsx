'use client'

import React, { useState, useEffect, lazy, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Users, Target, FileText, Share2, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from '@/components/ui/use-toast'
import { useTheme } from "next-themes"

// Lazy load components
const ProjectDetails = lazy(() => import('./ProjectDetails'))
const ProjectObjectives = lazy(() => import('./ProjectObjectives'))
const ProjectRequirements = lazy(() => import('./ProjectRequirements'))

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
}

export default function ProjectDetailsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { theme } = useTheme()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const projectId = window.location.pathname.split('/').pop()
      if (!projectId) return

      try {
        const response = await fetch('http://127.0.0.1:8000/usuario/projects/view_project_id/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.user.accessToken}`
          },
          body: JSON.stringify({ id: parseInt(projectId) })
        })

        if (response.ok) {
          const data = await response.json()
          setProject(data)
        } else {
          throw new Error('Failed to fetch project details')
        }
      } catch (error) {
        console.error('Error fetching project details:', error)
        setError('Failed to load project details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchProjectDetails()
    }
  }, [session])

  const handleApply = async () => {
    toast({
      title: "Aplicación enviada",
      description: "Tu solicitud ha sido enviada exitosamente.",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-32 w-32 animate-spin text-primary" />
      </div>
    )
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
    <div className="min-h-screen bg-background text-foreground">
      <ScrollArea className="h-screen">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">{project.name}</h1>
            <p className="text-xl text-muted-foreground">{project.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <ProjectDetails project={project} />
              </Suspense>

              <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <ProjectObjectives objectives={project.objectives} />
              </Suspense>

              <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <ProjectRequirements requirements={project.necessary_requirements} />
              </Suspense>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Progreso del Proyecto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={project.progress} className="w-full h-2" />
                    <p className="text-right font-medium">{project.progress}% Completado</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Líder del Proyecto</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {project.creator_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{project.creator_name}</p>
                    <p className="text-sm text-muted-foreground">{project.name_uniuser}</p>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleApply} 
                disabled={!project.accepting_applications}
                className="w-full py-6 text-lg"
              >
                {project.accepting_applications ? 'Aplicar al Proyecto' : 'No se aceptan aplicaciones'}
              </Button>

              <div className="flex justify-end">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Compartir proyecto</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}