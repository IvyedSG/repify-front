import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ProjectLeaderProps {
  creator: string;
  university: string;
}

export default function ProjectLeader({ creator, university }: ProjectLeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Líder del Proyecto</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {creator.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{creator}</p>
          <p className="text-sm text-muted-foreground">{university}</p>
        </div>
      </CardContent>
    </Card>
  )
}