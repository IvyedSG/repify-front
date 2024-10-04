'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PageContainer from '@/components/layout/page-container'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProjectCard } from '@/components/ProjectCard'

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

export default function ViewProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    const fetchProjects = async () => {
      if (status === 'loading') return

      if (!session) {
        console.error('No session found')
        router.push('/')
        return
      }

      const accessToken = session.user.accessToken

      if (accessToken) {
        try {
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
            <ProjectCard key={project.id} project={project} onViewDetails={handleViewDetails} />
          ))}
        </div>
      </div>
    </PageContainer>
  )
}