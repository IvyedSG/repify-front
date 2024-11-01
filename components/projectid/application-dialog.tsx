import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Info, Send, X } from 'lucide-react'

interface ApplicationDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (message: string) => void
  projectName: string
}

export function ApplicationDialog({ isOpen, onClose, onSubmit, projectName }: ApplicationDialogProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (message.trim()) {
      onSubmit(message)
      setMessage('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <DialogHeader className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Send className="w-6 h-6 mr-2" />
            Aplicar al proyecto
          </DialogTitle>
          <DialogDescription className="text-blue-100 mt-2">
            {projectName}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 flex items-center mb-2">
              <Info className="w-5 h-5 mr-2" />
              Indicaciones importantes
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <li>• Puedes dejar tu número de contacto para una comunicación rápida.</li>
              <li>• Puedes incluir un breve mensaje de presentación.</li>
              <li>• Puedes agregar enlaces a trabajos o proyectos anteriores.</li>
            </ul>
          </div>
          <div className="space-y-4">
            <Label htmlFor="message" className="text-lg font-medium">
              Tu mensaje para el líder del proyecto
            </Label>
            <Textarea
              id="message"
              placeholder="Escribe tu mensaje aquí..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
            />
          </div>
        </div>
        <DialogFooter className="p-6 bg-gray-50 dark:bg-gray-700">
          <div className="flex justify-end space-x-4 w-full">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200 ease-in-out flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmit} 
              disabled={!message.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 ease-in-out flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar aplicación
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}