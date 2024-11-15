'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast, Toaster } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

import { AccountInfoStep } from './AccountInfoStep'
import { PersonalInfoStep } from './PersonalInfoStep'
import { AcademicInfoStep } from './AcademicInfoStep'
import { ProfileInfoStep } from './ProfileInfoStep'

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
  photo: z.string().optional(),
  interests: z.array(z.string()).optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

type UserFormValue = z.infer<typeof formSchema>

export default function UserRegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
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
      photo: '',
      interests: []
    }
  })

  const onSubmit = useCallback(async (data: UserFormValue) => {
    setLoading(true)
    try {
      const { confirmPassword, ...formattedData } = {
        ...data,
        interests: Array.isArray(data.interests) 
          ? data.interests 
          : data.interests 
            ? (data.interests as string).split(',').map((i: string) => i.trim()) 
            : [],
      }

      const response = await fetch(`${process.env.NEXT_SECRET_API_URL}/usuario/login/Register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      })

      if (response.ok) {
        toast.success('¡Bienvenido a bordo! Preparando tu espacio...')
        setTimeout(() => router.push('/'), 2000)
      } else {
        const errorData = await response.json()
        toast.error(`Ups, algo salió mal: ${errorData.detail || 'Intenta nuevamente'}`)
      }
    } catch (error) {
      console.error('Error durante el registro:', error)
      toast.error('Error inesperado. ¿Podrías intentarlo de nuevo?')
    } finally {
      setLoading(false)
    }
  }, [router])

  const nextStep = useCallback(async () => {
    const fields: (keyof UserFormValue)[] = step === 1 ? ['email', 'password', 'confirmPassword'] :
                                             step === 2 ? ['first_name', 'last_name'] :
                                             step === 3 ? ['university', 'career', 'cycle'] :
                                             ['biography', 'achievements', 'interests']
    const isValid = await form.trigger(fields)
    if (isValid && step < 4) {
      setStep(prevStep => prevStep + 1)
    }
  }, [form, step])

  const prevStep = useCallback(() => setStep(prevStep => prevStep - 1), [])

  const renderStep = useCallback((currentStep: number) => {
    const stepComponents = [
      <AccountInfoStep key="account" form={form} loading={loading} />,
      <PersonalInfoStep key="personal" form={form} loading={loading} />,
      <AcademicInfoStep key="academic" form={form} loading={loading} />,
      <ProfileInfoStep key="profile" form={form} loading={loading} />
    ]

    return stepComponents[currentStep - 1]
  }, [form, loading])

  const stepTitles = [
    "Crea tu cuenta",
    "Cuéntanos sobre ti",
    "Tu información académica",
    "Perfil del estudiante"
  ]

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
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Finalizar registro'}
              </Button>
            )}
          </form>
        </Form>
      </div>
    </>
  )
}
