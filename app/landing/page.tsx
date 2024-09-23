'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Rocket, GraduationCap, Briefcase, Network, Eye, ChevronRight, Menu, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link';

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState('welcome')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const controls = useAnimation()
  const carouselRef = useRef(null)
  const [currentImage, setCurrentImage] = useState(0)

  const sections = [
    { id: 'welcome', title: 'Inicio' },
    { id: 'benefits', title: 'Beneficios' },
    { id: 'about', title: 'Nosotros' },
    { id: 'team', title: 'Equipo' }
  ]

  const benefits = [
    { icon: <Users className="h-12 w-12 mb-4 text-cyan-400" />, title: "Trabajo en Equipo", description: "Desarrolla habilidades de colaboración en proyectos reales" },
    { icon: <Rocket className="h-12 w-12 mb-4 text-purple-400" />, title: "Interdisciplinariedad", description: "Colabora con estudiantes de diversas carreras" },
    { icon: <GraduationCap className="h-12 w-12 mb-4 text-pink-400" />, title: "Desarrollo de Habilidades", description: "Mejora tus competencias profesionales y personales" },
    { icon: <Briefcase className="h-12 w-12 mb-4 text-yellow-400" />, title: "Construcción de Portfolio", description: "Crea un portafolio impresionante con proyectos reales" },
    { icon: <Network className="h-12 w-12 mb-4 text-green-400" />, title: "Networking Académico", description: "Conecta con profesionales y otros estudiantes" },
    { icon: <Eye className="h-12 w-12 mb-4 text-blue-400" />, title: "Visibilidad Académica", description: "Destaca en el ámbito universitario y profesional" }
  ]

  const team = [
    { 
      name: "Deyvi Sanchez", 
      role: "Desarrollador Frontend", 
      image: "/deyvi.jpg",
      skills: [
        { name: "React", logo: "/react.svg" },
        { name: "TypeScript", logo: "/ts.svg" },
        { name: "Tailwind CSS", logo: "/tailwind.svg" },
        { name: "Next.js", logo: "/next.svg" },
        { name: "Bootstrap", logo: "/bootstrap.svg" },
        { name: "Google Cloud", logo: "/cloud.svg" },
        { name: "CSS", logo: "/css.svg" },
        { name: "Docker", logo: "/docker.svg" },
        { name: "Git", logo: "/git.svg" },
        { name: "Github", logo: "/github.svg" },
        { name: "HTML", logo: "/html.svg" },
        { name: "JavaScript", logo: "/js.svg" },
        { name: "Python", logo: "/python.svg" },
        { name: "Vite.js", logo: "/vite.svg" },
        { name: "Vercel", logo: "/vercelx.svg" },
        { name: "Shadcn", logo: "/shadcn.svg" },
      ]
    },
    { 
      name: "Max Ttito", 
      role: "Desarrollador Backend", 
      image: "/placeholder-user.jpg",
      skills: [
        { name: "Amazon RDS", logo: "/amazondb.svg" },
        { name: "AWS", logo: "/amazonws.svg" },
        { name: "Google Cloud", logo: "/cloud.svg" },
        { name: "Django", logo: "/django.svg" },
        { name: "Docker", logo: "/docker.svg" },
        { name: "FastAPI", logo: "/fastapi.svg" },
        { name: "Git", logo: "/git.svg" },
        { name: "Github", logo: "/github.svg" },
        { name: "JWT", logo: "/jwt.svg" },
        { name: "MySQL", logo: "/mysql.svg" },
        { name: "Postgre SQL", logo: "/postgre.svg" },
        { name: "Python", logo: "/python.svg" },
      ]
    },
    { 
      name: "Angel Choquehuanca", 
      role: "Desarrollador Backend", 
      image: "/placeholder-user.jpg",
      skills: [
        { name: "PHP", logo: "/php.svg" },
        { name: "Django", logo: "/django.svg" },
        { name: "FastAPI", logo: "/fastapi.svg" },
        { name: "JWT", logo: "/jwt.svg" },
        { name: "Git", logo: "/git.svg" },
        { name: "Github", logo: "/github.svg" },
        { name: "MySQL", logo: "/mysql.svg" },
        { name: "Python", logo: "/python.svg" },
      ]
    },
    { 
      name: "Edward Medina", 
      role: "Diseñador UI/UX", 
      image: "/placeholder-user.jpg",
      skills: [
        { name: "Python", logo: "/python.svg" },
        { name: "Git", logo: "/git.svg" },
        { name: "Github", logo: "/github.svg" },
        { name: "Figma", logo: "/figma.svg" },
        { name: "CSS", logo: "/css.svg" },
        { name: "HTML", logo: "/html.svg" },
        { name: "JavaSript", logo: "/js.svg" },
        { name: "Vite", logo: "/vite.svg" },
      ]
    },
    { 
      name: "Jesus Pezo", 
      role: "QA Tester", 
      image: "/placeholder-user.jpg",
      skills: [
        { name: "Python", logo: "/python.svg" },
        { name: "Git", logo: "/git.svg" },
        { name: "Github", logo: "/github.svg" },
        { name: "Figma", logo: "/figma.svg" },
        { name: "CSS", logo: "/css.svg" },
        { name: "HTML", logo: "/html.svg" },
        { name: "JavaSript", logo: "/js.svg" },
        { name: "MySQL", logo: "/mysql.svg" },
      ]
    },
    { 
      name: "Felipe Inga", 
      role: "Diseñador UI/UX", 
      image: "/placeholder-user.jpg",
      skills: [
        { name: "Python", logo: "/python.svg" },
        { name: "Git", logo: "/git.svg" },
        { name: "Github", logo: "/github.svg" },
        { name: "Figma", logo: "/figma.svg" },
        { name: "CSS", logo: "/css.svg" },
        { name: "HTML", logo: "/html.svg" },
        { name: "JavaSript", logo: "/js.svg" },
        { name: "Vite", logo: "/vite.svg" },
      ]
    }
  ]

  const carouselImages = [
    "/carrusel1.jpeg",
    "/carrusel2.jpeg",
    "/carrusel3.jpeg",
    "/carrusel4.jpeg",
    "/carrusel5.jpeg",
    "/carrusel6.jpeg",
    "/carrusel7.jpeg",
    "/carrusel8.jpeg",
    "/carrusel9.jpeg",
  ]

  useEffect(() => {
    controls.start({
      y: [0, -10, 0],
      transition: { repeat: Infinity, duration: 2 }
    })

    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % carouselImages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [controls])

  const pageVariants = {
    initial: { opacity: 0, scale: 0.8 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.2 }
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <motion.header 
        className="bg-gray-800/80 backdrop-blur-sm z-50 p-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <motion.img 
              src="/logo.webp" 
              alt="Logo" 
              className="w-8 h-8"
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }} 
            />
            <motion.h1 
              className="text-2xl font-bold text-cyan-400"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Repify
            </motion.h1>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {sections.map((section) => (
                <motion.li key={section.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <button 
                    onClick={() => setActiveSection(section.id)}
                    className={`hover:text-cyan-400 transition-colors ${activeSection === section.id ? 'text-cyan-400 font-semibold' : ''}`}
                  >
                    {section.title}
                  </button>
                </motion.li>
              ))}
            </ul>
          </nav>
  
          <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </motion.header>
  
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav 
            className="md:hidden bg-gray-800 p-4 absolute top-16 left-0 right-0 z-40"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ul className="space-y-2">
              {sections.map((section) => (
                <motion.li 
                  key={section.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => {
                      setActiveSection(section.id)
                      setIsMenuOpen(false)
                    }}
                    className={`block py-2 w-full text-left hover:text-cyan-400 transition-colors ${activeSection === section.id ? 'text-cyan-400 font-semibold' : ''}`}
                  >
                    {section.title}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    

      {/* Main Content */}
      <main className="flex-grow relative">
        <AnimatePresence mode="wait">
          {activeSection === 'welcome' && (
            <motion.section
              key="welcome"
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="text-center px-4">
              <motion.h2 
  className="text-5xl md:text-7xl font-bold mb-12 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text" // Aquí cambio mb-6 a mb-12
  initial={{ y: -50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
>
  Únete ahora
</motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                className="mb-8"
              >
                <video
                  className="w-full max-w-3xl mx-auto rounded-lg shadow-xl"
                  controls // Agrega el atributo controls para permitir la reproducción manual
                  playsInline
                >
                  <source src="/videoprueba.mp4" type="video/mp4" />
                  Tu navegador no soporta el tag de video.
                </video>
              </motion.div>
                <motion.p 
                  className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-300"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                >
                  Potencia tu carrera profesional con proyectos reales y experiencias únicas con otros estudiantes
                </motion.p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 10 }}
                >
                  <Link href="/" passHref>
                    <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                      Comienza Ahora <ChevronRight className="ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.section>
          )}

          {activeSection === 'benefits' && (
            <motion.section
              key="benefits"
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="container mx-auto px-4">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-center mb-12 text-cyan-400"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Ventajas
                </motion.h2>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {benefits.map((benefit, index) => (
                    <motion.div key={index} variants={itemVariants}>
                    <Card className="bg-gray-800 border-gray-700 hover:border-cyan-400 transition-colors overflow-hidden">
                      <CardContent className="pt-6 text-center relative">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        />
                        <div className="flex justify-center mb-4">
                          <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                            {benefit.icon}
                          </motion.div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white relative z-10">{benefit.title}</h3>
                        <p className="text-gray-300 relative z-10">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>                  
                  ))}
                </motion.div>
              </div>
            </motion.section>
          )}

          {activeSection === 'about' && (
            <motion.section
              key="about"
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div
                className="md:w-1/2"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-400">
                  Sobre Repify
                </h2>
                <p className="text-lg mb-4 text-gray-300">
                  Somos un grupo de estudiantes del 4to ciclo, creemos en el
                  aprendizaje en forma de práctica, nuestro objetivo es mejorar
                  constantemente.
                </p>

                <blockquote className="text-lg mb-4 text-gray-300 italic">
                  "La idea surgió a partir de nuestra pasión por crear proyectos,
                  el propósito era reflejarnos lo más pronto posible como futuros
                  ingenieros."
                </blockquote>
                <p className="text-gray-500 mb-6">— Max Ttito</p>

                <blockquote className="text-lg mb-4 text-gray-300 italic">
                  "Nuestra misión es que, al igual que nosotros, promover la realización  de proyectos, de cualquier carrera, participar en equipo realmente te motiva
                  e influye en tus capacidades como profesional"
                </blockquote>
                <p className="text-gray-500 mb-6">— Deyvi Sanchez</p>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900"
                    onClick={() => setActiveSection("team")}
                  >
                    Descubre Más <ChevronRight className="ml-2" />
                  </Button>
                </motion.div>
              </motion.div>
                  <motion.div 
                    className="md:w-1/2"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="relative w-full h-64 md:h-96" ref={carouselRef}>
                      {carouselImages.map((image, index) => (
                        <motion.img
                          key={index}
                          src={image}
                          alt={`Repify en acción ${index + 1}`}
                          className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-xl"
                          initial={{ opacity: 0, rotateY: -90 }}
                          animate={{
                            opacity: currentImage === index ? 1 : 0,
                            rotateY: currentImage === index ? 0 : 90,
                            zIndex: currentImage === index ? 1 : 0,
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          )}

{activeSection === 'team' && (
        <motion.section
          key="team"
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-12 text-cyan-400"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Nuestro Equipo
            </motion.h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {team.map((member, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="bg-gray-800 border-gray-700 hover:border-cyan-400 transition-colors overflow-hidden cursor-pointer">
                        <CardContent className="pt-6 text-center relative">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                          />
                          <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Avatar className="w-24 h-24 mx-auto mb-4">
                              <AvatarImage src={member.image} alt={member.name} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                          </motion.div>
                          <h3 className="text-xl font-semibold mb-2 text-white relative z-10">{member.name}</h3>
                          <p className="text-gray-300 relative z-10">{member.role}</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-cyan-400">{member.name}</DialogTitle>
                        <DialogDescription className="text-gray-300">{member.role}</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-2">Mis tecnologías</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {member.skills.map((skill, skillIndex) => (
                            <div key={skillIndex} className="flex items-center bg-gray-700 rounded-lg p-2">
                              <img src={skill.logo} alt={skill.name} className="w-8 h-8 mr-2" />
                              <span>{skill.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}
          
        </AnimatePresence>
      </main>

      {/* Footer */}
      <motion.footer 
        className="bg-gray-800 py-4"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto text-center px-4">
          <p className="text-gray-400">&copy; 2024 Repify. Todos los derechos reservados.</p>
        </div>
      </motion.footer>
    </div>
  )
}