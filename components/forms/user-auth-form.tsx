'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import toast, { Toaster } from 'react-hot-toast'

const formSchema = z.object({
  email: z.string().email({ message: 'Ingresa un correo electrónico válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
})

type UserFormValue = z.infer<typeof formSchema>

export default function UserAuthForm() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' }
  })

  useEffect(() => {
    if (status === 'authenticated') {
      console.log('Session authenticated, redirecting to /projects')
      router.push('/projects')
    }
  }, [status, router])

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true)
    try {
      console.log('Attempting to sign in')
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      })

      if (result?.error) {
        console.error('Sign in error:', result.error)
        toast.error('Correo electrónico o contraseña inválidos', {
          duration: 3000,
          position: 'top-right',
        })
      } else if (result?.ok) {
        console.log('Sign in successful')
        toast.success('Inicio de sesión exitoso. Redirigiendo...', {
          duration: 3000,
          position: 'top-right',
        })
        router.push('/projects')
      }
    } catch (error) {
      console.error('Error during login:', error)
      toast.error('Ocurrió un error inesperado', {
        duration: 3000,
        position: 'top-right',
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    console.log('Session status: loading')
    return <div>Cargando...</div>
  }

  return (
    <>
      <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="junior@help.me" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="***********" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="w-full" type="submit">
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>
      </Form>
    </>
  )
}