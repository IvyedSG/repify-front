'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Users, Clock, Briefcase, Target, FileText, Share2, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSession } from 'next-auth/react'
import { toast } from '@/components/ui/use-toast'

interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  project_type: string;
  priority: string;
  responsible: number | null;
  detailed_description: string;
  expected_benefits: string;
  necessary_requirements: string;
  progress: number;
  accepting_applications: boolean | null;
  creator_name: string | null;
  collaboration_count: number;
  collaborators: any[];
}

export default function ProjectDetails() {
  const router = useRouter()
  const { data: session } = useSession()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

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
          console.error('Failed to fetch project details')
        }
      } catch (error) {
        console.error('Error fetching project details:', error)
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
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!project) {
    return <div className="text-center text-2xl font-bold mt-8">Project not found</div>
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="relative h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden">
          <Image
            src="/placeholder.svg"
            alt={project.name}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="p-4 w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{project.name}</h1>
              <p className="text-lg sm:text-xl text-white">{project.creator_name || 'No creator specified'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold">Detalles del Proyecto</CardTitle>
                <Badge variant="secondary" className="text-sm">
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{project.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span className="text-sm">{project.project_type}</span>
                </div>
                <div className="flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  <span className="text-sm">{project.priority} Prioridad</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="text-sm">
                    {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span className="text-sm">{project.collaboration_count} Miembros</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progreso del Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={project.progress} className="w-full" />
                <p className="text-sm text-right">{project.progress}% Completado</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Descripción Detallada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{project.detailed_description}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requisitos Necesarios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{project.necessary_requirements}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Beneficios Esperados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{project.expected_benefits}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Líder del Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-avatar.jpg" alt={project.creator_name || ''} />
              <AvatarFallback>{project.creator_name?.split(' ').map(n => n[0]).join('') || 'N/A'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{project.creator_name || 'No especificado'}</p>
              <p className="text-sm text-muted-foreground">Líder del Proyecto</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={handleApply} 
              disabled={!project.accepting_applications}
              className="w-full text-lg py-6"
            >
              {project.accepting_applications ? 'Aplicar al Proyecto' : 'No se aceptan aplicaciones'}
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end items-center mt-6">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </ScrollArea>
  )
}