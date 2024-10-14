import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bookmark, FileText, Calendar, Flag, Zap } from 'lucide-react'
import { Project } from '../../types/types'

interface GeneralSectionProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  isEditing: boolean;
}

export default function GeneralSection({ project, setProject, isEditing }: GeneralSectionProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProject(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSelectChange = (name: string, value: string) => {
    setProject(prev => prev ? { ...prev, [name]: value } : null)
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <Bookmark className="inline-block w-4 h-4 mr-2" />
          Nombre del Proyecto
        </label>
        <Input id="name" name="name" value={project.name} onChange={handleInputChange} className="mt-1" disabled={!isEditing} />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <FileText className="inline-block w-4 h-4 mr-2" />
          Descripción
        </label>
        <Textarea id="description" name="description" value={project.description} onChange={handleInputChange} className="mt-1" disabled={!isEditing} />
      </div>
      <div className="grid  grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar className="inline-block w-4 h-4 mr-2" />
            Fecha de Inicio
          </label>
          <Input id="start_date" name="start_date" type="date" value={project.start_date} onChange={handleInputChange} className="mt-1" disabled={!isEditing} />
        </div>
        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar className="inline-block w-4 h-4 mr-2" />
            Fecha de Fin
          </label>
          <Input id="end_date" name="end_date" type="date" value={project.end_date} onChange={handleInputChange} className="mt-1" disabled={!isEditing} />
        </div>
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <Flag className="inline-block w-4 h-4 mr-2" />
          Estado
        </label>
        <Select name="status" value={project.status} onValueChange={(value) => handleSelectChange('status', value)} disabled={!isEditing}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="En espera">En espera</SelectItem>
            <SelectItem value="En progreso">En progreso</SelectItem>
            <SelectItem value="Completado">Completado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <Zap className="inline-block w-4 h-4 mr-2" />
          Prioridad
        </label>
        <Select name="priority" value={project.priority} onValueChange={(value) => handleSelectChange('priority', value)} disabled={!isEditing}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona la prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Baja">Baja</SelectItem>
            <SelectItem value="Media">Media</SelectItem>
            <SelectItem value="Alta">Alta</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}