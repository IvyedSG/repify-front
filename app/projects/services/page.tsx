'use client'

import { useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, GraduationCap, Users, ArrowRight, Star, Clock, Trophy, Target, Zap, BookOpen, Code, Palette, Rocket, Brain, Award, Gift, DollarSign, Lightbulb, Sparkles } from 'lucide-react'
import PageContainer from '@/components/layout/page-container'

type IconWrapperProps = {
    children: React.ReactNode;
    color: string;
  };
  
const IconWrapper: React.FC<IconWrapperProps> = ({ children, color }) => (
    <div className={`p-2 rounded-full ${color} text-white`}>
      {children}
    </div>
  );

interface ServiceStats {
  rating: number;
  students: number;
  hours: number;
}

interface ServiceItem {
  title: string;
  description: string;
  longDescription: string;
  details: string[];
  icon: ReactNode;
  color: string;
  badge?: string;
  stats?: ServiceStats;
  deadline?: string;
  value?: string;
  date?: string;
  participants?: number;
}

interface ServiceCardProps {
  service: ServiceItem;
  type: 'tutorias' | 'becas' | 'eventos';
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, type }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative z-10">
        <div className="flex items-center gap-4">
          <IconWrapper color={service.color}>
            {service.icon}
          </IconWrapper>
          <div>
            <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
            <CardDescription className="text-base mt-1">
              {service.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-4">
        <ul className="grid grid-cols-2 gap-3">
          {service.details.map((detail, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${service.color}`} />
              {detail}
            </li>
          ))}
        </ul>
        
        {type === 'tutorias' && service.stats && (
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-primary/10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {service.stats.rating}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Calificación promedio</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {service.stats.students} estudiantes
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {service.stats.hours}h
            </span>
          </div>
        )}
        {type === 'becas' && service.deadline && (
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-primary/10">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Fecha límite: {service.deadline}
            </span>
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Valor: {service.value}
            </span>
          </div>
        )}
        {type === 'eventos' && service.date && (
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-primary/10">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {service.date}
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {service.participants} participantes
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="relative z-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full group-hover:bg-primary transition-colors">
              {type === 'tutorias' ? 'Reservar Sesión' : 
               type === 'becas' ? 'Aplicar Ahora' : 'Registrarse'}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{service.title}</DialogTitle>
              <DialogDescription>
                {service.longDescription}
              </DialogDescription>
            </DialogHeader>
            {/* Aquí iría el formulario o contenido adicional */}
          </DialogContent>
        </Dialog>
      </CardFooter>
      
      {service.badge && (
        <Badge className="absolute top-2 right-2 bg-primary/20 text-primary-foreground">
          {service.badge}
        </Badge>
      )}
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm rounded-full p-2"
          >
            <Sparkles className="w-6 h-6 text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<'tutorias' | 'becas' | 'eventos'>("tutorias")

  const services: Record<'tutorias' | 'becas' | 'eventos', ServiceItem[]> = {
    tutorias: [
      {
        title: "Tutoría en Programación",
        description: "Domina los fundamentos y conceptos avanzados de programación",
        longDescription: "Nuestras tutorías de programación te llevarán desde los conceptos básicos hasta las técnicas más avanzadas. Aprenderás de expertos en la industria y trabajarás en proyectos del mundo real para construir un portafolio impresionante.",
        details: [
          "Sesiones personalizadas 1:1",
          "Proyectos prácticos reales",
          "Feedback continuo",
          "Flexibilidad horaria"
        ],
        icon: <Code className="w-6 h-6" />,
        color: "bg-blue-500",
        badge: "Más Popular",
        stats: { rating: 4.9, students: 234, hours: 20 }
      },
      {
        title: "Tutoría en Diseño UX/UI",
        description: "Aprende a crear experiencias digitales excepcionales",
        longDescription: "Sumérgete en el mundo del diseño UX/UI con nuestros expertos. Aprenderás las últimas herramientas y metodologías para crear interfaces intuitivas y atractivas que los usuarios adorarán.",
        details: [
          "Workshops prácticos",
          "Portfolio profesional",
          "Herramientas modernas",
          "Mentores expertos"
        ],
        icon: <Palette className="w-6 h-6" />,
        color: "bg-purple-500",
        badge: "Nuevo",
        stats: { rating: 4.8, students: 156, hours: 15 }
      },
    ],
    becas: [
      {
        title: "Beca de Innovación Tecnológica",
        description: "Impulsa tu proyecto tecnológico innovador",
        longDescription: "Esta beca está diseñada para estudiantes visionarios con ideas revolucionarias en el campo de la tecnología. Te proporcionamos los recursos y la mentoría necesarios para llevar tu innovación al siguiente nivel.",
        details: [
          "100% matrícula cubierta",
          "Estipendio mensual",
          "Mentoría personalizada",
          "Recursos tecnológicos"
        ],
        icon: <Rocket className="w-6 h-6" />,
        color: "bg-green-500",
        badge: "Alta Demanda",
        deadline: "15 Mayo 2025",
        value: "S/ 10,000"
      },
      {
        title: "Beca de Investigación en IA",
        description: "Desarrolla el futuro de la inteligencia artificial",
        longDescription: "Únete a la vanguardia de la investigación en IA. Esta beca te brinda acceso a recursos de computación avanzados y la oportunidad de colaborar con líderes mundiales en el campo de la inteligencia artificial.",
        details: [
          "Acceso a supercomputadoras",
          "Colaboración con expertos",
          "Publicaciones académicas",
          "Conferencias internacionales"
        ],
        icon: <Brain className="w-6 h-6" />,
        color: "bg-red-500",
        badge: "Destacado",
        deadline: "30 Junio 2025",
        value: "S/ 15,000"
      },
    ],
    eventos: [
      {
        title: "Hackathon Repify 2024",
        description: "48 horas de innovación y desarrollo intensivo",
        longDescription: "Prepárate para el evento tecnológico más emocionante del año. Forma equipo con mentes brillantes, enfrenta desafíos del mundo real y compite por premios increíbles. ¡Es tu oportunidad de brillar!",
        details: [
          "Premios en efectivo",
          "Networking elite",
          "Mentores de FAANG",
          "Oportunidades laborales"
        ],
        icon: <Trophy className="w-6 h-6" />,
        color: "bg-yellow-500",
        date: "15-17 Julio 2025",
        participants: 500
      },
      {
        title: "Tech Summit 2024",
        description: "Conferencia líder en tecnologías emergentes",
        longDescription: "Sumérgete en el futuro de la tecnología con charlas inspiradoras, talleres prácticos y oportunidades de networking inigualables. Conecta con líderes de la industria y descubre las últimas tendencias tecnológicas.",
        details: [
          "Speakers internacionales",
          "Workshops exclusivos",
          "Networking VIP",
          "Certificación oficial"
        ],
        icon: <Lightbulb className="w-6 h-6" />,
        color: "bg-orange-500",
        date: "5 Sept 2025",
        participants: 1000
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/50 to-background">
      <PageContainer>
        <div className="relative py-12">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center justify-center text-center mb-12"
          >
            <h1 className="text-5xl font-extrabold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Servicios de Repify
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Descubre oportunidades únicas para crecer, aprender y conectar con la comunidad universitaria.
            </p>
          </motion.div>

          <Tabs defaultValue="tutorias" className="w-full space-y-8" onValueChange={(value) => setActiveTab(value as 'tutorias' | 'becas' | 'eventos')}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-background/50 backdrop-blur-sm rounded-full p-1">
              <TabsTrigger value="tutorias" className="rounded-full transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="w-4 h-4 mr-2" />
                Tutorías
              </TabsTrigger>
              <TabsTrigger value="becas" className="rounded-full transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <GraduationCap className="w-4 h-4 mr-2" />
                Becas
              </TabsTrigger>
              <TabsTrigger value="eventos" className="rounded-full transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                Eventos
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {Object.entries(services).map(([key, items]) => (
                <TabsContent key={key} value={key}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-6 sm:grid-cols-2"
                  >
                    {items.map((item, index) => (
                      <ServiceCard key={index} service={item} type={key as 'tutorias' | 'becas' | 'eventos'} />
                    ))}
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        </div>
      </PageContainer>
    </div>
  )
}