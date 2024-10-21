'use client'

import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  email: z.string().email({ message: 'Ingresa un correo electrónico válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
})

type UserFormValue = z.infer<typeof formSchema>

export default function UserAuthForm() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = useCallback(async (data: UserFormValue) => {
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      })

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Correo electrónico o contraseña inválidos",
        })
      } else if (result?.ok) {
        toast({
          title: "Éxito",
          description: "Inicio de sesión exitoso. Redirigiendo...",
        })
        router.push('/projects')
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error inesperado",
      })
    } finally {
      setLoading(false)
    }
  }, [router, toast])

  const formFields = useMemo(() => [
    { name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'junior@help.me' },
    { name: 'password', label: 'Contraseña', type: 'password', placeholder: '***********' }
  ], [])

  if (status === 'loading') {
    return <div>Cargando...</div>
  }

  if (status === 'authenticated') {
    router.push('/projects')
    return null
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        {formFields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as 'email' | 'password'}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input type={field.type} placeholder={field.placeholder} disabled={loading} {...formField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button disabled={loading} className="w-full" type="submit">
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </form>
    </Form>
  )
}