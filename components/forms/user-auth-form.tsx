'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Eye, EyeOff } from 'lucide-react' 

const formSchema = z.object({
  email: z.string().email({ message: 'Ingresa un correo electrónico válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
})

type UserFormValue = z.infer<typeof formSchema>

export default function UserAuthForm() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' }
  })

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

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

  if (status === 'loading') {
    return <div>Cargando...</div>
  }

  if (status === 'authenticated') {
    router.push('/projects')
    return null
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 max-w-[320px] mx-auto sm:max-w-none">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl className="max-w-[320px] mx-auto sm:max-w-none">
                <Input 
                  type="email" 
                  placeholder="junior@help.me" 
                  disabled={loading} 
                  {...field} 
                  className="w-full mx-auto sm:w-4/5 md:w-full"
                />
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
              <FormControl className="max-w-[320px] mx-auto sm:max-w-none">
                <div className="relative w-full mx-auto sm:w-4/5 md:w-full">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="***********"
                    disabled={loading}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} className="w-full max-w-[320px] mx-auto block sm:max-w-none" type="submit">
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </form>
    </Form>
  )
}
