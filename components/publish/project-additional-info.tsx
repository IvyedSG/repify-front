import React from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { convertToUniversitySiglas } from '@/lib/universityConverter'

interface ProjectAdditionalInfoProps {
  newProject: {
    detailed_description: string;
    expected_benefits: string;
    necessary_requirements: string;
    accepting_applications: boolean;
    type_aplyuni: string;
  };
  handleInputChange: (name: string, value: any) => void;
  userUniversity: string | undefined;
}

export function ProjectAdditionalInfo({ newProject, handleInputChange, userUniversity }: ProjectAdditionalInfoProps) {
  const handleTypeAplyUniChange = (checked: boolean) => {
    if (checked && userUniversity) {
      const universitySiglas = convertToUniversitySiglas(userUniversity);
      handleInputChange('type_aplyuni', universitySiglas);
    } else {
      handleInputChange('type_aplyuni', 'LIBRE');
    }
  };

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
          placeholder="Proporcione una descripción completa del proyecto, sus objetivos y alcance"
        />
        <p className="text-sm text-gray-500 mt-1">{newProject.detailed_description.length}/400 caracteres</p>
      </div>
      <div>
        <Label htmlFor="expected_benefits">Beneficios Esperados</Label>
        <Textarea
          id="expected_benefits"
          name="expected_benefits"
          value={newProject.expected_benefits}
          onChange={(e) => handleInputChange('expected_benefits', e.target.value.slice(0, 300))}
          required
          maxLength={300}
          placeholder="Describa los beneficios que se esperan obtener del proyecto"
        />
        <p className="text-sm text-gray-500 mt-1">{newProject.expected_benefits.length}/300 caracteres</p>
      </div>
      <div>
        <Label htmlFor="necessary_requirements">Requisitos Necesarios</Label>
        <Textarea
          id="necessary_requirements"
          name="necessary_requirements"
          value={newProject.necessary_requirements}
          onChange={(e) => handleInputChange('necessary_requirements', e.target.value.slice(0, 300))}
          required
          maxLength={300}
          placeholder="Enumere los requisitos necesarios para participar en el proyecto"
        />
        <p className="text-sm text-gray-500 mt-1">{newProject.necessary_requirements.length}/300 caracteres</p>
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