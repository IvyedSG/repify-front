import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Mail, Lock } from 'lucide-react'

interface AccountInfoStepProps {
  form: any;
  loading: boolean;
}

export function AccountInfoStep({ form, loading }: AccountInfoStepProps) {
  return (
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
    </>
  )
}