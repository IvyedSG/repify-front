"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle, XCircle, MessageCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface JoinRequest {
  id_solicitud: number
  id_user: number
  id_project: number
  status: string
  name_user: string
  name_lider: string
  name_project: string
  created_at: string
  message: string
  photo?: string;
}

interface ProjectJoinRequestsProps {
  projectId: number
}

export default function ProjectJoinRequests({ projectId }: ProjectJoinRequestsProps) {
  const { data: session } = useSession()
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingRequests, setProcessingRequests] = useState<Set<number>>(new Set())

  useEffect(() => {
    const fetchJoinRequests = async () => {
      if (!session?.user?.accessToken) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/applications/applications_project/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.user.accessToken}`
          },
          body: JSON.stringify({ project_id: projectId })
        })

        if (!response.ok) {
          throw new Error('Failed to fetch join requests')
        }

        const data = await response.json()
        setJoinRequests(data)
      } catch (err) {
        console.error('Error fetching join requests:', err)
        setError('Failed to load join requests. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchJoinRequests()
  }, [session, projectId])

  const handleRequestAction = async (requestId: number, action: 'approve' | 'reject') => {
    if (!session?.user?.accessToken) {
      toast({
        title: 'Error',
        description: 'You must be logged in to perform this action.',
        variant: 'destructive',
      })
      return
    }

    if (processingRequests.has(requestId)) {
      return // Prevent multiple clicks
    }

    setProcessingRequests(prev => new Set(prev).add(requestId))

    const endpoint = action === 'approve' 
      ? `${process.env.NEXT_PUBLIC_API_URL}/usuario/applications/AcceptProject/`
      : `${process.env.NEXT_PUBLIC_API_URL}/usuario/applications/Denyproject/`

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`
        },
        body: JSON.stringify({ id_solicitud: requestId })
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} request`)
      }

      setJoinRequests(prevRequests =>
        prevRequests.map(request =>
          request.id_solicitud === requestId
            ? { ...request, status: action === 'approve' ? 'Aprobado' : 'Rechazado' }
            : request
        )
      )

      toast({
        title: action === 'approve' ? 'Solicitud aprobada' : 'Solicitud rechazada',
        description: `La solicitud ha sido ${action === 'approve' ? 'aprobada' : 'rechazada'} exitosamente.`,
        variant: 'default',
      })
    } catch (error) {
      console.error(`Error ${action === 'approve' ? 'approving' : 'rejecting'} request:`, error)
      toast({
        title: 'Error',
        description: `No se pudo ${action === 'approve' ? 'aprobar' : 'rechazar'} la solicitud. Por favor, intente de nuevo.`,
        variant: 'destructive',
      })
      // Remove the request from processing set to allow retry
      setProcessingRequests(prev => {
        const newSet = new Set(prev)
        newSet.delete(requestId)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de Unión al Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center mb-4 space-x-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de Unión al Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitudes de Unión al Proyecto</CardTitle>
      </CardHeader>
      <CardContent>
        {joinRequests.length === 0 ? (
          <p className="text-center text-gray-500">No hay solicitudes pendientes.</p>
        ) : (
          joinRequests.map((request) => (
            <div key={request.id_solicitud} className="flex flex-col items-center justify-between py-4 border-b border-gray-200 last:border-b-0 sm:flex-row">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={request.photo || "/placeholder-user.png"} />
                  <AvatarFallback>{request.name_user.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{request.name_user}</h3>
                  <p className="text-sm text-gray-500">Solicitado el: {new Date(request.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center mt-4 space-x-2 sm:space-x-4 sm:mt-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Ver mensaje
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Mensaje de {request.name_user}</DialogTitle>
                      <DialogDescription>
                        Mensaje enviado con la solicitud de unión al proyecto.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 mt-4 rounded-md bg-muted">
                      <p>{request.message}</p>
                    </div>
                  </DialogContent>
                </Dialog>
                {request.status === 'Pendiente' ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 bg-green-100 hover:bg-green-200"
                      onClick={() => handleRequestAction(request.id_solicitud, 'approve')}
                      disabled={processingRequests.has(request.id_solicitud)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 bg-red-100 hover:bg-red-200"
                      onClick={() => handleRequestAction(request.id_solicitud, 'reject')}
                      disabled={processingRequests.has(request.id_solicitud)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Rechazar
                    </Button>
                  </>
                ) : (
                  <Badge
                    variant={request.status === 'Aprobado' ? 'secondary' : 'destructive'}
                  >
                    {request.status === 'Aprobado' ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    {request.status}
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
  
}