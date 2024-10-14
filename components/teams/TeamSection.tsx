import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users } from 'lucide-react'
import { Project } from '../../types/types'

interface TeamSectionProps {
  project: Project;
}

export default function TeamSection({ project }: TeamSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <Users className="inline-block w-4 h-4 mr-2" />
          Líder del Proyecto
        </label>
        <div className="flex items-center mt-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-avatar.jpg" alt={project.name_uniuser} />
            <AvatarFallback>{project.name_uniuser.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="ml-2 text-gray-800 dark:text-gray-200">{project.name_uniuser}</span>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <Users className="inline-block w-4 h-4 mr-2" />
          Miembros del Equipo ({project.collaboration_count})
        </label>
        <div className="mt-2 space-y-2">
          {project.collaborators.map((collaborator, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt={collaborator} />
                <AvatarFallback>{collaborator.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="ml-2 text-gray-800 dark:text-gray-200">{collaborator}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}