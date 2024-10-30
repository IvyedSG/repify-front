"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Target
} from 'lucide-react';

type Achievement = {
  id: string;
  title: string;
  description: string;
  unlockCondition: string;
  icon: React.ReactNode;
  unlocked: boolean;
};

export default function LogrosPage() {
  const [userMetrics] = useState({
    projectsInProgress: 2,
    achievementsUnlocked: 15,
    projectsCompleted: 5,
    projectsAsMember: 7,
    projectsAsLeader: 3,
  });

  const [achievements] = useState<Achievement[]>([
    { 
      id: '1', 
      title: 'Manos a la Obra', 
      description: 'Completar tu primer proyecto.',
      unlockCondition: '1 proyecto completado.',
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      unlocked: true
    },
    { 
      id: '2', 
      title: 'Incansable Constructor', 
      description: 'Tener al menos 2 proyectos en curso simultáneamente.',
      unlockCondition: 'Cuando el estudiante tiene 2 proyectos en progreso.',
      icon: <Wrench className="h-8 w-8 text-blue-500" />,
      unlocked: true
    },
    { 
      id: '3', 
      title: 'Siempre al Liderazgo', 
      description: 'Completar 5 proyectos.',
      unlockCondition: 'Al llegar a 5 proyectos terminados.',
      icon: <Target className="h-8 w-8 text-purple-500" />,
      unlocked: true
    },
    { 
      id: '4', 
      title: 'Compromiso sin Fronteras', 
      description: 'Participar en proyectos con 3 universidades distintas.',
      unlockCondition: 'Al colaborar con 3 universidades diferentes.',
      icon: <Globe className="h-8 w-8 text-amber-500" />,
      unlocked: false
    },
    { 
      id: '5', 
      title: 'Multitasker', 
      description: 'Participar en 3 proyectos simultáneamente.',
      unlockCondition: 'Tener 3 proyectos activos a la vez.',
      icon: <Briefcase className="h-8 w-8 text-indigo-500" />,
      unlocked: false
    },
    { 
      id: '6', 
      title: 'Colaborador Compulsivo', 
      description: 'Participar en al menos 10 proyectos, en cualquier rol.',
      unlockCondition: 'Al alcanzar 10 participaciones.',
      icon: <Users className="h-8 w-8 text-pink-500" />,
      unlocked: false
    },
    { 
      id: '7', 
      title: 'Maestro de Roles', 
      description: 'Ser tanto miembro como líder en diferentes proyectos.',
      unlockCondition: 'Al cumplir ambos roles al menos una vez.',
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      unlocked: true
    },
    { 
      id: '8', 
      title: 'Líder Experto', 
      description: 'Completar 5 proyectos como líder.',
      unlockCondition: 'Liderar y terminar 5 proyectos.',
      icon: <GraduationCap className="h-8 w-8 text-red-500" />,
      unlocked: false
    },
    { 
      id: '9', 
      title: 'Desarrollador Incansable', 
      description: 'Completar 3 proyectos de Desarrollo de Software.',
      unlockCondition: 'Al terminar 3 proyectos en esa categoría.',
      icon: <Code className="h-8 w-8 text-cyan-500" />,
      unlocked: false
    },
    { 
      id: '10', 
      title: 'Investigador Académico', 
      description: 'Completar 2 proyectos de Investigación Académica.',
      unlockCondition: 'Al cumplir con 2 proyectos de este tipo.',
      icon: <Microscope className="h-8 w-8 text-emerald-500" />,
      unlocked: false
    },
    { 
      id: '11', 
      title: 'Creador Ecológico', 
      description: 'Participar en 3 proyectos Ambientales.',
      unlockCondition: 'Al colaborar en proyectos de impacto ecológico.',
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      unlocked: false
    },
    { 
      id: '12', 
      title: 'Analista de Datos', 
      description: 'Completar 2 proyectos de Análisis de Datos.',
      unlockCondition: 'Al finalizar proyectos de este tipo.',
      icon: <Database className="h-8 w-8 text-blue-600" />,
      unlocked: false
    },
    { 
      id: '13', 
      title: 'Planificador Estratégico', 
      description: 'Finalizar un proyecto de Planificación y Gestión.',
      unlockCondition: 'Al completar un proyecto de este tipo.',
      icon: <PieChart className="h-8 w-8 text-purple-600" />,
      unlocked: false
    },
    { 
      id: '14', 
      title: 'Innovador del Futuro', 
      description: 'Participar en 2 proyectos de Innovación o Emprendimiento.',
      unlockCondition: 'Al colaborar en 2 proyectos con estos enfoques.',
      icon: <Lightbulb className="h-8 w-8 text-orange-500" />,
      unlocked: false
    },
  ]);

  return (
    <div className="container mx-auto p-4 space-y-8 mb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Logros y Métricas Académicas</h1>
          <p className="text-xl text-muted-foreground mt-2">Seguimiento de tu progreso académico y celebración de tus éxitos</p>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder-user.png" alt="Estudiante" />
            <AvatarFallback>ES</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-2xl font-semibold">Estudiante</p>
            <Badge variant="secondary" className="text-lg mt-1">
              Nivel: Intermedio
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Proyectos en Progreso"
          value={userMetrics.projectsInProgress}
          description="Proyectos actualmente en curso"
          icon={<Briefcase className="h-6 w-6" />}
        />
        <MetricCard
          title="Logros Desbloqueados"
          value={userMetrics.achievementsUnlocked}
          description={`De un total de ${achievements.length} logros`}
          icon={<Award className="h-6 w-6" />}
        />
        <MetricCard
          title="Proyectos Finalizados"
          value={userMetrics.projectsCompleted}
          description="Proyectos completados con éxito"
          icon={<CheckCircle className="h-6 w-6" />}
        />
        <MetricCard
          title="Proyectos como Miembro"
          value={userMetrics.projectsAsMember}
          description="Participaciones como miembro de equipo"
          icon={<Users className="h-6 w-6" />}
        />
        <MetricCard
          title="Proyectos como Líder"
          value={userMetrics.projectsAsLeader}
          description="Proyectos liderados"
          icon={<GraduationCap className="h-6 w-6" />}
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="unlocked" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {achievements.filter(a => a.unlocked).map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="locked" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {achievements.filter(a => !a.unlocked).map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="progress" className="mt-6">
          <div className="space-y-6">
            <ProgressCard
              title="Proyectos Completados"
              current={userMetrics.projectsCompleted}
              target={10}
              description="Completa 10 proyectos para alcanzar el siguiente nivel"
            />
            <ProgressCard
              title="Proyectos Liderados"
              current={userMetrics.projectsAsLeader}
              target={5}
              description="Lidera 5 proyectos para desbloquear el logro 'Líder Experto'"
            />
            <ProgressCard
              title="Logros Desbloqueados"
              current={userMetrics.achievementsUnlocked}
              target={achievements.length}
              description="Desbloquea todos los logros para convertirte en un Maestro Académico"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ title, value, description, icon }: { title: string; value: number; description: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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

function AchievementCard({ achievement }: { achievement: Achievement }) {
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

function ProgressCard({ title, current, target, description }: { title: string; current: number; target: number; description: string }) {
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