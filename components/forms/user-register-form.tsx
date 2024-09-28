'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import toast, { Toaster } from 'react-hot-toast';

const formSchema = z.object({
  email: z.string().email({ message: 'Ingresa un correo electrónico válido' }),
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
  confirmPassword: z.string(),
  university: z.string().min(1, { message: 'La universidad es requerida' }),
  career: z.string().min(1, { message: 'La carrera es requerida' }),
  cycle: z.string().min(1, { message: 'El ciclo es requerido' }),
  first_name: z.string().min(1, { message: 'El nombre es requerido' }),
  last_name: z.string().min(1, { message: 'El apellido es requerido' }),
  biography: z.string().optional(),
  achievements: z.string().optional(),
  photo: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserRegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      university: '',
      career: '',
      cycle: '',
      first_name: '',
      last_name: '',
      biography: '',
      achievements: '',
      photo: ''
    }
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    try {
      const response = await fetch('https://repo-s7h0.onrender.com/usuario/login/Register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Registro exitoso. Redirigiendo al inicio de sesión...');
        setTimeout(() => router.push('/'), 2000);
      } else {
        const errorData = await response.json();
        toast.error(`Error en el registro: ${errorData.message || 'Intenta nuevamente'}`);
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      toast.error('Error inesperado. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    const fields = ['email', 'password', 'confirmPassword'];
    const isValid = await form.trigger(fields);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  return (
    <>
      <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
          {step === 1 && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="tu@email.com" disabled={loading} {...field} />
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
                      <Input type="password" placeholder="********" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" onClick={nextStep} disabled={loading}>Siguiente</Button>
            </>
          )}

          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Universidad</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu universidad" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="career"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carrera</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu carrera" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciclo</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu ciclo actual" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="button" onClick={prevStep} disabled={loading}>Anterior</Button>
                <Button type="button" onClick={nextStep} disabled={loading}>Siguiente</Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu apellido" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="button" onClick={prevStep} disabled={loading}>Anterior</Button>
                <Button type="button" onClick={nextStep} disabled={loading}>Siguiente</Button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <FormField
                control={form.control}
                name="biography"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografía</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Cuéntanos sobre ti..." disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="achievements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logros</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tus logros académicos o personales..." disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de la foto (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://ejemplo.com/tu-foto.jpg" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="button" onClick={prevStep} disabled={loading}>Anterior</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Registrando...' : 'Registrar'}
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
    </>
  );
}