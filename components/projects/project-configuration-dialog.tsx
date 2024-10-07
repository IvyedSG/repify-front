import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type Project = {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  status: string
  project_type: string[]
  priority: string
  responsible: number
  detailed_description: string
  type_aplyuni: string
  expected_benefits: string
  necessary_requirements: string
  progress: number
  accepting_applications: boolean
  name_uniuser: string
}

interface ProjectConfigurationDialogProps {
  project: Project | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectConfigurationDialog({ project, isOpen, onOpenChange }: ProjectConfigurationDialogProps) {
  const [editedProject, setEditedProject] = useState<Project | null>(project)

  if (!editedProject) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedProject(prev => ({ ...prev!, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setEditedProject(prev => ({ ...prev!, [name]: value }))
  }

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setEditedProject(prev => ({ ...prev!, [name]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the editedProject to your backend
    console.log('Submitting edited project:', editedProject)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Configuración del Proyecto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Proyecto</Label>
            <Input id="name" name="name" value={editedProject.name} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" name="description" value={editedProject.description} onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Fecha de Inicio</Label>
              <Input id="start_date" name="start_date" type="date" value={editedProject.start_date} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">Fecha de Fin</Label>
              <Input id="end_date" name="end_date" type="date" value={editedProject.end_date} onChange={handleInputChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select onValueChange={handleSelectChange('status')} defaultValue={editedProject.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en espera">En Espera</SelectItem>
                  <SelectItem value="en progreso">En Progreso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select onValueChange={handleSelectChange('priority')} defaultValue={editedProject.priority}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="detailed_description">Descripción Detallada</Label>
            <Textarea id="detailed_description" name="detailed_description" value={editedProject.detailed_description} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type_aplyuni">Tipo de Aplicación Universitaria</Label>
            <Input id="type_aplyuni" name="type_aplyuni" value={editedProject.type_aplyuni} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expected_benefits">Beneficios Esperados</Label>
            <Textarea id="expected_benefits" name="expected_benefits" value={editedProject.expected_benefits} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="necessary_requirements">Requisitos Necesarios</Label>
            <Textarea id="necessary_requirements" name="necessary_requirements" value={editedProject.necessary_requirements} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="progress">Progreso (%)</Label>
            <Input id="progress" name="progress" type="number" min="0" max="100" value={editedProject.progress} onChange={handleInputChange} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="accepting_applications"
              checked={editedProject.accepting_applications}
              onCheckedChange={handleSwitchChange('accepting_applications')}
            />
            <Label htmlFor="accepting_applications">Aceptando Aplicaciones</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}