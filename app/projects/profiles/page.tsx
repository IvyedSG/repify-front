"use client"

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import useSWR from 'swr'
import PageContainer from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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

const fetchProfile = async (url: string, token: string) => {
  const res = await fetch(url, {
    method: 'POST',
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
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="w-full space-y-2">
          <Skeleton className="w-3/4 h-8" />
          <Skeleton className="w-1/2 h-4" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="w-20 h-6" />
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-16 h-6" />
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="w-1/4 h-4" />
            <Skeleton className="w-full h-10" />
          </div>
        ))}
        <div className="space-y-2 md:col-span-2">
          <Skeleton className="w-1/4 h-4" />
          <Skeleton className="w-full h-24" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const { data: session, status } = useSession()

  console.log('Session data:', session);

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut(); 
    }
  }, [session]);

  if (!session) {
    return <div>Loading...</div>;
  }

  const { data: profile, error, mutate } = useSWR<UserProfile, Error>(
    session?.user?.accessToken
      ? [`${process.env.NEXT_PUBLIC_API_URL}/usuario/perfil/profile/`, session.user.accessToken] as [string, string]
      : null,
    ([url, token]: [string, string]) => fetchProfile(url, token),
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  )

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (profile) {
      mutate({ ...profile, [e.target.name]: e.target.value }, false)
    }
  }

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      mutate({ ...profile, interests: e.target.value.split(',').map(item => item.trim()) }, false)
    }
  }

  const handleSave = async () => {
    if (!profile || !session?.user?.accessToken || !session?.user?.id) {
      console.error('Missing required data for profile update');
      toast({
        title: 'Error',
        description: 'Unable to update profile due to missing data. Please try logging in again.',
        variant: 'destructive',
      });
      return;
    }

    const profileData = {
      id: parseInt(session.user.id),
      authuser: parseInt(session.user.id),
      university: profile.university,
      career: profile.career,
      cycle: profile.cycle,
      biography: profile.biography,
      interests: profile.interests,
      photo: profile.photo,
      achievements: profile.achievements
    }

    console.log('Profile data being sent:', profileData);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/perfil/update-profile/`, {
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
      
      await mutate(updatedProfile, false)
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
      <div className="mb-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
          <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
          <Button onClick={() => (isEditing ? handleSave() : setIsEditing(true))} className="ml-auto">
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" /> Guardar Cambios
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-2" /> Editar Perfil
              </>
            )}
          </Button>
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <Label htmlFor="photo">URL de la foto</Label>
                <Input
                  id="photo"
                  name="photo"
                  value={profile.photo}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  placeholder="https://ejemplo.com/mi-foto.jpg"
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
              <h4 className="mb-2 font-semibold">Experiencias Académicas</h4>
              <Textarea
                id="achievements"
                name="achievements"
                value={profile.achievements}
                onChange={handleProfileChange}
                disabled={!isEditing}
              />
            </div>
            <Separator />
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Perfil de usuario</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{profile.cycle} Ciclo</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-center mt-6">
          <Link href={`/projects/records/${session?.user?.id || ''}`}>
            <Button>
              <Trophy className="w-4 h-4 mr-2" />
              Ver mis logros
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  )  
}