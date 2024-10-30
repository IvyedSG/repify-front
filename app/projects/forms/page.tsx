'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import PageContainer from '@/components/layout/page-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link, AlertCircle } from 'lucide-react'
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
  const [newFormTitle, setNewFormTitle] = useState('')
  const [newFormUrl, setNewFormUrl] = useState('')
  const [formError, setFormError] = useState('')

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

  const FormCardSkeleton = () => (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="h-6 w-6 rounded-full" />
        <div className="flex-grow space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <div className="bg-muted p-2">
        <Skeleton className="h-4 w-1/3 mx-auto" />
      </div>
    </Card>
  )

  if (error) {
    return (
      <PageContainer scrollable={true}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No se pudieron cargar los formularios. Por favor, intente más tarde.</AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  return (
    <PageContainer scrollable={true}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">FORMULARIOS</h2>
          <p className="text-muted-foreground">
            ¡Siéntete libre de apoyar a otros resolviendo encuestas!
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={userHasForm}>
              {userHasForm ? 'Límite de publicación alcanzado' : '+ Publicar Formulario'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Publicar un formulario</DialogTitle>
            <DialogDescription>
              Solo puede publicar un formulario por cuenta. El formulario se mantendrá durante 15 días y luego se eliminará, podrá publicar otro cuando éste sea borrado.
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
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              <Button type="submit">Crear Formulario</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirmar Publicación</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea publicar este formulario? Recuerde que:
            <ul className="list-disc list-inside mt-2">
              <li>Solo puede publicar un formulario por cuenta.</li>
              <li>No podrá eliminar el formulario hasta que pasen 15 días desde su publicación.</li>
            </ul>
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancelar</Button>
            <Button onClick={confirmCreateForm}>Confirmar Publicación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {!forms ? (
          Array(6).fill(0).map((_, index) => (
            <FormCardSkeleton key={index} />
          ))
        ) : forms.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">No hay formularios disponibles.</p>
        ) : (
          forms.map((form) => (
            <Card key={form.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                <Link className="h-6 w-6 flex-shrink-0" />
                <div className="flex-grow overflow-hidden">
                  <CardTitle className="truncate">{form.title}</CardTitle>
                  <p className="text-sm text-muted-foreground truncate">
                    <a href={form.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {form.url}
                    </a>
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  Creado por: {form.first_name} {form.last_name}
                </p>
              </CardContent>
              <div
                className="bg-muted p-2 text-center text-sm text-muted-foreground"
                style={{
                  borderBottomLeftRadius: '0.5rem',
                  borderBottomRightRadius: '0.5rem',
                }}
              >
                Publicado el {new Date(form.created_at).toLocaleDateString()}
              </div>
            </Card>
          ))
        )}
      </div>
    </PageContainer>
  )
}