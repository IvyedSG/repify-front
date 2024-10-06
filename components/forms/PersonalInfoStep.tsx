import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { User, Image } from 'lucide-react'

interface PersonalInfoStepProps {
  form: any;
  loading: boolean;
}

export function PersonalInfoStep({ form, loading }: PersonalInfoStepProps) {
  return (
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
    </>
  )
}