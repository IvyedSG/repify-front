"use client"

import { useState, useCallback, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import PageContainer from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Trash2 } from 'lucide-react'
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

type Application = {
  id_solicitud: number
  id_user: number
  id_project: number
  status: string
  name_user: string
  name_lider: string
  name_project: string
  created_at: string
}

const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  if (!res.ok) throw new Error('Failed to fetch applications')
  return res.json()
}

export default function ApplicationsPage() {
  const { data: session } = useSession()
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [applicationToDelete, setApplicationToDelete] = useState<number | null>(null)

  const { data: applications, error } = useSWR<Application[]>(
    session?.user.accessToken ? ['http://127.0.0.1:8000/usuario/projects/solicitudes_user/', session.user.accessToken] : null,
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
      case 'aprobado': return 'bg-green-100 text-green-800'
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
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-full mt-4" />
      </CardContent>
    </Card>
  ), [])

  const handleDeleteApplication = async () => {
    if (!session?.user.accessToken || applicationToDelete === null) {
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

      // Update the local state
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
      return <div className="col-span-full text-center text-red-500">Failed to load applications. Please try again later.</div>
    }
    const filteredApps = filterApplications(tab)
    if (filteredApps.length === 0) {
      return <div className="col-span-full text-center text-gray-500">No hay solicitudes actuales</div>
    }
    return filteredApps.map((application) => (
      <Card key={application.id_solicitud}>
        <CardHeader>
          <CardTitle className="text-xl">{application.name_project}</CardTitle>
          <p className="text-sm text-muted-foreground">Líder del proyecto: {application.name_lider}</p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Badge className={getStatusColor(application.status)}>
              {application.status}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-1 h-4 w-4" />
              Postulación realizada el {new Date(application.created_at).toLocaleDateString()}
            </div>
          </div>
          
          {application.status.toLowerCase() === 'pendiente' ? (
            <Button 
              className="w-full mt-4" 
              
              onClick={() => {
                setApplicationToDelete(application.id_solicitud)
                setDeleteDialogOpen(true)
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Retirar Solicitud
            </Button>
          ) : (
            <Button className="w-full mt-4" variant="outline">
              Ver Proyecto
            </Button>
          )}
        </CardContent>
      </Card>
    ))
  }, [loading, error, filterApplications, getStatusColor, ApplicationSkeleton])

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Mis Solicitudes</h2>
          <div className="flex items-center space-x-2">
            <Input 
              className="w-[300px]" 
              placeholder="Buscar solicitudes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="pendiente">Pendiente</TabsTrigger>
            <TabsTrigger value="aprobado">Aprobado</TabsTrigger>
            <TabsTrigger value="rechazado">Rechazado</TabsTrigger>
          </TabsList>

          {(['all', 'pendiente', 'aprobado', 'rechazado'] as const).map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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