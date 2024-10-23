import React from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'

const projectStatuses = ["Planificando", "En progreso", "En pausa"]

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
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ''
    try {
      return format(parseISO(dateString), "PPP")
    } catch {
      return dateString
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd")
      handleInputChange('end_date', formattedDate)
    } else {
      handleInputChange('end_date', '')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="status">Estado del Proyecto</Label>
        <div className="mt-2"> {/* Puedes ajustar el valor de "mt-4" según el espacio que necesites */}
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
        <SelectItem key={status} value={status}>
          {status}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

      </div>
      <div>
        <Label htmlFor="priority">Prioridad</Label>
        <div className="mt-2"> {/* Ajusta el valor de "mt-4" según el espaciado que prefieras */}
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

      </div>
      <div>
        <Label htmlFor="end_date">Fecha de Finalización</Label>
        <div className="mt-2"> {/* Ajusta "mt-4" según el espaciado que necesites */}
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
        {newProject.end_date ? formatDateForDisplay(newProject.end_date) : <span>Selecciona una fecha</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={newProject.end_date ? parseISO(newProject.end_date) : undefined}
        onSelect={handleDateChange}
        initialFocus
        className="dark:bg-gray-800 dark:text-white"
      />
    </PopoverContent>
  </Popover>
</div>
      </div>
      <div>
        <Label htmlFor="progress">Progreso (%)</Label>
        <div className="mt-4"> {/* Ajusta "mt-4" según el espaciado que necesites */}
  <Slider
    id="progress"
    min={0}
    max={100}
    step={1}
    value={[newProject.progress]}
    onValueChange={(value) => handleInputChange('progress', value[0])}
  />
</div>

        <p className="text-sm text-gray-500 mt-1">{newProject.progress}%</p>
      </div>
    </div>
  )
}