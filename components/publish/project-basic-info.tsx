import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MultiSelect } from './multi-select'

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

interface ProjectBasicInfoProps {
  newProject: {
    name: string;
    description: string;
    project_type: string[];
  };
  handleInputChange: (name: string, value: any) => void;
}

export function ProjectBasicInfo({ newProject, handleInputChange }: ProjectBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name">Nombre del Proyecto</Label>
        <Input
          id="name"
          name="name"
          value={newProject.name}
          onChange={(e) => handleInputChange('name', e.target.value.slice(0, 40))}
          required
          maxLength={40}
          className="mt-2"
          placeholder="Ingrese un nombre conciso y descriptivo"
        />
        <p className="text-sm text-gray-500 mt-1">{newProject.name.length}/40 caracteres</p>
      </div>
      <div>
        <Label htmlFor="description">Descripción Breve</Label>
        <Textarea
          id="description"
          name="description"
          value={newProject.description}
          onChange={(e) => handleInputChange('description', e.target.value.slice(0, 200))}
          required
          maxLength={200}
          className="mt-2"
          placeholder="Resuma brevemente el propósito y alcance del proyecto"
        />
        <p className="text-sm text-gray-500 mt-1">{newProject.description.length}/200 caracteres</p>
      </div>
      <div>
        <Label>Tipo de Proyecto (Máximo 3)</Label>
        <div className="mt-2">
          <MultiSelect
            options={projectTypes}
            selected={newProject.project_type}
            onChange={(selected) => handleInputChange('project_type', selected)}
            placeholder="Seleccione hasta 3 tipos de proyecto"
            maxItems={3}
          />
        </div>
      </div>
    </div>
  )
}