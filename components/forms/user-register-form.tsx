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
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Mail, Lock, School, BookOpen, User, FileText, Award, Image } from 'lucide-react';

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
        toast.success('¡Bienvenido a bordo! Preparando tu espacio...');
        setTimeout(() => router.push('/'), 2000);
      } else {
        const errorData = await response.json();
        toast.error(`Ups, algo salió mal: ${errorData.message || 'Intenta nuevamente'}`);
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      toast.error('Error inesperado. ¿Podrías intentarlo de nuevo?');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    const fields = step === 1 ? ['email', 'password', 'confirmPassword'] :
                   step === 2 ? ['first_name', 'last_name'] :
                   step === 3 ? ['university', 'career', 'cycle'] :
                   ['biography', 'achievements'];
  
    const isValid = await form.trigger(fields);
    if (isValid && step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const renderStep = (currentStep: number) => {
    const stepComponents = [
      // Step 1: Cuenta
      <>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center mb-4 mt-4">
                <Mail className="mr-2 h-4 w-4" />
                Tu correo electrónico
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="estudiante@universidad.edu" disabled={loading} {...field} />
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
              <FormLabel className="flex items-center mb-4 mt-4">
                <Lock className="mr-2 h-4 w-4" />
                Crea una contraseña segura
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="Mínimo 8 caracteres" disabled={loading} {...field} />
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
              <FormLabel className="flex items-center mb-4 mt-4">
                <Lock className="mr-2 h-4 w-4" />
                Confirma tu contraseña
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="Repite tu contraseña" disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>,
      // Step 2: Información Personal
      <>
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center mb-4 mt-4">
                <User className="mr-2 h-4 w-4" />
                Nombre
              </FormLabel>
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
              <FormLabel className="flex items-center mb-4 mt-4">
                <User className="mr-2 h-4 w-4" />
                Apellido
              </FormLabel>
              <FormControl>
                <Input placeholder="Tu apellido" disabled={loading} {...field} />
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
              <FormLabel className="flex items-center mb-4 mt-4">
                <Image className="mr-2 h-4 w-4" />
                URL de tu foto de perfil (opcional)
              </FormLabel>
              <FormControl>
                <Input placeholder="https://ejemplo.com/tu-foto.jpg" disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>,
      // Step 3: Información Académica
      <>
        <FormField
          control={form.control}
          name="university"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center mb-4 mt-4">
                <School className="mr-2 h-4 w-4" />
                Universidad
              </FormLabel>
              <FormControl>
                <Input placeholder="Nombre de tu universidad" disabled={loading} {...field} />
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
              <FormLabel className="flex items-center mb-4 mt-4">
                <BookOpen className="mr-2 h-4 w-4" />
                Carrera
              </FormLabel>
              <FormControl>
                <Input placeholder="Tu carrera universitaria" disabled={loading} {...field} />
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
              <FormLabel className="flex items-center mb-4 mt-4">
                <BookOpen className="mr-2 h-4 w-4" />
                Ciclo actual
              </FormLabel>
              <FormControl>
                <Input placeholder="Ej: 5to ciclo" disabled={loading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>,
      // Step 4: Perfil
      <>
        <FormField
          control={form.control}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center mb-4 mt-4">
                <FileText className="mr-2 h-4 w-4" />
                Cuéntanos sobre ti
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Comparte tus intereses, pasiones o lo que te hace único..." 
                  disabled={loading} 
                  {...field} 
                />
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
              <FormLabel className="flex items-center mb-4 mt-4">
                <Award className="mr-2 h-4 w-4" />
                Tus logros
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Comparte tus logros académicos, proyectos destacados o reconocimientos..." 
                  disabled={loading} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    ];

    return stepComponents[currentStep - 1];
  };

  const stepTitles = [
    "Crea tu cuenta",
    "Cuéntanos sobre ti",
    "Tu información académica",
    "Perfil del estudiante"
  ];

  return (
    <>
      <Toaster />
      <div className="w-full space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">{stepTitles[step - 1]}</h2>
              <p className="text-sm text-muted-foreground mt-1">Paso {step} de 4</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep(step)}
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <Button type="button" onClick={prevStep} disabled={loading} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
                </Button>
              )}
              {step < 4 && (
                <Button 
                  type="button" 
                  onClick={nextStep} 
                  disabled={loading} 
                  className={step > 1 ? '' : 'ml-auto'}
                >
                  Siguiente <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
            {step === 4 && (
              <Button type="submit" disabled={loading} className="w-full mt-4">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando tu perfil...
                  </>
                ) : (
                  '¡Unirme a la comunidad!'
                )}
              </Button>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}