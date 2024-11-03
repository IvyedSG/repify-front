"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/use-toast'
import { Users, UserMinus } from 'lucide-react'
import Link from 'next/link'

interface Collaborator {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name_responsible: string;
  collaboration_count: number;
  collaborators: Collaborator[];
}

interface TeamSectionProps {
  project: Project;
  onCollaboratorRemoved?: () => void;
}

export default function TeamSection({ project, onCollaboratorRemoved }: TeamSectionProps) {
  const { data: session } = useSession()
  const [collaborators, setCollaborators] = useState<Collaborator[]>(project.collaborators || [])
  const [removingCollaborators, setRemovingCollaborators] = useState<Set<number>>(new Set())

  const handleRemoveCollaborator = async (userId: number) => {
    if (!session?.user?.accessToken) return
    console.log("Enviando DELETE para:", { userId, projectId: project.id });
    
    setRemovingCollaborators(prev => new Set(prev).add(userId))
    
    try {
      const response = await fetch(`${process.env.API_URL}/usuario/projects/delete_collaborator/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.user.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project_id: project.id, user_id: userId }),
      })

      if (response.status === 204) {
        toast({
          title: "Éxito",
          description: "Colaborador eliminado correctamente",
        })

        setCollaborators((prev) => prev.filter((c) => c.id !== userId))

        if (typeof onCollaboratorRemoved === 'function') {
          onCollaboratorRemoved()
        }
      } else {
        console.error('Unexpected response status:', response.status)
        toast({
          title: "Error",
          description: "No se pudo eliminar al colaborador. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error removing collaborator:', error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar al colaborador. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setRemovingCollaborators(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const isAnyCollaboratorBeingRemoved = removingCollaborators.size > 0

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <Users className="inline-block w-4 h-4 mr-2" />
          Líder del Proyecto
        </label>
        <div className="flex items-center mt-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-user.png" alt={project.name_responsible || 'Project Leader'} />
            <AvatarFallback>{(project.name_responsible || 'PL').charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="ml-2 text-gray-800 dark:text-gray-200">
            {project.name_responsible || 'No name provided'}
          </span>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <Users className="inline-block w-4 h-4 mr-2" />
          Miembros del Equipo ({collaborators.length})
        </label>
        <div className="mt-2 space-y-2">
          {collaborators.length > 0 ? (
            collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.png" alt={collaborator.name || 'Collaborator'} />
                    <AvatarFallback>{(collaborator.name || 'C').charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-gray-800 dark:text-gray-200">
                    <Link href={`/projects/profiles/${collaborator.id}`} className="hover:underline">
                      {collaborator.name || 'No name provided'}
                    </Link>
                  </span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      disabled={isAnyCollaboratorBeingRemoved}
                    >
                      <UserMinus className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro de que quieres eliminar a este colaborador?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. El colaborador será removido del proyecto.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleRemoveCollaborator(collaborator.id)} 
                        disabled={removingCollaborators.has(collaborator.id)}
                      >
                        {removingCollaborators.has(collaborator.id) ? 'Eliminando...' : 'Eliminar'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No hay miembros en este proyecto.</p>
          )}
        </div>
      </div>
    </div>
  )
}