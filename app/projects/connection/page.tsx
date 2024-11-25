'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, ExternalLink, School, BookOpen } from 'lucide-react'
import PageContainer from '@/components/layout/page-container'
import { cn } from "@/lib/utils"

interface User {
  id: number
  name: string
  career: string
  university: string
  cycle: number
  interests: string[]
  matchPercentage: number
  distance: number
}

const sampleUsers: User[] = [
  {
    id: 1,
    name: "Ana García",
    career: "Informática",
    university: "UPC",
    cycle: 5,
    interests: ["Inteligencia Artificial", "Desarrollo Web", "Videojuegos"],
    matchPercentage: 95,
    distance: 0.4
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    career: "Medicina",
    university: "UNMSM",
    cycle: 7,
    interests: ["Neurología", "Investigación Médica", "Salud Pública"],
    matchPercentage: 85,
    distance: 0.6
  },
  {
    id: 3,
    name: "Lucía Mendoza",
    career: "Derecho",
    university: "PUCP",
    cycle: 6,
    interests: ["Derecho Internacional", "Derechos Humanos", "Política"],
    matchPercentage: 78,
    distance: 0.8
  },
  {
    id: 4,
    name: "Diego Torres",
    career: "Arquitectura",
    university: "UNI",
    cycle: 8,
    interests: ["Diseño Sostenible", "Urbanismo", "Tecnología BIM"],
    matchPercentage: 92,
    distance: 0.5
  },
  {
    id: 5,
    name: "María Paz",
    career: "Psicología",
    university: "PUCP",
    cycle: 4,
    interests: ["Psicología Clínica", "Neurociencia", "Terapia"],
    matchPercentage: 88,
    distance: 0.7
  },
  {
    id: 6,
    name: "Juan Silva",
    career: "Economía",
    university: "UP",
    cycle: 7,
    interests: ["Finanzas", "Análisis de Datos", "Mercados"],
    matchPercentage: 82,
    distance: 0.6
  },
  {
    id: 7,
    name: "Valeria Ruiz",
    career: "Biología",
    university: "UNMSM",
    cycle: 5,
    interests: ["Genética", "Biotecnología", "Investigación"],
    matchPercentage: 90,
    distance: 0.4
  },
  {
    id: 8,
    name: "Roberto Chang",
    career: "Ingeniería Civil",
    university: "UNI",
    cycle: 9,
    interests: ["Estructuras", "Gestión de Proyectos", "Construcción"],
    matchPercentage: 86,
    distance: 0.7
  },
  {
    id: 9,
    name: "Carmen Díaz",
    career: "Comunicaciones",
    university: "ULima",
    cycle: 6,
    interests: ["Marketing Digital", "Redes Sociales", "Audiovisual"],
    matchPercentage: 84,
    distance: 0.5
  },
  {
    id: 10,
    name: "Felipe Ortiz",
    career: "Diseño Gráfico",
    university: "PUCP",
    cycle: 7,
    interests: ["UI/UX", "Branding", "Motion Graphics"],
    matchPercentage: 89,
    distance: 0.6
  }
]

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

function MobileUserCard({ user, onClick }: { user: User; onClick: () => void }) {
  return (
    <Card 
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
            <Image
              src="/placeholder-user.png"
              alt={user.name}
              layout="fill"
              objectFit="cover"
              className="bg-background"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold truncate">{user.name}</h3>
              <span className={cn(
                "text-sm font-bold",
                user.matchPercentage >= 90 ? "text-green-500" :
                user.matchPercentage >= 70 ? "text-yellow-500" :
                "text-red-500"
              )}>{user.matchPercentage}%</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <School className="w-3 h-3" />
              <span className="truncate">{user.university}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <BookOpen className="w-3 h-3" />
              <span>Ciclo {romanNumerals[user.cycle - 1]}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RadarNode({ user, angle, onClick }: { user: User; angle: number; onClick: () => void }) {
  const x = Math.cos(angle) * (user.distance * 40)
  const y = Math.sin(angle) * (user.distance * 40)

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      style={{
        position: 'absolute',
        left: `${50 + x}%`,
        top: `${50 + y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10
      }}
      className="cursor-pointer hover:cursor-pointer"
      onClick={onClick}
    >
      <div className="relative group">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-primary shadow-glow transition-all duration-300 group-hover:shadow-glow-hover">
          <Image
            src="/placeholder-user.png"
            alt={user.name}
            layout="fill"
            objectFit="cover"
            className="bg-background"
          />
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
        </div>
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shadow-md">
          {user.matchPercentage}%
        </div>
      </div>
    </motion.div>
  )
}

function RadarCircle({ radius }: { radius: number }) {
  return (
    <div
      className="absolute border border-primary/20 dark:border-primary/40 rounded-full transition-colors dark:shadow-[0_0_10px_rgba(147,51,234,0.2)]"
      style={{
        width: `${radius * 2}%`,
        height: `${radius * 2}%`,
        left: `${50 - radius}%`,
        top: `${50 - radius}%`,
      }}
    />
  )
}

function UserProfile({ user, open, onClose }: { user: User | null; open: boolean; onClose: () => void }) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-6 overflow-hidden">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
            <Image
              src="/placeholder-user.png"
              alt={user.name}
              layout="fill"
              objectFit="cover"
              className="bg-background"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.career}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm">
            <School className="w-4 h-4 text-primary" />
            <span>{user.university}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Ciclo {romanNumerals[user.cycle - 1]}</span>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Intereses</h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, index) => (
              <Badge key={index} variant="secondary" className="rounded-full text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className={cn(
            "text-2xl font-bold",
            user.matchPercentage >= 90 ? "text-green-500" :
            user.matchPercentage >= 70 ? "text-yellow-500" :
            "text-red-500"
          )}>
            {user.matchPercentage}% <span className="text-sm font-normal text-muted-foreground">Match</span>
          </div>
          <Button size="sm" className="rounded-full">
            Ver perfil <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function MatchmakingPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [displayedUsers, setDisplayedUsers] = useState(sampleUsers)

  const refreshUsers = () => {
    const shuffled = [...sampleUsers].sort(() => Math.random() - 0.5)
    setDisplayedUsers(shuffled)
  }

  return (
    <PageContainer>
      <div className="flex flex-col space-y-6 w-full max-w-[1200px] mx-auto px-4">
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              Radar de Talento
            </h1>
            <p className="text-sm text-muted-foreground">
              Encuentra conexiones académicas cercanas
            </p>
          </div>
          <Button onClick={refreshUsers} variant="outline" size="sm" className="rounded-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {displayedUsers.map((user) => (
            <MobileUserCard
              key={user.id}
              user={user}
              onClick={() => setSelectedUser(user)}
            />
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="aspect-square max-w-[min(800px,80vh)] mx-auto bg-background rounded-full border border-primary/20 overflow-hidden shadow-2xl relative"
          >
            {[20, 40, 60, 80].map((radius) => (
              <RadarCircle key={radius} radius={radius} />
            ))}
            <div className="absolute inset-0">
              {displayedUsers.slice(0, 7).map((user, index) => (
                <RadarNode
                  key={user.id}
                  user={user}
                  angle={(2 * Math.PI * index) / Math.min(displayedUsers.length, 7)}
                  onClick={() => setSelectedUser(user)}
                />
              ))}
            </div>
            <div className="absolute inset-0 pointer-events-none">
              <div className="radar-wave" />
            </div>
          </motion.div>
        </div>

        <UserProfile 
          user={selectedUser} 
          open={!!selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      </div>
    </PageContainer>
  )
}

