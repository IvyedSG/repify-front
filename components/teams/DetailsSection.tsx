import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Tag } from 'lucide-react'
import { Project, projectTypes } from '../../types/types'

interface DetailsSectionProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  isEditing: boolean;
}

export default function DetailsSection({ project, setProject, isEditing }: DetailsSectionProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProject(prev => prev ? { ...prev, [name]: value } : null)
  }

  const toggleProjectType = (type: string) => {
    if (isEditing) {
      setProject(prev => {
        if (!prev) return null;
        const newTypes = prev.project_type.includes(type)
          ? prev.project_type.filter(t => t !== type)
          : [...prev.project_type, type];
        return { ...prev, project_type: newTypes };
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="detailed_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <FileText className="inline-block w-4 h-4 mr-2" />
          Descripción Detallada
        </label>
        <Textarea id="detailed_description" name="detailed_description" value={project.detailed_description} onChange={handleInputChange} className="mt-1" disabled={!isEditing} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <Tag className="inline-block w-4 h-4 mr-2" />
          Tipo de Proyecto
        </label>
        <ScrollArea className="h-40 w-full border rounded-md p-4">
          <div className="flex flex-wrap gap-2">
            {projectTypes.map((type) => (
              <Badge
                key={type}
                variant={project.project_type.includes(type) ? "default" : "outline"}
                className={`cursor-pointer ${isEditing ? 'hover:bg-primary hover:text-primary-foreground' : ''}`}
                onClick={() => toggleProjectType(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}