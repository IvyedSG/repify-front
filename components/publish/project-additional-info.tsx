import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { convertToUniversitySiglas } from '@/lib/universityConverter'

interface ProjectAdditionalInfoProps {
  newProject: {
    detailed_description: string;
    objectives: string[];
    necessary_requirements: string[];
    accepting_applications: boolean;
    type_aplyuni: string;
  };
  handleInputChange: (name: string, value: any) => void;
  userUniversity: string | undefined;
}

export function ProjectAdditionalInfo({ newProject, handleInputChange, userUniversity }: ProjectAdditionalInfoProps) {
  const [newObjective, setNewObjective] = useState('')
  const [newRequirement, setNewRequirement] = useState('')

  const handleTypeAplyUniChange = (checked: boolean) => {
    if (checked && userUniversity) {
      const universitySiglas = convertToUniversitySiglas(userUniversity);
      handleInputChange('type_aplyuni', universitySiglas);
    } else {
      handleInputChange('type_aplyuni', 'LIBRE');
    }
  };

  const addObjective = () => {
    if (newObjective && newProject.objectives.length < 3) {
      handleInputChange('objectives', [...newProject.objectives, newObjective])
      setNewObjective('')
    }
  }

  const addRequirement = () => {
    if (newRequirement && newProject.necessary_requirements.length < 5) {
      handleInputChange('necessary_requirements', [...newProject.necessary_requirements, newRequirement])
      setNewRequirement('')
    }
  }

  const removeObjective = (index: number) => {
    const updatedObjectives = newProject.objectives.filter((_, i) => i !== index)
    handleInputChange('objectives', updatedObjectives)
  }

  const removeRequirement = (index: number) => {
    const updatedRequirements = newProject.necessary_requirements.filter((_, i) => i !== index)
    handleInputChange('necessary_requirements', updatedRequirements)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="detailed_description">Descripción Detallada</Label>
        <Textarea
          id="detailed_description"
          name="detailed_description"
          value={newProject.detailed_description}
          onChange={(e) => handleInputChange('detailed_description', e.target.value.slice(0, 400))}
          required
          maxLength={400}
          className="mt-2"
          placeholder="Proporcione una descripción completa del proyecto, sus objetivos y alcance"
        />
        <p className="text-sm text-gray-500 mt-2">{newProject.detailed_description.length}/400 caracteres</p>
      </div>
      <div>
        <Label htmlFor="objectives">Objetivos del Proyecto (máximo 3)</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {newProject.objectives.map((objective, index) => (
            <div key={index} className="flex items-center bg-secondary/50 p-2 rounded-md">
              <span>{objective}</span>
              <Button type="button" variant="ghost" size="icon" className="ml-2" onClick={() => removeObjective(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Input
            id="new-objective"
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            placeholder="Nuevo objetivo"
            disabled={newProject.objectives.length >= 3}
          />
          <Button type="button" onClick={addObjective} disabled={newProject.objectives.length >= 3}>
            Agregar
          </Button>
        </div>
      </div>
      <div>
        <Label htmlFor="necessary_requirements">Requisitos Necesarios (máximo 5)</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {newProject.necessary_requirements.map((requirement, index) => (
            <div key={index} className="flex items-center bg-secondary/50 p-2 rounded-md">
              <span>{requirement}</span>
              <Button type="button" variant="ghost" size="icon" className="ml-2" onClick={() => removeRequirement(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Input
            id="new-requirement"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            placeholder="Nuevo requisito"
            disabled={newProject.necessary_requirements.length >= 5}
          />
          <Button type="button" onClick={addRequirement} disabled={newProject.necessary_requirements.length >= 5}>
            Agregar
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="accepting_applications"
          checked={newProject.accepting_applications}
          onCheckedChange={(checked) => handleInputChange('accepting_applications', checked)}
        />
        <Label htmlFor="accepting_applications">Aceptar Solicitudes</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="type_aplyuni"
          checked={newProject.type_aplyuni !== 'LIBRE'}
          onCheckedChange={handleTypeAplyUniChange}
        />
        <Label htmlFor="type_aplyuni">Solo solicitudes de mi universidad</Label>
      </div>
    </div>
  )
}