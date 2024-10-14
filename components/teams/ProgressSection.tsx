import React from 'react'
import { Slider } from '@/components/ui/slider'
import { BarChart, Layers, CheckCircle, Clock } from 'lucide-react'
import { Project } from '../../types/types'

interface ProgressSectionProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  isEditing: boolean;
}

export default function ProgressSection({ project, setProject, isEditing }: ProgressSectionProps) {
  const handleProgressChange = (value: number[]) => {
    setProject(prev => prev ? { ...prev, progress: value[0] } : null)
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="progress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <BarChart className="inline-block w-4 h-4 mr-2" />
          Progreso General
        </label>
        <div className="flex items-center mt-2">
          <Slider
            value={[project.progress]}
            onValueChange={handleProgressChange}
            max={100}
            step={1}
            className="flex-grow"
            disabled={!isEditing}
          />
          <span className="ml-4 text-lg font-semibold text-gray-800 dark:text-gray-200">{project.progress}%</span>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          <Layers className="inline-block w-5 h-5 mr-2" />
          Hitos del Proyecto
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">Inicio del proyecto</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">Definición de objetivos</span>
          </div>
          <div className="flex items-center">
            <Clock className="text-yellow-500 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">Desarrollo en curso</span>
          </div>
          <div className="flex items-center">
            <Clock className="text-gray-400 mr-2" />
            <span className="text-gray-500 dark:text-gray-400">Pruebas y validación</span>
          </div>
          <div className="flex items-center">
            <Clock className="text-gray-400 mr-2" />
            <span className="text-gray-500 dark:text-gray-400">Entrega final</span>
          </div>
        </div>
      </div>
    </div>
  )
}