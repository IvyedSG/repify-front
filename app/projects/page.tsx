'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CalendarDateRangePicker } from '@/components/date-range-picker'
import PageContainer from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CalendarIcon, Users, Clock, Briefcase, GraduationCap, Plus, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { format } from 'date-fns'
import { Calendar as CalendarPrimitive } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface ColorScheme {
  primary: string;
  secondary: string;
  text: string;
}

const colorSchemes: ColorScheme[] = [
  { primary: 'bg-blue-600', secondary: 'bg-blue-100', text: 'text-blue-700' },
  { primary: 'bg-green-600', secondary: 'bg-green-100', text: 'text-green-700' },
  { primary: 'bg-purple-600', secondary: 'bg-purple-100', text: 'text-purple-700' },
  { primary: 'bg-pink-600', secondary: 'bg-pink-100', text: 'text-pink-700' },
  { primary: 'bg-yellow-600', secondary: 'bg-yellow-100', text: 'text-yellow-700' },
]

interface Project {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  project_type: string;
  priority: string;
  responsible: string;
  detailed_description: string;
  expected_benefits: string;
  necessary_requirements: string;
  progress: number;
  accepting_applications: boolean;
  id: string;
  colorScheme: ColorScheme;
}

const projectTypes = [
  "Web Development",
  "Mobile App",
  "Data Science",
  "Machine Learning",
  "UI/UX Design",
  "Blockchain",
  "IoT",
  "Cybersecurity",
  "Cloud Computing",
  "Artificial Intelligence"
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    end_date: '',
    status: 'En progreso',
    project_type: '',
    priority: '',
    responsible: '',
    detailed_description: '',
    expected_benefits: '',
    necessary_requirements: '',
    progress: 0,
    accepting_applications: true
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewProject(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setNewProject(prev => ({ ...prev, accepting_applications: checked }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setNewProject(prev => ({ ...prev, end_date: format(date, 'yyyy-MM-dd') }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the newProject data to your backend
    console.log('Submitting new project:', newProject)
    // Reset form and close dialog after submission
    setNewProject({
      name: '',
      description: '',
      end_date: '',
      status: 'En progreso',
      project_type: '',
      priority: '',
      responsible: '',
      detailed_description: '',
      expected_benefits: '',
      necessary_requirements: '',
      progress: 0,
      accepting_applications: true
    })
    setCurrentStep(1)
    setIsDialogOpen(false)
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  useEffect(() => {
    const fetchProjects = async () => {
      if (status === 'loading') return;

      if (!session) {
        console.error('No session found')
        router.push('/')
        return
      }

      const accessToken = session.user.accessToken

      if (accessToken) {
        try {
          const response = await fetch('https://repo-s7h0.onrender.com/usuario/projects/view_project_all/', {
            headers: {
              'Accept': '*/*',
              'Authorization': `Bearer ${accessToken}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            const projectsWithExtras = data.map((project: Project, index: number) => ({
              ...project,
              id: `${index + 1}`,
              colorScheme: colorSchemes[index % colorSchemes.length]
            }))
            setProjects(projectsWithExtras)
          } else {
            console.error('Failed to fetch projects')
          }
        } catch (error) {
          console.error('Error fetching projects:', error)
        } finally {
          setLoading(false)
        }
      } else {
        console.error('No access token found')
        setLoading(false)
        router.push('/')
      }
    }

    fetchProjects()
  }, [status, session, router])

  const handleViewDetails = (project: Project) => {
    router.push(`/projects/${project.id}`)
  }

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || project.project_type === filterType)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-4xl font-bold tracking-tight">Proyectos Destacados</h2>
          <div className="flex items-center space-x-4">
            <CalendarDateRangePicker />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Publicar Proyecto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Publicar Nuevo Proyecto</DialogTitle>
                  <DialogDescription>
                    Completa la información de tu nuevo proyecto. Avanza por los pasos para llenar todos los detalles.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Proyecto</Label>
                        <Input
                          id="name"
                          name="name"
                          value={newProject.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Descripción Breve</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={newProject.description}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project_type">Tipo de Proyecto</Label>
                        <Select name="project_type" value={newProject.project_type} onValueChange={(value) => setNewProject(prev => ({ ...prev, project_type: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Prioridad</Label>
                        <RadioGroup name="priority" value={newProject.priority} onValueChange={(value) => setNewProject(prev => ({ ...prev, priority: value }))}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Baja" id="priority-low" />
                            <Label htmlFor="priority-low">Baja</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Media" id="priority-medium" />
                            <Label htmlFor="priority-medium">Media</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Alta" id="priority-high" />
                            <Label htmlFor="priority-high">Alta</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="responsible">Responsable (ID)</Label>
                        <Input
                          id="responsible"
                          name="responsible"
                          type="number"
                          value={newProject.responsible}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end_date">Fecha de Finalización</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !newProject.end_date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newProject.end_date ? format(new Date(newProject.end_date), "PPP") : <span>Selecciona una fecha</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarPrimitive
                              mode="single"
                              selected={newProject.end_date ? new Date(newProject.end_date) : undefined}
                              onSelect={handleDateSelect}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="detailed_description">Descripción Detallada</Label>
                        <Textarea
                          id="detailed_description"
                          name="detailed_description"
                          value={newProject.detailed_description}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expected_benefits">Beneficios Esperados</Label>
                        <Textarea
                          id="expected_benefits"
                          name="expected_benefits"
                          value={newProject.expected_benefits}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="necessary_requirements">Requisitos Necesarios</Label>
                        <Textarea
                          id="necessary_requirements"
                          name="necessary_requirements"
                          value={newProject.necessary_requirements}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="accepting_applications"
                          checked={newProject.accepting_applications}
                          onCheckedChange={handleSwitchChange}
                        />
                        <Label htmlFor="accepting_applications">Aceptar Solicitudes</Label>
                      </div>
                    </div>
                  )}
                  <DialogFooter className="mt-6">
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
                      <Button type="submit">Publicar Proyecto</Button>
                    )}
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <Input 
            className="flex-grow" 
            placeholder="Buscar proyectos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por tipo de proyecto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {projectTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden flex flex-col">
              <CardHeader className={`relative h-40 ${project.colorScheme.primary}`}>
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <CardTitle className="relative z-10 text-2xl font-bold text-white">{project.name}</CardTitle>
                <CardDescription className="relative z-10 text-lg text-white">{project.project_type}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="rounded-full">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          {project.priority}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Prioridad del proyecto</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="rounded-full">
                          <Users className="mr-1 h-3 w-3" />
                          {project.responsible}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Líder del proyecto</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                </div>
                <Progress value={project.progress} className="mb-2" />
                <p className="text-sm text-right text-muted-foreground">{project.progress}% Completado</p>
              </CardContent>
              <CardFooter className="p-4 flex flex-col items-start space-y-2 border-t">
                <div className="flex items-center justify-between w-full">
                  <Badge variant="outline" className={`${project.colorScheme.secondary} ${project.colorScheme.text}`}>
                    <Clock className="mr-1 h-3 w-3" />
                    {project.status}
                  </Badge>
                  <Badge variant="outline" className={project.accepting_applications ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}>
                    {project.accepting_applications ? (
                      <>
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Se aceptan solicitudes
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-1 h-3 w-3" />
                        No se aceptan solicitudes
                      </>
                    )}
                  </Badge>
                </div>
                <Button onClick={() => handleViewDetails(project)} variant="outline" className="w-full mt-2">
                  Ver Detalles
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}