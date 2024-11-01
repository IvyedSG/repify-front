'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import PageContainer from '@/components/layout/page-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link, AlertCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

interface Form {
  id: number
  title: string
  url: string
  created_at: string
  user: number
  first_name: string
  last_name: string
}

const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.')
  }
  return res.json()
}

export default function FormsSection() {
  const { data: session } = useSession()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newFormTitle, setNewFormTitle] = useState('')
  const [newFormUrl, setNewFormUrl] = useState('')
  const [formError, setFormError] = useState('')
  const [formToDelete, setFormToDelete] = useState<number | null>(null)

  const { data: forms, error, mutate } = useSWR<Form[]>(
    session?.user?.accessToken
      ? ['http://127.0.0.1:8000/usuario/form/get_all_forms/', session.user.accessToken]
      : null,
    ([url, token]) => fetcher(url, token),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 3,
    }
  )

  const userHasForm = Array.isArray(forms) && forms.some(form => form.user === session?.user?.id)

  const validateGoogleFormsUrl = (url: string) => {
    const googleFormsRegex = /^https:\/\/(docs\.google\.com\/forms|forms\.gle)\/.+/
    return googleFormsRegex.test(url)
  }

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!validateGoogleFormsUrl(newFormUrl)) {
      setFormError('Por favor, ingrese una URL válida de Google Forms.')
      return
    }

    setIsDialogOpen(false)
    setIsConfirmDialogOpen(true)
  }

  const confirmCreateForm = async () => {
    if (!session?.user?.accessToken) return

    try {
      const response = await fetch('http://127.0.0.1:8000/usuario/form/create_form/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({ title: newFormTitle, url: newFormUrl }),
      })

      if (!response.ok) throw new Error('Failed to create form')

      await mutate()
      setIsConfirmDialogOpen(false)
      setNewFormTitle('')
      setNewFormUrl('')
      toast({
        title: 'Éxito',
        description: 'Formulario creado exitosamente',
      })
    } catch (error) {
      console.error('Error creating form:', error)
      toast({
        title: 'Error',
        description: 'No se pudo crear el formulario. Por favor, intente de nuevo.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteForm = (formId: number) => {
    setFormToDelete(formId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteForm = async () => {
    if (!session?.user?.accessToken || formToDelete === null) return

    try {
      const response = await fetch('http://127.0.0.1:8000/usuario/form/delete_form/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({ id: formToDelete }),
      })

      if (!response.ok) throw new Error('Failed to delete form')

      await mutate()
      setIsDeleteDialogOpen(false)
      setFormToDelete(null)
      toast({
        title: 'Éxito',
        description: 'Formulario eliminado exitosamente',
      })
    } catch (error) {
      console.error('Error deleting form:', error)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el formulario. Por favor, intente de nuevo.',
        variant: 'destructive',
      })
    }
  }

  const FormCardSkeleton = () => (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="w-6 h-6 rounded-full" />
        <div className="flex-grow space-y-2">
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-1/2 h-3" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Skeleton className="w-2/3 h-4" />
      </CardContent>
      <div className="p-2 bg-muted">
        <Skeleton className="w-1/3 h-4 mx-auto" />
      </div>
    </Card>
  )

  if (error) {
    return (
      <PageContainer scrollable={true}>
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No se pudieron cargar los formularios. Por favor, intente más tarde.</AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col justify-between gap-4 mb-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">FORMULARIOS</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            ¡Siéntete libre de apoyar a otros resolviendo encuestas!
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="text-sm whitespace-normal sm:whitespace-nowrap sm:text-base" disabled={userHasForm}>
              {userHasForm ? 'Límite alcanzado' : '+ Publicar'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle>Publicar un formulario</DialogTitle>
            <DialogDescription className="text-sm">
              Solo puede publicar un formulario por cuenta. Para publicar otro formulario, primero debe eliminar el existente.
            </DialogDescription>
            <form onSubmit={handleCreateForm} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newFormTitle}
                  onChange={(e) => setNewFormTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="url">URL de Google Forms</Label>
                <Input
                  id="url"
                  value={newFormUrl}
                  onChange={(e) => setNewFormUrl(e.target.value)}
                  placeholder="https://docs.google.com/forms/..."
                  required
                />
              </div>
              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full sm:w-auto">Crear Formulario</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Confirmar Publicación</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea publicar este formulario? Recuerde que solo puede tener un formulario publicado a la vez.
          </DialogDescription>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button onClick={confirmCreateForm} className="w-full sm:w-auto">
              Confirmar Publicación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea eliminar este formulario? Esta acción no se puede deshacer.
          </DialogDescription>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteForm} className="w-full sm:w-auto">
              Eliminar Formulario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 [min-width:770px]:grid-cols-1 [min-width:900px]:grid-cols-2 xl:grid-cols-3">
        {!forms ? (
          Array(6).fill(0).map((_, index) => (
            <FormCardSkeleton key={index} />
          ))
        ) : forms.length === 0 ? (
          <p className="text-center col-span-full text-muted-foreground">
            No hay formularios disponibles.
          </p>
        ) : (
          forms.map((form) => (
            <Card key={form.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-start gap-4">
                <Link className="flex-shrink-0 w-6 h-6 mt-1" />
                <div className="flex-grow min-w-0">
                  <CardTitle className="text-lg truncate">{form.title}</CardTitle>
                  <p className="text-sm truncate text-muted-foreground">
                    <a 
                      href={form.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:underline"
                    >
                      {form.url}
                    </a>
                  </p>
                </div>
                {form.user === session?.user?.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteForm(form.id)}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  Creado por: {form.first_name} {form.last_name}
                </p>
              </CardContent>
              <div className="p-2 text-sm text-center rounded-b-lg bg-muted text-muted-foreground">
                Publicado el {new Date(form.created_at).toLocaleDateString()}
              </div>
            </Card>
          ))
        )}
      </div>
    </PageContainer>
  )
}