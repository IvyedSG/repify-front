'use client'

import React, { useMemo } from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { School, BookOpen } from 'lucide-react'

const universities = [
  "Universidad Nacional Mayor de San Marcos",
  "Universidad Nacional de Ingeniería",
  "Universidad Nacional Agraria La Molina",
  "Universidad Nacional Federico Villarreal",
  "Universidad Nacional Tecnológica de Lima Sur",
  "Pontificia Universidad Católica del Perú",
  "Universidad Peruana Cayetano Heredia",
  "Universidad de Lima",
  "Universidad de San Martín de Porres",
  "Universidad Ricardo Palma",
  "Universidad Peruana de Ciencias Aplicadas",
  "Universidad Privada Norbert Wiener",
  "Universidad Privada San Juan Bautista",
  "Universidad Tecnológica del Perú",
  "Universidad Científica del Sur",
  "Universidad Privada Arzobispo Loayza",
  "Universidad Autónoma del Perú"
]

const careers = [
  "Educación Inicial",
  "Administración de Empresas",
  "Administración y Marketing",
  "Administración y Negocios Internacionales",
  "Ciencias de la Comunicación",
  "Contabilidad",
  "Administración y Finanzas",
  "Farmacia y Bioquímica",
  "Enfermería",
  "Psicología",
  "Terapia Física y Rehabilitación",
  "Derecho",
  "Arquitectura",
  "Ingeniería Ambiental",
  "Ingeniería Biomédica",
  "Ingeniería Civil",
  "Ingeniería Mecatrónica",
  "Ingeniería de Sistemas",
  "Ingeniería Industrial",
  "Ingeniería de Software"
]

const cycles = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

interface AcademicInfoStepProps {
  form: any;
  loading: boolean;
}

export function AcademicInfoStep({ form, loading }: AcademicInfoStepProps) {
  const memoizedUniversities = useMemo(() => universities, []);
  const memoizedCareers = useMemo(() => careers, []);
  const memoizedCycles = useMemo(() => cycles, []);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="university"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center mb-2">
              <School className="mr-2 h-4 w-4" aria-hidden="true" />
              Universidad
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona tu universidad" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {memoizedUniversities.map((university) => (
                  <SelectItem key={university} value={university}>
                    {university}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="career"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center mb-2">
              <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />
              Carrera
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona tu carrera" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {memoizedCareers.map((career) => (
                  <SelectItem key={career} value={career}>
                    {career}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cycle"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center mb-2">
              <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />
              Ciclo actual
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona tu ciclo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {memoizedCycles.map((cycle) => (
                  <SelectItem key={cycle} value={cycle}>
                    {cycle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}