import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ProjectLeaderProps {
  creator: string;
  university: string;
  responsible: number;
}

export default function ProjectLeader({ creator, university, responsible }: ProjectLeaderProps) {
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
          <Link href={`/projects/profiles/${responsible}`} className="font-semibold hover:underline">
            {creator}
          </Link>
          <p className="text-sm text-muted-foreground">{university}</p>
        </div>
      </CardContent>
    </Card>
  )
}
