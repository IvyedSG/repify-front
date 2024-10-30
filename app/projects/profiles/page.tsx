"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import useSWR from 'swr'
import PageContainer from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { Edit2, Save, User, GraduationCap, Trophy } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

interface UserProfile {
  id?: number
  university: string
  career: string
  cycle: string
  biography: string
  interests: string[]
  photo: string
  achievements: string
  created_at: string
  email: string
  first_name: string
  last_name: string
  date_joined: string
}

const fetchOwnProfile = async (url: string, token: string) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  if (!res.ok) throw new Error('Failed to fetch own profile')
  return res.json()
}

const fetchOtherProfile = async (url: string, token: string) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  if (!res.ok) throw new Error('Failed to fetch profile')
  return res.json()
}

const ProfileSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <div className="space-y-2 md:col-span-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [profileUserId, setProfileUserId] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      setProfileUserId(params.id as string)
    } else if (session?.user?.id) {
      setProfileUserId(session.user.id)
    }
  }, [params.id, session])

  const isOwnProfile = !params.id

  const { data: profile, error, mutate } = useSWR<UserProfile>(
    session?.user?.accessToken && profileUserId
      ? isOwnProfile
        ? ['http://127.0.0.1:8000/usuario/perfil/profile/', session.user.accessToken]
        : [`http://127.0.0.1:8000/usuario/perfil/profile/${profileUserId}`, session.user.accessToken]
      : null,
    ([url, token]) => isOwnProfile ? fetchOwnProfile(url, token) : fetchOtherProfile(url, token),
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  )

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (profile && isOwnProfile) {
      mutate({ ...profile, [e.target.name]: e.target.value }, false)
    }
  }

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profile && isOwnProfile) {
      mutate({ ...profile, interests: e.target.value.split(',').map(item => item.trim()) }, false)
    }
  }

  const handleSave = async () => {
    if (!profile || !session?.user?.accessToken || !isOwnProfile) return

    const profileData = {
      id: session.user.id,
      university: profile.university,
      career: profile.career,
      cycle: profile.cycle,
      biography: profile.biography,
      interests: profile.interests,
      photo: profile.photo,
      achievements: profile.achievements,
      authuser: session.user.id,
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/usuario/perfil/update-profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to update profile')
      }

      const updatedProfile = await response.json()
      
      // Ensure all required fields are present in the updated profile
      const safeUpdatedProfile = {
        ...profile, // Keep existing data
        ...updatedProfile, // Overwrite with new data
        first_name: updatedProfile.first_name || profile.first_name,
        last_name: updatedProfile.last_name || profile.last_name,
        interests: Array.isArray(updatedProfile.interests) ? updatedProfile.interests : profile.interests,
      }

      await mutate(safeUpdatedProfile, false)
      setIsEditing(false)
      toast({
        title: 'Perfil Actualizado',
        description: 'Tu perfil ha sido actualizado exitosamente.',
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (error) {
    return <div>Error loading profile. Please try again later.</div>
  }

  if (!profile) {
    return <ProfileSkeleton />
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-6 mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight">
            {isOwnProfile ? 'Mi Perfil' : `Perfil de ${profile.first_name} ${profile.last_name}`}
          </h2>
          {isOwnProfile && (
            <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                </>
              ) : (
                <>
                  <Edit2 className="mr-2 h-4 w-4" /> Editar Perfil
                </>
              )}
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.photo || "/placeholder-user.png"} alt={`${profile.first_name} ${profile.last_name}`} />
                <AvatarFallback>{profile.first_name?.[0] || ''}{profile.last_name?.[0] || ''}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-2xl font-semibold">{profile.first_name} {profile.last_name}</h3>
                <p className="text-sm text-muted-foreground">{profile.career} - {profile.cycle} Ciclo</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">{interest}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="university">Universidad</Label>
                <Input
                  id="university"
                  name="university"
                  value={profile.university}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="career">Carrera</Label>
                <Input
                  id="career"
                  name="career"
                  value={profile.career}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cycle">Ciclo</Label>
                <Input
                  id="cycle"
                  name="cycle"
                  value={profile.cycle}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  value={profile.email}
                  disabled={true}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="biography">Biografía</Label>
                <Textarea
                  id="biography"
                  name="biography"
                  value={profile.biography}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="interests">Intereses (separados por comas)</Label>
                <Input
                  id="interests"
                  name="interests"
                  value={profile.interests.join(', ')}
                  onChange={handleInterestsChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Logros</h4>
              <Textarea
                id="achievements"
                name="achievements"
                value={profile.achievements}
                onChange={handleProfileChange}
                disabled={!isEditing}
              />
            </div>
            <Separator />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Miembro desde {new Date(profile.date_joined).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{profile.cycle} Ciclo</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-center mt-6">
          <Link href={`/projects/records/${profileUserId || ''}`}>
            <Button>
              <Trophy className="mr-2 h-4 w-4" />
              Ver logros de {profile.first_name}
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}
