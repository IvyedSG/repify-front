'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from '@/components/ui/use-toast';

interface CreateFormDialogProps {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFormSubmit: (formData: { title: string; link: string }) => void;
}

export function CreateFormDialog({ setIsDialogOpen, onFormSubmit }: CreateFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
  });

  const handleInputChange = (name: string, value: string, maxLength: number) => {
    if (value.length <= maxLength) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      onFormSubmit(formData);
      
      toast({
        title: "Formulario creado",
        description: "Tu formulario ha sido creado exitosamente.",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating form:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al crear el formulario. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Crear Nuevo Formulario</DialogTitle>
        <DialogDescription>
          Introduce el título y el link del nuevo formulario.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo de Título */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            placeholder="Ingrese el título del formulario"
            maxLength={100}
            className="mt-1 block w-full rounded-md border border-gray-500 bg-transparent focus:border-blue-500 focus:ring-blue-500 text-sm p-3"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value, 100)}
            required
          />
          <span className="text-xs text-muted-foreground">{`${formData.title.length}/100 caracteres`}</span>
        </div>

        {/* Campo de Link */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Link del Formulario</label>
          <input
            type="url"
            placeholder="Ingrese el enlace del formulario"
            maxLength={100}
            className="mt-1 block w-full rounded-md border border-gray-500 bg-transparent focus:border-blue-500 focus:ring-blue-500 text-sm p-3"
            value={formData.link}
            onChange={(e) => handleInputChange('link', e.target.value, 100)}
            required
          />
          <span className="text-xs text-muted-foreground">{`${formData.link.length}/100 caracteres`}</span>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Crear Formulario'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
