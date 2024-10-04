'use client'

import React, { useState } from 'react'
import ViewProjects from '@/components/ViewProjects'
import { PublishProjectDialog } from '@/components/publish/publish-project-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from 'lucide-react'

export default function ProjectsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Proyectos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Publicar Proyecto
            </Button>
          </DialogTrigger>
          <PublishProjectDialog setIsDialogOpen={setIsDialogOpen} />
        </Dialog>
      </div>
      <ViewProjects />
    </div>
  )
}