import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Target, List, Trash2, Plus } from 'lucide-react'
import { Project } from '../../types/types'

interface RequirementsSectionProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  isEditing: boolean;
}

export default function RequirementsSection({ project, setProject, isEditing }: RequirementsSectionProps) {
  const handleArrayChange = (name: 'objectives' | 'necessary_requirements', index: number, value: string) => {
    setProject(prev => {
      if (!prev) return null
      const newArray = [...prev[name]]
      newArray[index] = value
      return { ...prev, [name]: newArray }
    })
  }

  const handleAddArrayItem = (name: 'objectives' | 'necessary_requirements') => {
    setProject(prev => {
      if (!prev) return null
      return { ...prev, [name]: [...prev[name], ''] }
    })
  }

  const handleRemoveArrayItem = (name: 'objectives' | 'necessary_requirements', index: number) => {
    setProject(prev => {
      if (!prev) return null
      const newArray = [...prev[name]]
      newArray.splice(index, 1)
      return { ...prev, [name]: newArray }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <Target className="inline-block w-4 h-4 mr-2" />
          Objetivos
        </label>
        {project.objectives.map((objective, index) => (
          <div key={index} className="flex items-center mt-2">
            <Input 
              value={objective} 
              onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
              className="flex-grow"
              disabled={!isEditing}
            />
            {isEditing && (
              <Button variant="ghost" size="icon" onClick={() => handleRemoveArrayItem('objectives', index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {isEditing && (
          <Button variant="outline" onClick={() => handleAddArrayItem('objectives')} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Objetivo
          </Button>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <List className="inline-block w-4 h-4 mr-2" />
          Requisitos del Proyecto
        </label>
        {project.necessary_requirements.map((requirement, index) => (
          <div key={index} className="flex items-center mt-2">
            <Input 
              value={requirement} 
              onChange={(e) => handleArrayChange('necessary_requirements', index, e.target.value)}
              className="flex-grow"
              disabled={!isEditing}
            />
            {isEditing && (
              <Button variant="ghost" size="icon" onClick={() => handleRemoveArrayItem('necessary_requirements', index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {isEditing && (
          <Button variant="outline" onClick={() => handleAddArrayItem('necessary_requirements')} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Requisito
          </Button>
        )}
      </div>
    </div>
  )
}