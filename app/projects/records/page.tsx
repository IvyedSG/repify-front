"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Briefcase, 
  CheckCircle, 
  Users, 
  GraduationCap,
  Award,
  Wrench,
  Globe,
  Code,
  Microscope,
  Leaf,
  Database,
  PieChart,
  Lightbulb,
  Target,
  Flag
} from 'lucide-react'

type Achievement = {
  id: string
  title: string
  description: string
  unlockCondition: string
  icon: React.ReactNode
  unlocked: boolean
}

type AchievementCardProps = {
  achievement: Achievement;
};

type Metrics = {
  proyectos_en_progreso: number
  logros_desbloqueados: number
  proyectos_finalizados: number
  proyectos_en_los_que_eres_miembro: number
  proyectos_como_líder: number
}

type MetricCardProps = {
  title: string;
  value: number; // Asumiendo que el valor es un número
  description: string;
  icon: React.ReactNode; // Para permitir que se pase un componente de icono
};

type ProgressCardProps = {
  title: string;
  current: number; // Asumiendo que este es un número
  target: number;  // Asumiendo que este es un número
  description: string;
};

type UserData = {
  user: number
  first_name: string
  last_name: string
  achievements: {
    achievement: number
    unlocked: boolean
    name: string
    description: string
  }[]
}

const staticAchievements: Achievement[] = [
  { 
    id: '1', 
    title: 'Primera Gran Misión', 
    description: 'Completar tu primer proyecto.',
    unlockCondition: '1 proyecto completado.',
    icon: <Flag className="w-8 h-8 text-green-500" />,
    unlocked: false
  },
  { 
    id: '2', 
    title: 'Manos a la Obra', 
    description: 'Tener al menos 2 proyectos en curso simultáneamente.',
    unlockCondition: 'Cuando el estudiante tiene 2 proyectos en progreso.',
    icon: <Wrench className="w-8 h-8 text-blue-500" />,
    unlocked: false
  },
  { 
    id: '3', 
    title: 'Incansable Constructor', 
    description: 'Completar 5 proyectos.',
    unlockCondition: 'Al llegar a 5 proyectos terminados.',
    icon: <Briefcase className="w-8 h-8 text-purple-500" />,
    unlocked: false
  },
  { 
    id: '4', 
    title: 'Siempre al Liderazgo', 
    description: 'Ser líder de al menos 3 proyectos.',
    unlockCondition: 'Liderar 3 proyectos.',
    icon: <Target className="w-8 h-8 text-amber-500" />,
    unlocked: false
  },
  { 
    id: '5', 
    title: 'Compromiso sin Fronteras', 
    description: 'Participar en proyectos con 3 universidades distintas.',
    unlockCondition: 'Al colaborar con 3 universidades diferentes.',
    icon: <Globe className="w-8 h-8 text-indigo-500" />,
    unlocked: false
  },
  { 
    id: '6', 
    title: 'Multitasker', 
    description: 'Participar en 3 proyectos simultáneamente.',
    unlockCondition: 'Tener 3 proyectos activos a la vez.',
    icon: <Briefcase className="w-8 h-8 text-pink-500" />,
    unlocked: false
  },
  { 
    id: '7', 
    title: 'Colaborador Compulsivo', 
    description: 'Participar en al menos 10 proyectos, en cualquier rol.',
    unlockCondition: 'Al alcanzar 10 participaciones.',
    icon: <Users className="w-8 h-8 text-yellow-500" />,
    unlocked: false
  },
  { 
    id: '8', 
    title: 'Maestro de Roles', 
    description: 'Ser tanto miembro como líder en diferentes proyectos.',
    unlockCondition: 'Al cumplir ambos roles al menos una vez.',
    icon: <Award className="w-8 h-8 text-red-500" />,
    unlocked: false
  },
  { 
    id: '9', 
    title: 'Líder Experto', 
    description: 'Completar 5 proyectos como líder.',
    unlockCondition: 'Liderar y terminar 5 proyectos.',
    icon: <GraduationCap className="w-8 h-8 text-cyan-500" />,
    unlocked: false
  },
  { 
    id: '10', 
    title: 'Desarrollador Incansable', 
    description: 'Completar 3 proyectos de Desarrollo de Software.',
    unlockCondition: 'Al terminar 3 proyectos en esa categoría.',
    icon: <Code className="w-8 h-8 text-emerald-500" />,
    unlocked: false
  },
  { 
    id: '11', 
    title: 'Investigador Académico', 
    description: 'Completar 2 proyectos de Investigación Académica.',
    unlockCondition: 'Al cumplir con 2 proyectos de este tipo.',
    icon: <Microscope className="w-8 h-8 text-green-600" />,
    unlocked: false
  },
  { 
    id: '12', 
    title: 'Creador Ecológico', 
    description: 'Participar en 3 proyectos Ambientales.',
    unlockCondition: 'Al colaborar en proyectos de impacto ecológico.',
    icon: <Leaf className="w-8 h-8 text-blue-600" />,
    unlocked: false
  },
  { 
    id: '13', 
    title: 'Analista de Datos', 
    description: 'Completar 2 proyectos de Análisis de Datos.',
    unlockCondition: 'Al finalizar proyectos de este tipo.',
    icon: <Database className="w-8 h-8 text-purple-600" />,
    unlocked: false
  },
  { 
    id: '14', 
    title: 'Planificador Estratégico', 
    description: 'Finalizar un proyecto de Planificación y Gestión.',
    unlockCondition: 'Al completar un proyecto de este tipo.',
    icon: <PieChart className="w-8 h-8 text-orange-500" />,
    unlocked: false
  },
  { 
    id: '15', 
    title: 'Innovador del Futuro', 
    description: 'Participar en 2 proyectos de Innovación o Emprendimiento.',
    unlockCondition: 'Al colaborar en 2 proyectos con estos enfoques.',
    icon: <Lightbulb className="w-8 h-8 text-yellow-600" />,
    unlocked: false
  },
]

