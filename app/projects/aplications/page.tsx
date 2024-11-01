"use client"

import { useState, useCallback, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import PageContainer from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Trash2, MessageCircle } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import useSWR, { mutate } from 'swr'
import { css } from '@emotion/react'
const customStyles = css`
  @media (min-width: 720px) and (max-width: 1099px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
  @media (min-width: 1150px) and (max-width: 1400px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (min-width: 1401px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`

type Application = {
  id_solicitud: number
  id_user: number
  id_project: number
  status: string
  name_user: string
  name_lider: string
  name_project: string
  created_at: string
  message: string
}

const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  if (res.status === 404) {
    return [] // Return an empty array for 404 responses
  }
  if (!res.ok) {
    throw new Error('Failed to fetch applications')
  }
  return res.json()
}

export default function ApplicationsPage() {
  const { data: session } = useSession()
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [applicationToDelete, setApplicationToDelete] = useState<number | null>(null)

  const { data: applications, error } = useSWR<Application[]>(
    session?.user?.accessToken ? ['http://127.0.0.1:8000/usuario/projects/solicitudes_user/', session.user.accessToken] : null,
    ([url, token]) => fetcher(url, token),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: (err) => {
        console.error('Error fetching applications:', err)
        toast({
          title: "Error",
          description: "Failed to load applications. Please try again later.",
          variant: "destructive"
        })
      }
    }
  )

  const loading = !applications && !error

  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'aceptada': return 'bg-green-100 text-green-800'
      case 'rechazado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }, [])

  const filterApplications = useCallback((status: string) => {
    return applications?.filter(app => 
      (status === 'all' || app.status.toLowerCase() === status.toLowerCase()) &&
      (app.name_project.toLowerCase().includes(searchTerm.toLowerCase()) ||
       app.name_lider.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || []
  }, [applications, searchTerm])

  const ApplicationSkeleton = useMemo(() => () => (
    <Card className="bg-card">
      <CardHeader>
        <Skeleton className="w-3/4 h-6 bg-muted" />
        <Skeleton className="w-1/2 h-4 bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="w-20 h-6 bg-muted" />
          <Skeleton className="w-32 h-4 bg-muted" />
        </div>
        <Skeleton className="w-full h-4 bg-muted" />
        <Skeleton className="w-full h-10 mt-4 bg-muted" />
      </CardContent>
    </Card>
  ), [])

  const handleDeleteApplication = async () => {
    if (!session?.user?.accessToken || applicationToDelete === null) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action.",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/usuario/projects/delete_solicitud/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`
        },
        body: JSON.stringify({ solicitud_id: applicationToDelete })
      })

      if (!response.ok) {
        throw new Error('Failed to delete application')
      }

      mutate(
        ['http://127.0.0.1:8000/usuario/projects/solicitudes_user/', session.user.accessToken],
        applications?.filter(app => app.id_solicitud !== applicationToDelete),
        false
      )

      toast({
        title: "Éxito",
        description: "La solicitud ha sido eliminada correctamente.",
        variant: "default"
      })
    } catch (error) {
      console.error('Error deleting application:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la solicitud. Por favor, intente de nuevo.",
        variant: "destructive"
      })
    } finally {
      setDeleteDialogOpen(false)
      setApplicationToDelete(null)
    }
  }

  const renderApplications = useCallback((tab: string) => {
    if (loading) {
      return Array(6).fill(0).map((_, index) => <ApplicationSkeleton key={index} />)
    }
    if (error) {
      return <div className="text-center text-red-500 col-span-full">Failed to load applications. Please try again later.</div>
    }
    const filteredApps = filterApplications(tab)
    if (filteredApps.length === 0) {
      return <div className="text-center col-span-full text-muted-foreground">No hay solicitudes actuales</div>
    }
    return filteredApps.map((application) => (
      <Card key={application.id_solicitud} className="bg-card">
        <CardHeader>
          <CardTitle className="text-xl text-card-foreground">{application.name_project}</CardTitle>
          <p className="text-sm text-muted-foreground">Líder del proyecto: {application.name_lider}</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(application.status)}>
                {application.status}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Postulación realizada el {new Date(application.created_at).toLocaleDateString()}
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ver mensaje enviado
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mensaje de aplicación</DialogTitle>
                  <DialogDescription>
                    Este es el mensaje que enviaste al aplicar al proyecto.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <p>{application.message}</p>
                </div>
              </DialogContent>
            </Dialog>
            
            {application.status.toLowerCase() === 'pendiente' ? (
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                onClick={() => {
                  setApplicationToDelete(application.id_solicitud)
                  setDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Retirar Solicitud
              </Button>
            ) : (
              <Link href={`/projects/${application.id_project}`} passHref>
                <Button className="w-full" variant="outline">
                  Ver Proyecto
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    ))
  }, [loading, error, filterApplications, getStatusColor, ApplicationSkeleton, applications, setApplicationToDelete, setDeleteDialogOpen])

  return (
    <PageContainer scrollable={true}>
      <div css={customStyles} className="space-y-6 max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Mis Solicitudes</h1>
          <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
            <Input 
              className="w-full sm:w-[300px] bg-input text-input-foreground" 
              placeholder="Buscar solicitudes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-input text-input-foreground">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="aceptada">Aceptada</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
  
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="inline-flex justify-start bg-muted">
            <TabsTrigger value="all" className="flex-1 sm:flex-none data-[state=active]:bg-background">Todos</TabsTrigger>
            <TabsTrigger value="pendiente" className="flex-1 sm:flex-none data-[state=active]:bg-background">Pendiente</TabsTrigger>
            <TabsTrigger value="aceptada" className="flex-1 sm:flex-none data-[state=active]:bg-background">Aceptada</TabsTrigger>
            <TabsTrigger value="rechazado" className="flex-1 sm:flex-none data-[state=active]:bg-background">Rechazado</TabsTrigger>
          </TabsList>
  
          {(['all', 'pendiente', 'aceptada', 'rechazado'] as const).map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
                {renderApplications(tab)}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
  
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta solicitud? Es posible que si eliminas muchas solicitudes se te impida postular por algunas horas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteApplication}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )  
}