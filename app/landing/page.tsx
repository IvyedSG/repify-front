"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useIntersection } from 'react-use'; // O usa useInView de framer-motion
import { Users, Target, Brain, FileText, Network, Atom, ChevronRight, ArrowRight } from 'lucide-react';


const RepifyLogo: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="url(#logo-gradient)" />
    <path d="M12 12H28V28H12V12Z" fill="white" fillOpacity="0.9" />
    <path d="M16 16H24V24H16V16Z" fill="url(#logo-gradient)" />
    <defs>
      <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#D946EF" />
      </linearGradient>
    </defs>
  </svg>
);

const BackgroundAnimation: React.FC = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      return [...Array(200)].map((_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5,
      }));
    };

    setParticles(generateParticles());

    const handleResize = () => {
      setParticles(generateParticles());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900 to-black">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-white rounded-full"
            initial={{
              x: particle.x,
              y: particle.y,
              scale: particle.scale,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className="bg-white bg-opacity-5 p-6 rounded-xl backdrop-blur-sm hover:bg-opacity-10 transition-all duration-300 transform hover:scale-105"
    >
      <div className="text-5xl mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </motion.div>
  );
};

const CubeIcon: React.FC = () => (
  <motion.svg
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ rotateY: 0 }}
    animate={{ rotateY: 360 }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    <path d="M100 20L180 60V140L100 180L20 140V60L100 20Z" stroke="url(#cube-gradient)" strokeWidth="4" />
    <path d="M100 20V100M100 100V180M100 100L180 60M100 100L20 60" stroke="url(#cube-gradient)" strokeWidth="2" />
    <circle cx="100" cy="20" r="4" fill="url(#cube-gradient)" />
    <circle cx="180" cy="60" r="4" fill="url(#cube-gradient)" />
    <circle cx="180" cy="140" r="4" fill="url(#cube-gradient)" />
    <circle cx="100" cy="180" r="4" fill="url(#cube-gradient)" />
    <circle cx="20" cy="140" r="4" fill="url(#cube-gradient)" />
    <circle cx="20" cy="60" r="4" fill="url(#cube-gradient)" />
    <defs>
      <linearGradient id="cube-gradient" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#D946EF" />
      </linearGradient>
    </defs>
  </motion.svg>
);

const RepifyLanding: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleComenzar = () => {
    // Implement the action for the "COMENZAR" button here
    console.log("COMENZAR button clicked");
    // For example, you could redirect to a sign-up page:
    // window.location.href = "/signup";
  };

  return (
    <div className="relative min-h-screen font-sans text-white overflow-x-hidden">
      <BackgroundAnimation />
      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-black bg-opacity-50 backdrop-blur-md">
          <a href="/" className="flex items-center space-x-2">
            <RepifyLogo />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">Repify</span>
          </a>
          <nav className="hidden md:flex space-x-6">
            <a href="#benefits" className="text-white hover:text-purple-300 transition-colors duration-200">Beneficios</a>
            <a href="#about" className="text-white hover:text-purple-300 transition-colors duration-200">Acerca de</a>
            <a href="#partners" className="text-white hover:text-purple-300 transition-colors duration-200">Colaboradores</a>
          </nav>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </header>
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-90 flex flex-col items-center justify-center">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-white">
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <nav className="flex flex-col space-y-6 text-2xl">
              <a href="#benefits" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-300 transition-colors duration-200">Beneficios</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-300 transition-colors duration-200">Acerca de</a>
              <a href="#partners" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-purple-300 transition-colors duration-200">Colaboradores</a>
            </nav>
          </div>
        )}
        <main className="pt-24">
          <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Bienvenido a Repify
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-12 max-w-3xl"
            >
              Facilitamos la colaboración en proyectos universitarios, desde investigaciones hasta iniciativas personales.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button
                onClick={handleComenzar}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                COMENZAR
                <ArrowRight className="inline-block ml-2" />
              </button>
            </motion.div>
          </section>

          <section id="benefits" className="py-20 px-4">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">Beneficios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <BenefitCard
                icon={<Users className="inline-block" />}
                title="Trabajo en equipo"
                description="Fomenta la colaboración entre estudiantes de distintas disciplinas, permitiendo que compartan conocimientos y habilidades en proyectos conjuntos."
              />
              <BenefitCard
                icon={<Target className="inline-block" />}
                title="Interdisciplinariedad"
                description="Las conexiones entre diferentes campos de estudio enriquecen los proyectos y amplían las perspectivas de los estudiantes."
              />
              <BenefitCard
                icon={<Brain className="inline-block" />}
                title="Desarrollo de habilidades"
                description="Potencia el crecimiento personal y profesional de los estudiantes al ejercitar tanto habilidades técnicas como habilidades blandas en la ejecución de proyectos."
              />
              <BenefitCard
                icon={<FileText className="inline-block" />}
                title="Construcción de un portafolio"
                description="Los usuarios pueden crear un historial de sus proyectos y colaboraciones, útil para futuras oportunidades académicas y profesionales."
              />
              <BenefitCard
                icon={<Network className="inline-block" />}
                title="Networking académico"
                description="Fomenta la creación de una red de contactos académicos y profesionales que puede ser valiosa para futuras colaboraciones e investigaciones."
              />
              <BenefitCard
                icon={<Atom className="inline-block" />}
                title="Visibilidad académica"
                description="Permite que los proyectos universitarios ganen visibilidad, potencialmente atrayendo interés y recursos de la comunidad académica y empresas."
              />
            </div>
          </section>

          <section id="about" className="py-20 px-4 bg-gradient-to-b from-transparent to-purple-900">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">¿Qué es Repify?</h2>
                <p className="text-lg mb-8">
                  Repify es una plataforma innovadora que facilita la colaboración entre estudiantes de distintas disciplinas en proyectos universitarios. Permite publicar y unirse a proyectos académicos y personales, creando un entorno que potencia la interdisciplinariedad y la cooperación. Conecta con compañeros, crea un portafolio impresionante y recibe retroalimentación valiosa para mejorar tu perfil académico y profesional. ¡Únete a Repify y lleva tus ideas al siguiente nivel!
                </p>
                <button className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition-colors duration-200 flex items-center transform hover:scale-105">
                  Saber más <ChevronRight className="ml-2" />
                </button>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <CubeIcon />
              </div>
            </div>
          </section>

          <section id="partners" className="py-20 px-4">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">Colaboramos con</h2>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {['UTP', 'CIENT�FICA', 'Autónoma', 'SENATI'].map((partner, index) => (
                <motion.div
                  key={index}
                  className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={`/placeholder.svg?height=60&width=120&text=${partner}`} alt={partner} className="h-12 object-contain" />
                </motion.div>
              ))}
            </div>
          </section>
        </main>
        <footer className="bg-black bg-opacity-50 backdrop-blur-md py-8 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p>&copy; 2023 Repify. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RepifyLanding;