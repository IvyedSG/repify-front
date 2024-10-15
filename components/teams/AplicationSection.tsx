import React from 'react'
import { useSession } from 'next-auth/react'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserPlus, Briefcase } from 'lucide-react'
import { Project } from '../../types/types'
import { convertToUniversitySiglas, convertToFullUniversityName } from '@/lib/universityConverter'

interface ApplicationsSectionProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  isEditing: boolean;
}

export default function ApplicationsSection({ project, setProject, isEditing }: ApplicationsSectionProps) {
  const { data: session } = useSession()
  const userUniversity = session?.user?.university || ''
  const userUniversitySiglas = convertToUniversitySiglas(userUniversity)

  const handleSwitchChange = (checked: boolean) => {
    setProject(prev => prev ? { ...prev, accepting_applications: checked } : null)
  }

  const handleSelectChange = (value: string) => {
    setProject(prev => prev ? { ...prev, type_aplyuni: value } : null)
  }

  const getDisplayValue = (value: string) => {
    if (value === 'LIBRE') return 'Libre'
    const fullName = convertToFullUniversityName(value)
    return `Solo ${fullName}`
  }

  const isUserUniversitySelected = project.type_aplyuni === userUniversitySiglas

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="accepting_applications"
          checked={project.accepting_applications}
          onCheckedChange={handleSwitchChange}
          disabled={!isEditing}
        />
        <label htmlFor="accepting_applications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          <UserPlus className="inline-block w-4 h-4 mr-2" />
          Aceptando solicitudes
        </label>
      </div>
      <div>
        <label htmlFor="type_aplyuni" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <Briefcase className="inline-block w-4 h-4 mr-2" />
          Tipo de Aplicación
        </label>
        <Select 
          name="type_aplyuni" 
          value={project.type_aplyuni} 
          onValueChange={handleSelectChange} 
          disabled={!isEditing}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo de aplicación">
              {getDisplayValue(project.type_aplyuni)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LIBRE">Libre</SelectItem>
            <SelectItem value={userUniversitySiglas}>
              Solo {userUniversity}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}