import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Settings, FileText, Users, BarChart, List, UserPlus, UserCheck } from 'lucide-react'

interface ProjectConfigSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function ProjectConfigSidebar({ activeSection, setActiveSection }: ProjectConfigSidebarProps) {
  const sectionIcons = {
    general: <Settings className="w-6 h-6" />,
    detalles: <FileText className="w-6 h-6" />,
    equipo: <Users className="w-6 h-6" />,
    progreso: <BarChart className="w-6 h-6" />,
    requerimientos: <List className="w-6 h-6" />,
    aplicaciones: <UserPlus className="w-6 h-6" />,
    solicitudes: <UserCheck className="w-6 h-6" />
  }

  return (
    <Card className="col-span-3 shadow-lg rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <nav className="space-y-2">
          {Object.entries(sectionIcons).map(([key, icon]) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeSection === key ? "default" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => setActiveSection(key)}
                >
                  {icon}
                  <span className="ml-2 capitalize">{key}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver sección de {key}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}