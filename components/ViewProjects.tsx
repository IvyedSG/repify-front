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
import { useInView } from 'react-intersection-observer'
import useSWR from 'swr'

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
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  project_type: string;
  priority: string;
  detailed_description: string;
  progress: number;
  accepting_applications: boolean;
  creator_name: string;
  collaboration_count: number;
  colorScheme: ColorScheme;
  responsible: number; //id del creador del proyecto
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

const fetcher = async (url: string, accessToken: string) => {
  const res = await fetch(url, {
    headers: {
      'Accept': '*/*',
      'Authorization': `Bearer ${accessToken}`
    }
  })
  if (!res.ok) throw new Error('Failed to fetch projects')
  return res.json()
}

export default function ViewProjects() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  })

  const { data: initialProjects, error: initialError } = useSWR(
    status === 'authenticated'
      ? ['http://127.0.0.1:8000/usuario/projects/view_recent_projects/', session.user.accessToken]
      : null,
    ([url, token]) => fetcher(url, token),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  // Fetch all projects in the background
  const { data: allProjects, error: allError } = useSWR(
    status === 'authenticated' && initialProjects
      ? ['http://127.0.0.1:8000/usuario/projects/view_project_all/', session.user.accessToken]
      : null,
    ([url, token]) => fetcher(url, token),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const loading = !initialProjects && !initialError && status === 'authenticated'

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

  const projects = useMemo(() => allProjects || initialProjects || [], [allProjects, initialProjects])

  const filteredProjects = useMemo(() => 
    projects
      .map((project: Project, index: number) => ({
        ...project,
        colorScheme: colorSchemes[index % colorSchemes.length]
      }))
      .filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterType === 'all' || project.project_type === filterType)
      ), 
    [projects, searchTerm, filterType]
  )

  const handleBackToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (initialError || allError) return <div>Failed to load projects</div>

  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
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

        <div ref={ref} className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
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
            className="fixed p-3 rounded-full bottom-8 right-8"
            onClick={handleBackToTop}
            aria-label="Volver arriba"
          >
            <ChevronUp className="w-6 w-6" />
          </Button>
        )}
      </div>
    </PageContainer>
  )
}