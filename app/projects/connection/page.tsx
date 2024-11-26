'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { School, BookOpen, ExternalLink } from 'lucide-react'
import PageContainer from '@/components/layout/page-container'
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface User {
  user_id: number
  user_name: string
  photo: string
  similarity: number
  interests: string[]
  career: string
  cycle: string
  university: string
}

function UserImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      layout="fill"
      objectFit="cover"
      className={cn("bg-background", className)}
      onError={() => setImgSrc("/placeholder-user.png")}
    />
  )
}

function MobileUserCard({ user, onClick }: { user: User; onClick: () => void }) {
  return (
    <Card 
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
            <UserImage src={user.photo || "/placeholder-user.png"} alt={user.user_name} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold truncate">{user.user_name}</h3>
              <span className={cn(
                "text-sm font-bold",
                user.similarity >= 0.9 ? "text-green-500" :
                user.similarity >= 0.7 ? "text-yellow-500" :
                "text-red-500"
              )}>{Math.round(user.similarity * 100)}%</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <School className="w-3 h-3" />
              <span className="truncate">{user.university}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <BookOpen className="w-3 h-3" />
              <span>Ciclo {user.cycle}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RadarNode({ user, angle, onClick }: { user: User; angle: number; onClick: () => void }) {
  const x = Math.cos(angle) * (40 - user.similarity * 40)
  const y = Math.sin(angle) * (40 - user.similarity * 40)

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
          <UserImage src={user.photo || "/placeholder-user.png"} alt={user.user_name} />
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
        </div>
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shadow-md">
          {Math.round(user.similarity * 100)}%
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
            <UserImage src={user.photo || "/placeholder-user.png"} alt={user.user_name} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{user.user_name}</h2>
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
            <span>Ciclo {user.cycle}</span>
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
            user.similarity >= 0.9 ? "text-green-500" :
            user.similarity >= 0.7 ? "text-yellow-500" :
            "text-red-500"
          )}>
            {Math.round(user.similarity * 100)}% <span className="text-sm font-normal text-muted-foreground">Match</span>
          </div>
          <Button size="sm" className="rounded-full" asChild>
            <Link href={`/projects/profiles/${user.user_id}`}>
              Ver perfil <ExternalLink className="w-3 h-3 ml-2" />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function MatchmakingPage() {
  const { data: session } = useSession()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.user.accessToken) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/similitudes/similitudes_user/similitud_user/`, {
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await response.json()
        setUsers(data.data)
      } catch (err) {
        setError('Failed to load users. Please try again.')
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [session])

  return (
    <PageContainer>
      <div className="flex flex-col space-y-6 w-full max-w-[1200px] mx-auto px-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
            Radar de Talento
          </h1>
          <p className="text-sm text-muted-foreground">
            Encuentra conexiones académicas con tus mismos intereses, podrían formar un gran equipo!
          </p>
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {users.map((user) => (
                <MobileUserCard
                  key={user.user_id}
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
                  {users.map((user, index) => (
                    <RadarNode
                      key={user.user_id}
                      user={user}
                      angle={(2 * Math.PI * index) / users.length}
                      onClick={() => setSelectedUser(user)}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 pointer-events-none">
                  <div className="radar-wave" />
                </div>
              </motion.div>
            </div>
          </>
        )}

        <UserProfile 
          user={selectedUser} 
          open={!!selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      </div>
    </PageContainer>
  )
}