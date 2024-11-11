"use client"

import { useState, useCallback, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import useSWR from 'swr'
import PageContainer from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { PublishProjectDialog } from '@/components/publish/publish-project-dialog'
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import DetailedProjectDialog from '@/components/myprojects/dialogproject'
import { 
  Users, 
  Settings, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Calendar, 
  Flag, 
  Plus
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

type Collaborator = {
  id: number;
  name: string;
}

type Project = {
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
  responsible_photo?: string;
}

const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (res.ok) {
    return res.json()
  }
  if (res.status === 404) {
    return [] // Return an empty array for 404 responses
  }
  throw new Error('An error occurred while fetching the data.')
}

export default function ProjectsPage() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDetailedDialogOpen, setIsDetailedDialogOpen] = useState(false)

  const { data: myProjects, error: myProjectsError } = useSWR<Project[]>(
    session?.user?.accessToken 
      ? [`${process.env.NEXT_PUBLIC_API_URL}/usuario/projects/get_user_created_projects/`, session.user.accessToken]
      : null,
    ([url, token]) => fetcher(url, token as string) 
  );
  
  const { data: collaboratedProjects, error: collaboratedProjectsError } = useSWR<Project[]>(
    session?.user?.accessToken 
      ? [`${process.env.NEXT_PUBLIC_API_URL}/usuario/collaborators/view_project_usercollab/`, session.user.accessToken]
      : null,
    ([url, token]) => fetcher(url, token as string) 
  );
  

  const allProjects = useMemo(() => {
    return [...(myProjects || []), ...(collaboratedProjects || [])]
  }, [myProjects, collaboratedProjects])

  const filteredProjects = useMemo(() => {
    return allProjects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [allProjects, searchTerm])

  const getStatusIcon = useCallback((status: string | null) => {
    if (!status) return <Clock className="w-4 h-4 text-gray-500" />
  
    switch (status.toLowerCase()) {
      case 'planificación':
      case 'en espera':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'en progreso':
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      case 'completado':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'cancelado':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }, [])

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta': return 'text-red-500'
      case 'media': return 'text-yellow-500'
      case 'baja': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }, [])

  const renderProjectCard = useCallback((project: Project, isLeader: boolean) => (
    <Card key={project.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{project.name}</CardTitle>
          <Badge variant={isLeader ? 'default' : 'secondary'}>
            {isLeader ? 'Líder' : 'Miembro'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{project.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              {getStatusIcon(project.status)}
              <span className="ml-2 text-sm">{project.status}</span>
            </div>
            <div className="flex items-center">
              <Flag className={`h-4 w-4 ${getPriorityColor(project.priority)}`} />
              <span className="ml-2 text-sm">{project.priority}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="ml-2 text-sm">{project.end_date}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="ml-2 text-sm">{project.collaboration_count} Miembros</span>
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold">Tipo de Proyecto</h4>
            <div className="flex flex-wrap gap-2">
              {project.project_type.map((type, index) => (
                <Badge key={index} variant="outline">{type}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold">Progreso del Proyecto</h4>
            <div className="flex items-center">
              <Progress value={project.progress} className="flex-grow h-2" />
              <span className="ml-2 text-sm font-medium">{project.progress}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" onClick={() => {
              setSelectedProject(project)
              setIsDetailedDialogOpen(true)
            }}>
              Ver Detalles
            </Button>
            {isLeader && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Gestión del Proyecto</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href={`/projects/teams/${project.id}`}>
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Configuración del Proyecto</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  ), [getStatusIcon, getPriorityColor])

  const renderEmptyState = useCallback((message: string) => (
    <div className="flex flex-col items-center justify-center h-64">
      <Clock className="w-16 h-16 mb-4 text-gray-400" />
      <p className="text-xl font-semibold text-gray-600">{message}</p>
    </div>
  ), [])

  const renderErrorState = useCallback((message: string) => (
    <div className="flex flex-col items-center justify-center h-64">
      <XCircle className="w-16 h-16 mb-4 text-red-500" />
      <p className="text-xl font-semibold text-red-600">{message}</p>
    </div>
  ), [])

  const renderSkeletonCard = useCallback(() => (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Skeleton className="w-3/4 h-6" />
          <Skeleton className="w-16 h-5" />
        </div>
        <Skeleton className="w-full h-4 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-full h-4" />
            ))}
          </div>
          <Skeleton className="w-full h-4" />
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-16 h-6" />
            ))}
          </div>
          <Skeleton className="w-full h-2" />
          <div className="flex items-center justify-between pt-4">
            <Skeleton className="w-24 h-9" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  ), [])

  const renderContent = useCallback((tab: 'all' | 'leader' | 'member') => {
    if (myProjectsError) {
      return renderErrorState("Error al cargar los proyectos que lideras. Por favor, intente de nuevo más tarde.")
    }

    if (collaboratedProjectsError && collaboratedProjectsError.message !== 'An error occurred while fetching the data.') {
      return renderErrorState("Error al cargar los proyectos en los que participas. Por favor, intente de nuevo más tarde.")
    }

    if (!myProjects || !collaboratedProjects) {
      return (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i}>{renderSkeletonCard()}</div>
          ))}
        </div>
      )
    }

    const projectsToShow = 
      tab === 'all' ? filteredProjects :
      tab === 'leader' ? myProjects.filter(p => filteredProjects.includes(p)) :
      collaboratedProjects.filter(p => filteredProjects.includes(p))

    if (projectsToShow.length === 0) {
      return renderEmptyState(
        tab === 'all' 
          ? "No se encontraron proyectos. ¡Comienza o únete a un proyecto para empezar!" 
          : tab === 'leader'
          ? "Aún no lideras ningún proyecto. ¡Crea un nuevo proyecto para comenzar!"
          : "Aún no eres miembro de ningún proyecto. ¡Únete a un proyecto para comenzar!"
      )
    }

    return (
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
        {projectsToShow.map((project) => renderProjectCard(
          project, 
          myProjects.some(p => p.id === project.id)
        ))}
      </div>
    )
  }, [myProjects, collaboratedProjects, myProjectsError, collaboratedProjectsError, filteredProjects, renderProjectCard, renderEmptyState, renderErrorState, renderSkeletonCard])

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Mis Proyectos</h1>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <Input 
              className="flex-grow"
              placeholder="Buscar proyectos..." 
              value={searchTerm}
              onChange={(e) =>   setSearchTerm(e.target.value)}
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
              <Button className="w-full px-6 py-6 sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Publicar Proyecto
                </Button>
              </DialogTrigger>
              <PublishProjectDialog setIsDialogOpen={setIsDialogOpen} />
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="flex w-full overflow-x-auto flex-nowrap">
            <TabsTrigger value="all" className="flex-1 text-xs sm:text-sm whitespace-nowrap">Todos los Proyectos</TabsTrigger>
            <TabsTrigger value="leader" className="flex-1 text-xs sm:text-sm whitespace-nowrap">Proyectos que Lidero</TabsTrigger>
            <TabsTrigger value="member" className="flex-1 text-xs sm:text-sm whitespace-nowrap">Proyectos en los que Participo</TabsTrigger>
          </TabsList>

          {(['all', 'leader', 'member'] as const).map((tab) => (
            <TabsContent key={tab} value={tab}>
              {renderContent(tab)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <DetailedProjectDialog 
        project={selectedProject} 
        isOpen={isDetailedDialogOpen} 
        onOpenChange={setIsDetailedDialogOpen}
      />
    </PageContainer>
  )
}