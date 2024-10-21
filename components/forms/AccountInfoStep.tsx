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
              <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
              Tu correo electrónico
            </FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="estudiante@universidad.edu" 
                disabled={loading} 
                {...field} 
                aria-describedby="email-description"
              />
            </FormControl>
            <FormMessage id="email-description" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center mb-4 mt-4">
              <Lock className="mr-2 h-4 w-4" aria-hidden="true" />
              Crea una contraseña segura
            </FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="Mínimo 8 caracteres" 
                disabled={loading} 
                {...field} 
                aria-describedby="password-description"
              />
            </FormControl>
            <FormMessage id="password-description" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center mb-4 mt-4">
              <Lock className="mr-2 h-4 w-4" aria-hidden="true" />
              Confirma tu contraseña
            </FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="Repite tu contraseña" 
                disabled={loading} 
                {...field} 
                aria-describedby="confirm-password-description"
              />
            </FormControl>
            <FormMessage id="confirm-password-description" />
          </FormItem>
        )}
      />
    </>
  )
}