export default function LogrosPage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>(staticAchievements);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.accessToken) {
        try {
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.user.accessToken}`,
          };

          const [achievementsResponse, metricsResponse] = await Promise.all([
            fetch(`${process.env.NEXT_SECRET_API_URL}/usuario/achievement/list_user_achievements/`, { headers }),
            fetch(`${process.env.NEXT_SECRET_API_URL}/usuario/metrics/metrics/`, { headers }),
          ]);

          if (!achievementsResponse.ok || !metricsResponse.ok) {
            throw new Error('Failed to fetch data');
          }

          const achievementsData: UserData = await achievementsResponse.json();
          const metricsData: Metrics = await metricsResponse.json();

          setUserData(achievementsData);
          setMetrics(metricsData);

          const updatedAchievements = staticAchievements.map((achievement) => {
            const backendAchievement = achievementsData.achievements.find(a => a.name === achievement.title);
            return backendAchievement ? { ...achievement, unlocked: backendAchievement.unlocked } : achievement;
          });
          setAchievements(updatedAchievements);

          await validateAchievements(session.user.accessToken);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [session]);

  const validateAchievements = async (accessToken: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_SECRET_API_URL}/usuario/achievement/validate_achievements/`, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to validate achievements');
      }
    } catch (error) {
      console.error('Error validating achievements:', error);
    }
  };

  if (loading) {
    return <SkeletonLoader />
  }

  return (
    <div className="container p-4 mx-auto mb-10 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-2xl lg:text-3xl xl:text-4xl">
            Logros y Métricas Académicas
          </h1>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg md:text-xl">
            Seguimiento de tu progreso académico y celebración de tus éxitos
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-4 sm:text-left">
          <Avatar className="w-12 h-12 mx-auto sm:w-16 sm:h-16 md:w-14 md:h-14 lg:w-20 lg:h-20 sm:mx-0">
            <AvatarImage src={session?.user.photo || "/placeholder-user.png"} alt={userData ? `${userData.first_name} ${userData.last_name}` : 'User'} />
            <AvatarFallback>{userData ? `${userData.first_name[0]}${userData.last_name[0]}` : 'U'}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold sm:text-xl md:text-lg lg:text-xl">
              {userData ? `${userData.first_name} ${userData.last_name}` : 'Usuario'}
            </p>
            <Badge variant="secondary" className="mt-1 text-xs sm:text-sm md:text-xs lg:text-sm">
              Nivel: {metrics && metrics.logros_desbloqueados > 10 ? 'Avanzado' : metrics && metrics.logros_desbloqueados > 5 ? 'Intermedio' : 'Principiante'}
            </Badge>
          </div>
        </div>
      </div>
  
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Proyectos en Progreso"
          value={metrics?.proyectos_en_progreso || 0}
          description="Proyectos actualmente en curso"
          icon={<Briefcase className="w-6 h-6" />}
        />
        <MetricCard
          title="Logros Desbloqueados"
          value={metrics?.logros_desbloqueados || 0}
          description={`De un total de ${achievements.length} logros`}
          icon={<Award className="w-6 h-6" />}
        />
        <MetricCard
          title="Proyectos Finalizados"
          value={metrics?.proyectos_finalizados || 0}
          description="Proyectos completados con éxito"
          icon={<CheckCircle className="w-6 h-6" />}
        />
        <MetricCard
          title="Proyectos como Miembro"
          value={metrics?.proyectos_en_los_que_eres_miembro || 0}
          description="Participaciones como miembro de equipo"
          icon={<Users className="w-6 h-6" />}
        />
        <MetricCard
          title="Proyectos como Líder"
          value={metrics?.proyectos_como_líder || 0}
          description="Proyectos liderados"
          icon={<GraduationCap className="w-6 h-6" />}
        />
      </div>
  
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="all">Todos los Logros</TabsTrigger>
          <TabsTrigger value="unlocked">Desbloqueados</TabsTrigger>
          <TabsTrigger value="locked">Por Desbloquear</TabsTrigger>
          <TabsTrigger value="progress">Progreso</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="unlocked" className="mt-6">
  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {achievements.filter(a => a.unlocked).length > 0 ? (
      achievements.filter(a => a.unlocked).map((achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))
    ) : (
      <div className="col-span-full text-center p-8">
        <Card>
          <CardHeader>
            <CardTitle>Aún no has desbloqueado ningún logro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              ¡Sigue participando en proyectos y completando tareas para desbloquear logros!
            </p>
          </CardContent>
        </Card>
      </div>
    )}
  </div>
</TabsContent>
        <TabsContent value="locked" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {achievements.filter(a => !a.unlocked).map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            
            ))}
          </div>
        </TabsContent>
        <TabsContent value="progress" className="mt-6">
          <div className="space-y-6">
            <ProgressCard
              title="Proyectos Completados"
              current={metrics?.proyectos_finalizados || 0}
              target={10}
              description="Completa 10 proyectos para alcanzar el siguiente nivel"
            />
            <ProgressCard
              title="Proyectos Liderados"
              current={metrics?.proyectos_como_líder || 0}
              target={5}
              description="Lidera 5 proyectos para desbloquear el logro 'Líder Experto'"
            />
            <ProgressCard
              title="Logros Desbloqueados"
              current={metrics?.logros_desbloqueados || 0}
              target={achievements.length}
              description="Desbloquea todos los logros para convertirte en un Maestro Académico"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ title, value, description, icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <Card className={achievement.unlocked ? 'bg-secondary' : 'opacity-75'}>
      <CardHeader className="flex flex-row items-center gap-4">
        {achievement.icon}
        <div>
          <CardTitle className="text-lg">{achievement.title}</CardTitle>
          <CardDescription>{achievement.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{achievement.unlockCondition}</p>
        <Badge variant={achievement.unlocked ? "default" : "outline"} className="mt-2">
          {achievement.unlocked ? 'Desbloqueado' : 'Bloqueado'}
        </Badge>
      </CardContent>
    </Card>
  );
}

function ProgressCard({ title, current, target, description }: ProgressCardProps) {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Progress value={percentage} className="w-full" />
          <span className="text-sm font-medium">{`${current}/${target}`}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonLoader() {
  return (
    <div className="container p-4 mx-auto mb-10 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="w-6 h-6 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Skeleton className="h-10 w-full mb-6" />

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-6 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}