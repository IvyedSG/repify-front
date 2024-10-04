import React from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'

const projectStatuses = ["En progreso", "Planificación", "En espera", "Completado", "Cancelado"]

interface ProjectDetailsProps {
  newProject: {
    status: string;
    priority: string;
    end_date: string;
    progress: number;
  };
  handleInputChange: (name: string, value: any) => void;
}

export function ProjectDetails({ newProject, handleInputChange }: ProjectDetailsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="status">Estado del Proyecto</Label>
        <Select 
          name="status" 
          value={newProject.status} 
          onValueChange={(value) => handleInputChange('status', value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            {projectStatuses.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="priority">Prioridad</Label>
        <Select 
          name="priority" 
          value={newProject.priority} 
          onValueChange={(value) => handleInputChange('priority', value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Baja">Baja</SelectItem>
            <SelectItem value="Media">Media</SelectItem>
            <SelectItem value="Alta">Alta</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="end_date">Fecha de Finalización</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !newProject.end_date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {newProject.end_date ? format(new Date(newProject.end_date), "PPP") : <span>Selecciona una fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={newProject.end_date ? new Date(newProject.end_date) : undefined}
              onSelect={(date) => handleInputChange('end_date', date ? date.toISOString() : '')}
              initialFocus
              className="dark:bg-gray-800 dark:text-white"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="progress">Progreso (%)</Label>
        <Slider
          id="progress"
          min={0}
          max={100}
          step={1}
          value={[newProject.progress]}
          onValueChange={(value) => handleInputChange('progress', value[0])}
        />
        <p className="text-sm text-gray-500 mt-1">{newProject.progress}%</p>
      </div>
    </div>
  )
}