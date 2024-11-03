'use client'

import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, GraduationCap, Trophy } from 'lucide-react'
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

const fetchOtherProfile = async (url: string, token: string, userId: string) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ user_id: parseInt(userId) })
  })
  if (!res.ok) throw new Error('Failed to fetch profile')
  return res.json()
}

const ProfileSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse" />
        <div className="space-y-2 w-full">
          <div className="h-8 w-3/4 bg-gray-200 animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 animate-pulse" />
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 bg-gray-200 animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 animate-pulse" />
            <div className="h-6 w-16 bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-1/4 bg-gray-200 animate-pulse" />
            <div className="h-10 w-full bg-gray-200 animate-pulse" />
          </div>
        ))}
        <div className="space-y-2 md:col-span-2">
          <div  className="h-4 w-1/4 bg-gray-200 animate-pulse" />
          <div className="h-24 w-full bg-gray-200 animate-pulse" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function OtherUserProfilePage() {
  const { data: session } = useSession()
  const params = useParams()
  const profileId = params.profileId as string

  const { data: profile, error } = useSWR<UserProfile>(
    session?.user?.accessToken && profileId
      ? [
          `${process.env.NEXT_PUBLIC_API_URL}/usuario/perfil/profile_id/`,
          String(session.user.accessToken),
          String(profileId)
        ]
      : null,
    ([url, token, userId]) => fetchOtherProfile(url, token as string, userId as string), 
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  )
  

  if (error) return <div>Error loading profile. Please try again later.</div>
  if (!profile) return <ProfileSkeleton />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6 mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Perfil de {profile.first_name} {profile.last_name}</h2>

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
                <p className="font-semibold">Universidad</p>
                <p>{profile.university}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Carrera</p>
                <p>{profile.career}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Ciclo</p>
                <p>{profile.cycle}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Correo Electrónico</p>
                <p>{profile.email}</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <p className="font-semibold">Biografía</p>
                <p>{profile.biography}</p>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Experiencias Académicas</h4>
              <p>{profile.achievements}</p>
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
          <Link href={`/projects/records/${profileId}`}>
            <Button>
              <Trophy className="mr-2 h-4 w-4" />
              Ver logros de {profile.first_name}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}