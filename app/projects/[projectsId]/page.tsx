'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import PageContainer from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Users, Clock, Briefcase, GraduationCap, User, FileText, Target, PieChart, Send, ArrowLeft, MapPin, Link2, Share2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ColorScheme {
  primary: string;
  secondary: string;
  text: string;
}

interface Project {
  id: string;
  title: string;
  organization: string;
  career: string;
  university: string;
  startDate: string;
  endDate: string;
  members: number;
  progress: number;
  isFlexible: boolean;
  publishedAgo: string;
  leader: string;
  description: string;
  missingProfiles: string[];
  applicationCount: number;
  colorScheme: ColorScheme;
  image?: string;  // Hacemos que `image` sea opcional.
  location: string;
  website: string;
}

export default function ProjectDetails() {
  const router = useRouter()

  const project: Project = {
    id: '1',
    title: 'Proyecto de Ejemplo',
    organization: 'Organización Ejemplo',
    career: 'Ingeniería de Software',
    university: 'Universidad Nacional',
    startDate: '01/01/2023',
    endDate: '31/12/2023',
    members: 5,
    progress: 75,
    isFlexible: true,
    publishedAgo: 'Hace 2 semanas',
    leader: 'Juan Pérez',
    description: 'Este es un proyecto de ejemplo para mostrar detalles en la plataforma.',
    missingProfiles: ['Desarrollador Frontend', 'Diseñador UX/UI'],
    applicationCount: 10,
    colorScheme: {
      primary: '#4f46e5',
      secondary: '#6d28d9',
      text: '#fff'
    },
    image: '/path/to/example-image.jpg',  // Ruta a una imagen de ejemplo
    location: 'Remoto',
    website: 'https://ejemplo.com'
  };

  if (!project) {
    return <p>Loading...</p>;  // O puedes renderizar un spinner o un mensaje de carga
  }


  return (
    <PageContainer scrollable={true}>
      <div className="max-w-4xl mx-auto py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a proyectos
        </Button>
        <div className="space-y-8">
        <div className="relative h-64 rounded-xl overflow-hidden">
          {project && project.image ? (
            <Image
              src={project.image || '/path/to/default-image.jpg'}  // Si `project.image` es undefined, se usa una imagen por defecto
              alt={project.title}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            // Renderizar un marcador de posición si no hay imagen
            <div className="bg-gray-200 flex items-center justify-center h-full">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-white mb-2">{project?.title}</h1>
              <p className="text-xl text-white">{project?.organization}</p>
            </div>
          </div>
        </div>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Carrera</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-2xl font-bold">
                  <Briefcase className="inline-block mr-2 h-5 w-5" />
                  {project.career}
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Universidad</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-2xl font-bold">
                  <GraduationCap className="inline-block mr-2 h-5 w-5" />
                  {project.university}
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tipo de proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-2xl font-bold">
                  <Clock className="inline-block mr-2 h-5 w-5" />
                  {project.isFlexible ? 'Flexible' : 'Cronograma'}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Descripción del proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{project.description}</p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Detalles del proyecto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span className="font-medium mr-2">Miembros:</span> {project.members}
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="font-medium mr-2">Fechas:</span> {project.startDate} - {project.endDate}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span className="font-medium mr-2">Ubicación:</span> {project.location}
                </div>
                <div className="flex items-center">
                  <Link2 className="mr-2 h-4 w-4" />
                  <span className="font-medium mr-2">Sitio web:</span>
                  <a href={project.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {project.website}
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Progreso y aplicaciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Progreso del proyecto</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="w-full" />
                </div>
                <div className="flex items-center">
                  <Send className="mr-2 h-4 w-4" />
                  <span className="font-medium mr-2">Aplicaciones recibidas:</span> {project.applicationCount}
                </div>
                <div>
                  <span className="font-medium mb-2 block">Perfiles faltantes:</span>
                  <div className="flex flex-wrap gap-2">
                    {project.missingProfiles.map((profile, index) => (
                      <Badge key={index} variant="secondary">
                        {profile}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Líder del proyecto</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder-avatar.jpg" alt={project.leader} />
                <AvatarFallback>{project.leader.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-semibold">{project.leader}</p>
                <p className="text-muted-foreground">Líder del Proyecto</p>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-between items-center">
            <Button size="lg">
              Aplicar al Proyecto
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}