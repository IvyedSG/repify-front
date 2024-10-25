import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import dayjs from 'dayjs';

const projectStatuses = ["Planificando", "En progreso", "En pausa"];

// Crear tema personalizado
const theme = createTheme({
  components: {
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: 'white', // Color de los números
          '&.Mui-selected': {
            backgroundColor: '#6366F1', // Color cuando está seleccionado
          },
          '&:hover': {
            backgroundColor: '#4F46E5', // Color cuando pasas el mouse
          },
        },
      },
    },
    MuiCalendarPicker: {
      styleOverrides: {
        root: {
          backgroundColor: 'black', // Fondo del calendario
          color: 'white', // Color del texto (mes, días, etc.)
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'white', // Texto del mes y año en blanco
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'white', // Flechas de navegación blancas
          '&:hover': {
            backgroundColor: '#4F46E5', // Color de fondo cuando pasas el mouse sobre las flechas
          },
        },
      },
    },
  },
});

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
    if (!dateString) return '';
    try {
      return format(new Date(dateString), "PPP");
    } catch {
      return dateString;
    }
  };

  const handleDateChange = (date: any) => {
    if (date && dayjs(date).isValid()) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      handleInputChange('end_date', formattedDate);
    } else {
      handleInputChange('end_date', '');
    }
  };

  return (
    <div className="space-y-4">
      {/* Estado del Proyecto */}
      <div>
        <Label htmlFor="status">Estado del Proyecto</Label>
        <div className="mt-2">
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

      {/* Prioridad */}
      <div>
        <Label htmlFor="priority">Prioridad</Label>
        <div className="mt-2">
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

      {/* Fecha de Finalización */}
      <div>
        <Label htmlFor="end_date">Fecha de Finalización</Label>
        <div className="mt-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !newProject.end_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {newProject.end_date
                  ? formatDateForDisplay(newProject.end_date)
                  : <span>Selecciona una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-50 w-auto p-0 text-white bg-black shadow-lg" align="center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ThemeProvider theme={theme}>
                  <DateCalendar
                    value={newProject.end_date ? dayjs(newProject.end_date) : null}
                    onChange={handleDateChange}
                  />
                </ThemeProvider>
              </LocalizationProvider>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Progreso */}
      <div>
        <Label htmlFor="progress">Progreso (%)</Label>
        <div className="mt-4">
          <Slider
            id="progress"
            min={0}
            max={100}
            step={1}
            value={[newProject.progress]}
            onValueChange={(value) => handleInputChange('progress', value[0])}
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">{newProject.progress}%</p>
      </div>
    </div>
  );
}






