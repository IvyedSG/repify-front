"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
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
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { PublishProjectDialog } from '@/components/publish/publish-project-dialog'
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { DetailedProjectDialog } from './dialogproject'
import { 
  Users, 
  Settings, 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Calendar, 
  Flag, 
  BarChart, 
  Plus,
  Loader2
} from 'lucide-react'

type Project = {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  status: string
  project_type: string[]
  priority: string
  responsible: number
  detailed_description: string
  type_aplyuni: string
  objectives: string[]
  necessary_requirements: string[]
  progress: number
  accepting_applications: boolean
  name_uniuser: string
  collaboration_count: number
  collaborators: string[]
}

export default function ProjectsPage() {
  const { data: session } = useSession()
  const [myProjects, setMyProjects] = useState<Project[]>([])
  const [collaboratedProjects, setCollaboratedProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [errorMyProjects, setErrorMyProjects] = useState<string | null>(null)
  const [errorCollaboratedProjects, setErrorCollaboratedProjects] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDetailedDialogOpen, setIsDetailedDialogOpen] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      if (session?.user?.accessToken) {
        setLoading(true)
        
        // Fetch my projects
        try {
          const myProjectsResponse = await fetch('http://127.0.0.1:8000/usuario/projects/my-projects/', {
            headers: { 'Authorization': `Bearer ${session.user.accessToken}` }
          })
          if (myProjectsResponse.ok) {
            const myProjectsData = await myProjectsResponse.json()
            setMyProjects(myProjectsData)
          } else {
            setErrorMyProjects('Failed to fetch my projects')
            setMyProjects([])
          }
        } catch (error) {
          console.error('Error fetching my projects:', error)
          setErrorMyProjects('Error fetching my projects')
          setMyProjects([])
        }

        // Fetch collaborated projects
        try {
          const collaboratedProjectsResponse = await fetch('http://127.0.0.1:8000/usuario/projects/my-collaborated-projects/', {
            headers: { 'Authorization': `Bearer ${session.user.accessToken}` }
          })
          if (collaboratedProjectsResponse.ok) {
            const collaboratedProjectsData = await collaboratedProjectsResponse.json()
            setCollaboratedProjects(collaboratedProjectsData)
          } else if (collaboratedProjectsResponse.status === 404) {
            // If 404, assume no collaborated projects
            setCollaboratedProjects([])
          } else {
            setErrorCollaboratedProjects('Failed to fetch collaborated projects')
            setCollaboratedProjects([])
          }
        } catch (error) {
          console.error('Error fetching collaborated projects:', error)
          setErrorCollaboratedProjects('Error fetching collaborated projects')
          setCollaboratedProjects([])
        }

        setLoading(false)
      }
    }

    fetchProjects()
  }, [session])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const allProjects = [...myProjects, ...collaboratedProjects]

  const filteredProjects = allProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en espera': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'en progreso': return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'completado': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta': return 'text-red-500'
      case 'media': return 'text-yellow-500'
      case 'baja': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const renderProjectCard = (project: Project, isLeader: boolean) => (
    <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
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
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="ml-2 text-sm">{project.end_date}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="ml-2 text-sm">{project.collaboration_count} miembros</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2">Tipo de Proyecto</h4>
            <div className="flex flex-wrap gap-2">
              {project.project_type.map((type, index) => (
                <Badge key={index} variant="outline">{type}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2">Progreso del Proyecto</h4>
            <div className="flex items-center">
              <Progress value={project.progress} className="flex-grow h-2" />
              <span className="ml-2 text-sm font-medium">{project.progress}%</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4">
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
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Gestión del Proyecto</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Gestionar Miembros</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Añadir Nueva Tarea</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>Ver Estadísticas</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/projects/teams/${project.id}`}>
                      <Settings className="mr-2 h-4 w-4" />
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
  )

  const renderEmptyState = (message: string) => (
    <div className="flex flex-col items-center justify-center h-64">
      <Clock className="h-16 w-16 text-gray-400 mb-4" />
      <p className="text-xl font-semibold text-gray-600">{message}</p>
    </div>
  )

  const renderErrorState = (message: string) => (
    <div className="flex flex-col items-center justify-center h-64">
      <XCircle className="h-16 w-16 text-red-500 mb-4" />
      <p className="text-xl font-semibold text-red-600">{message}</p>
    </div>
  )

  const renderContent = (tab: 'all' | 'leader' | 'member') => {
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projectsToShow.map((project) => renderProjectCard(
          project, 
          myProjects.some(p => p.id === project.id)
        ))}
      </div>
    )
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-bold tracking-tight">Mis Proyectos</h1>
          <div className="flex items-center space-x-4">
            <Input 
              className="w-[300px]" 
              placeholder="Buscar proyectos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  Publicar Proyecto
                </Button>
              </DialogTrigger>
              <PublishProjectDialog setIsDialogOpen={setIsDialogOpen} />
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Todos los Proyectos</TabsTrigger>
            <TabsTrigger value="leader">Proyectos que Lidero</TabsTrigger>
            <TabsTrigger value="member">Proyectos en los que Participo</TabsTrigger>
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