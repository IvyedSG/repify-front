'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PageContainer from '@/components/layout/page-container'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProjectCard } from '@/components/ProjectCard'
import { SkeletonProjectCard } from '@/components/skeletons/SkeletonProjectCard'
import { Button } from '@/components/ui/button'
import { ChevronUp } from 'lucide-react'

interface ColorScheme {
  primary: string
  secondary: string
  text: string
}

const colorSchemes: ColorScheme[] = [
  { primary: 'bg-blue-600', secondary: 'bg-blue-100', text: 'text-blue-700' },
  { primary: 'bg-green-600', secondary: 'bg-green-100', text: 'text-green-700' },
  { primary: 'bg-purple-600', secondary: 'bg-purple-100', text: 'text-purple-700' },
  { primary: 'bg-pink-600', secondary: 'bg-pink-100', text: 'text-pink-700' },
  { primary: 'bg-yellow-600', secondary: 'bg-yellow-100', text: 'text-yellow-700' },
]

interface Project {
  id: number // Change this to number
  name: string
  description: string
  start_date: string
  end_date: string
  status: string
  project_type: string
  priority: string
  detailed_description: string
  progress: number
  accepting_applications: boolean
  creator_name: string
  collaboration_count: number
  colorScheme: ColorScheme
}

const projectTypes = [
  "Investigación Académica",
  "Desarrollo Social",
  "Desarrollo de Software",
  "Creativo",
  "Consultoría",
  "Educación",
  "Ambiental",
  "Diseño",
  "Tecnología",
  "Prototipo",
  "Análisis de Datos",
  "Estudio de Caso",
  "Informe",
  "Ensayo",
  "Planificación",
  "Gestión",
  "Innovación",
  "Emprendimiento",
  "Comunitario",
  "Evaluación",
  "Simulación y Modelado",
  "Clínico",
  "Biomédico"
]

export default function ViewProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  const fetchProjects = useCallback(async () => {
    if (status === 'loading' || !session) return

    const accessToken = session.user.accessToken

    if (accessToken) {
      try {
        setLoading(true)
        const response = await fetch('http://127.0.0.1:8000/usuario/projects/view_project_all/', {
          headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${accessToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const projectsWithExtras = data.map((project: Project, index: number) => ({
            ...project,
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
  }, [status, session, router])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleViewDetails = useCallback((project: Project) => {
    router.push(`/projects/${project.id}`)
  }, [router])

  const filteredProjects = useMemo(() => 
    projects.filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === 'all' || project.project_type === filterType)
    ), [projects, searchTerm, filterType]
  )

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-8">
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
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <SkeletonProjectCard key={`skeleton-${index}`} />
            ))
          ) : (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onViewDetails={handleViewDetails} />
            ))
          )}
        </div>

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center text-gray-500">
            No se encontraron proyectos que coincidan con los criterios de búsqueda.
          </div>
        )}

        {showBackToTop && (
          <Button
            className="fixed bottom-8 right-8 rounded-full p-3"
            onClick={handleBackToTop}
            aria-label="Volver arriba"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
        )}
      </div>
    </PageContainer>
  )
}