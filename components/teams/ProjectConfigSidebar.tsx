import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Settings, FileText, Users, BarChart, List, UserPlus } from 'lucide-react'

interface ProjectConfigSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function ProjectConfigSidebar({ activeSection, setActiveSection }: ProjectConfigSidebarProps) {
  const sectionIcons = {
    general: <Settings className="w-6 h-6" />,
    details: <FileText className="w-6 h-6" />,
    team: <Users className="w-6 h-6" />,
    progress: <BarChart className="w-6 h-6" />,
    requirements: <List className="w-6 h-6" />,
    applications: <UserPlus className="w-6 h-6" />,
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