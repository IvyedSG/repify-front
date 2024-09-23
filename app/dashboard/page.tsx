'use client'

import React, { useState } from 'react'
import { CalendarDateRangePicker } from '@/components/date-range-picker'
import PageContainer from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { CalendarIcon, Users, Clock, Briefcase, GraduationCap, User, FileText, Target, PieChart, Send, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const careers = [
  "Administración y Negocios Internacionales",
  "Administración y Marketing",
  "Administración de Empresas",
  "Arquitectura",
  "Ciencias de la Comunicación",
  "Contabilidad",
  "Derecho",
  "Enfermería",
  "Farmacia y Bioquímica"
]

const universities = [
  "Universidad Nacional del Callao (UNAC)",
  "Universidad Nacional Mayor de San Marcos (UNMSM)",
  "Universidad Tecnológica del Perú (UTP)",
  "Universidad del Pacifico (UP)",
  "Universidad San Ignacio de Loyola (USIL)",
  "Universidad Peruana Cayetano Heredia (UPCH)",
  "Pontificia Universidad Católica del Perú (PUCP)",
  "Universidad de San Martín de Porres (USMP)"
]

interface ColorScheme {
  primary: string;
  secondary: string;
  text: string;
}

const colorSchemes: ColorScheme[] = [
  { primary: 'bg-blue-500', secondary: 'bg-blue-100', text: 'text-blue-700' },
  { primary: 'bg-green-500', secondary: 'bg-green-100', text: 'text-green-700' },
  { primary: 'bg-purple-500', secondary: 'bg-purple-100', text: 'text-purple-700' },
  { primary: 'bg-pink-500', secondary: 'bg-pink-100', text: 'text-pink-700' },
  { primary: 'bg-yellow-500', secondary: 'bg-yellow-100', text: 'text-yellow-700' },
]

interface Project {
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
  image: string;
}

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isFlexible, setIsFlexible] = useState(false)

  const projects: Project[] = [
    {
      title: "AI-Powered Study Assistant",
      organization: "TechEd Solutions",
      career: "Ciencias de la Comunicación",
      university: "Universidad Nacional Mayor de San Marcos (UNMSM)",
      startDate: "10 de Septiembre",
      endDate: "20 de Septiembre",
      members: 4,
      progress: 75,
      isFlexible: false,
      publishedAgo: "hace 3 días",
      leader: "María García",
      description: "Desarrollo de un asistente de estudio impulsado por IA para ayudar a los estudiantes a optimizar sus sesiones de estudio.",
      missingProfiles: ["Diseñador UX/UI", "Desarrollador de IA"],
      applicationCount: 12,
      colorScheme: colorSchemes[0],
      image: "/placeholder.svg?height=100&width=200"
    },
    {
      title: "Campus Event Planner App",
      organization: "UniConnect",
      career: "Administración y Marketing",
      university: "Universidad Tecnológica del Perú (UTP)",
      startDate: "15 de Septiembre",
      endDate: "15 de Octubre",
      members: 3,
      progress: 40,
      isFlexible: true,
      publishedAgo: "hace 15 días",
      leader: "Carlos Rodríguez",
      description: "Creación de una aplicación móvil para planificar y gestionar eventos en el campus universitario.",
      missingProfiles: ["Desarrollador móvil", "Diseñador gráfico"],
      applicationCount: 8,
      colorScheme: colorSchemes[1],
      image: "/placeholder.svg?height=100&width=200"
    },
    {
      title: "Blockchain-based Voting System",
      organization: "CivicTech Innovations",
      career: "Derecho",
      university: "Pontificia Universidad Católica del Perú (PUCP)",
      startDate: "1 de Octubre",
      endDate: "30 de Noviembre",
      members: 5,
      progress: 60,
      isFlexible: false,
      publishedAgo: "hace 2 meses",
      leader: "Ana Martínez",
      description: "Implementación de un sistema de votación basado en blockchain para garantizar la transparencia y seguridad en procesos electorales.",
      missingProfiles: ["Desarrollador blockchain", "Experto en seguridad informática", "Estudiantes de derecho"],
      applicationCount: 20,
      colorScheme: colorSchemes[2],
      image: "/placeholder.svg?height=100&width=200"
    }
  ]

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-4xl font-bold tracking-tight">Proyectos Destacados</h2>
          <div className="flex items-center space-x-4">
            <CalendarDateRangePicker />
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Publicar Proyecto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Publicar Nuevo Proyecto</DialogTitle>
                  <DialogDescription>
                    Complete los detalles de su nuevo proyecto a continuación.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="project-title" className="text-right">
                      Título
                    </Label>
                    <Input id="project-title" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="project-org" className="text-right">
                      Organización
                    </Label>
                    <Input id="project-org" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="project-career" className="text-right">
                      Carrera
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seleccionar carrera" />
                      </SelectTrigger>
                      <SelectContent>
                        {careers.map((career, index) => (
                          <SelectItem key={index} value={career.toLowerCase().replace(/\s+/g, '-')}>
                            {career}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="project-university" className="text-right">
                      Universidad
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seleccionar universidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {universities.map((university, index) => (
                          <SelectItem key={index} value={university.toLowerCase().replace(/\s+/g, '-')}>
                            {university}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="project-description" className="text-right">
                      Descripción
                    </Label>
                    <Textarea id="project-description" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="project-members" className="text-right">
                      Miembros
                    </Label>
                    <Input id="project-members" type="number" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="project-profiles" className="text-right">
                      Perfiles faltantes
                    </Label>
                    <Input id="project-profiles" className="col-span-3" placeholder="Separados por comas" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Tipo de proyecto</Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Switch
                        id="project-flexible"
                        checked={isFlexible}
                        onCheckedChange={setIsFlexible}
                      />
                      <Label htmlFor="project-flexible">
                        {isFlexible ? 'Flexible' : 'Cronograma'}
                      </Label>
                    </div>
                  </div>
                  {!isFlexible && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="project-start-date" className="text-right">
                          Fecha de inicio
                        </Label>
                        <Input id="project-start-date" type="date" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="project-end-date" className="text-right">
                          Fecha de fin
                        </Label>
                        <Input id="project-end-date" type="date" className="col-span-3" />
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit">Publicar Proyecto</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <Input className="flex-grow" placeholder="Buscar proyectos..." />
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por carrera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Carreras</SelectItem>
              {careers.map((career, index) => (
                <SelectItem key={index} value={career.toLowerCase().replace(/\s+/g, '-')}>
                  {career}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader className="relative h-48 bg-gray-100">
                <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply" />
                <div className="absolute top-2 left-2 flex items-center space-x-2">
                  <Badge variant={project.isFlexible ? "secondary" : "default"} className={`text-xs font-semibold ${project.colorScheme.secondary} ${project.colorScheme.text}`}>
                    {project.isFlexible ? "Flexible" : "Cronograma"}
                  </Badge>
                </div>
                <div className="absolute bottom-2 right-2">
                  <Badge variant="outline" className="bg-white/80 text-gray-800 text-xs">
                    <Clock className="mr-1 h-3 w-3" />
                    {project.publishedAgo}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-2xl font-bold mb-2">{project.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-4">{project.organization}</CardDescription>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className={`rounded-full ${project.colorScheme.secondary} ${project.colorScheme.text}`}>
                    <Briefcase className="mr-1 h-3 w-3" />
                    {project.career}
                  </Badge>
                  <Badge variant="secondary" className={`rounded-full ${project.colorScheme.secondary} ${project.colorScheme.text}`}>
                    <GraduationCap className="mr-1 h-3 w-3" />
                    {project.university}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {project.startDate} - {project.endDate}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Users className="mr-2 h-4 w-4" />
                  {project.members} miembros
                </div>
                <Progress value={project.progress} className="mb-2" />
                <p className="text-sm text-right text-muted-foreground">{project.progress}% Completado</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-4" variant="outline" onClick={() => setSelectedProject(project)}>
                      Ver Detalles
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">{selectedProject?.title}</DialogTitle>
                      <DialogDescription className="text-lg text-muted-foreground">
                        {selectedProject?.organization}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder-avatar.jpg" alt={selectedProject?.leader} />
                          <AvatarFallback>{selectedProject?.leader.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{selectedProject?.leader}</p>
                          <p className="text-sm text-muted-foreground">Líder del Proyecto</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold flex items-center"><Briefcase className="mr-2 h-4 w-4" /> Carrera</p>
                          <p className="text-muted-foreground">{selectedProject?.career}</p>
                        </div>
                        <div>
                          <p className="font-semibold flex items-center"><GraduationCap className="mr-2 h-4 w-4" /> Universidad</p>
                          <p className="text-muted-foreground">{selectedProject?.university}</p>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <p className="font-semibold flex items-center mb-2"><FileText className="mr-2 h-4 w-4" /> Descripción</p>
                        <p className="text-muted-foreground">{selectedProject?.description}</p>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold flex items-center"><Users className="mr-2 h-4 w-4" /> Miembros</p>
                          <p className="text-muted-foreground">{selectedProject?.members}</p>
                        </div>
                        <div>
                          <p className="font-semibold flex items-center"><Target className="mr-2 h-4 w-4" /> Perfiles faltantes</p>
                          <p className="text-muted-foreground">{selectedProject?.missingProfiles.join(", ")}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold flex items-center"><PieChart className="mr-2 h-4 w-4" /> Progreso</p>
                          <Progress value={selectedProject?.progress} className="mt-2" />
                          <p className="text-sm text-right text-muted-foreground mt-1">{selectedProject?.progress}% Completado</p>
                        </div>
                        <div>
                          <p className="font-semibold flex items-center"><Send className="mr-2 h-4 w-4" /> Aplicaciones</p>
                          <p className="text-muted-foreground">{selectedProject?.applicationCount}</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold flex items-center"><Clock className="mr-2 h-4 w-4" /> Tipo de proyecto</p>
                        <p className="text-muted-foreground">{selectedProject?.isFlexible ? 'Flexible' : 'Cronograma'}</p>
                      </div>
                    </div>
                    <Button className="w-full">
                      Aplicar al Proyecto
                    </Button>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}
