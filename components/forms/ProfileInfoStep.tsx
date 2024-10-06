import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Award } from 'lucide-react'

interface ProfileInfoStepProps {
  form: any;
  loading: boolean;
}

export function ProfileInfoStep({ form, loading }: ProfileInfoStepProps) {
  return (
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
  )
}