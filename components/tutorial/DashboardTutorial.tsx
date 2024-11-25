'use client'

import React, { useEffect, useState, useRef } from 'react'
import Shepherd from 'shepherd.js'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import 'shepherd.js/dist/css/shepherd.css'

interface DashboardTutorialProps {
  children: React.ReactNode
}

const DashboardTutorial: React.FC<DashboardTutorialProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)
  const [showRestartButton, setShowRestartButton] = useState(false)
  const tourRef = useRef<any>(null)

  const createTour = () => {
    if (tourRef.current) {
      tourRef.current.complete()
      tourRef.current = null
    }

    const newTour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: {
          enabled: false
        },
        classes: 'shadow-lg rounded-lg bg-background border border-border p-0',
        scrollTo: true
      }
    })

    const steps = [
      {
        id: 'welcome',
        title: '¡Bienvenido a Proyectos!',
        text: 'Aquí podrás ver todos los proyectos de la comunidad',
        attachTo: { element: '.dashboard-title', on: 'bottom' },
      },
      {
        id: 'project-list',
        title: 'Lista de Proyectos',
        text: 'Explora todos los proyectos actuales y de tu interés en esta sección',
        attachTo: { element: '.project-list', on: 'bottom' },
      },
      {
        id: 'search-filter',
        title: 'Búsqueda y Filtros',
        text: 'Utiliza estas herramientas para encontrar rápidamente los proyectos atractivos para ti',
        attachTo: { element: '.search-filter', on: 'bottom' },
      },
      {
        id: 'project-card',
        title: 'Tarjeta de Proyecto',
        text: 'Haz clic en "Ver detalles" para más información sobre el proyecto y poder aplicar a el',
        attachTo: { element: '.project-card button:last-child', on: 'bottom' },
      }
    ]

    steps.forEach((step, index) => {
      newTour.addStep({
        id: step.id,
        title: step.title,
        text: step.text,
        attachTo: step.attachTo,
        buttons: [
          {
            text: 'Anterior',
            classes: 'shepherd-button-secondary',
            action: () => newTour.back(),
            disabled: index === 0
          },
          {
            text: index === steps.length - 1 ? 'Finalizar' : 'Siguiente',
            action: () => index === steps.length - 1 ? newTour.complete() : newTour.next()
          }
        ],
        when: {
          show: () => setCurrentStep(index + 1)
        }
      })
    })

    setTotalSteps(steps.length)
    return newTour
  }

  useEffect(() => {
    const checkAndStartTutorial = () => {
      const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
      const hasSeenTutorialThisSession = sessionStorage.getItem('hasSeenTutorialThisSession')
      
      if (!hasSeenTutorial && !hasSeenTutorialThisSession && !tourRef.current) {
        const newTour = createTour()
        tourRef.current = newTour
        
        newTour.on('complete', () => {
          try {
            localStorage.setItem('hasSeenTutorial', 'true')
          } catch (e) {
            console.warn('Unable to use localStorage. Falling back to sessionStorage.')
          }
          sessionStorage.setItem('hasSeenTutorialThisSession', 'true')
          setShowRestartButton(true)
          tourRef.current = null
        })

        newTour.on('cancel', () => {
          sessionStorage.setItem('hasSeenTutorialThisSession', 'true')
          tourRef.current = null
        })

        newTour.start()
      } else {
        setShowRestartButton(true)
      }
    }

    // Delay the check to ensure DOM elements are ready
    const timer = setTimeout(checkAndStartTutorial, 1000)

    return () => {
      clearTimeout(timer)
      if (tourRef.current) {
        tourRef.current.complete()
        tourRef.current = null
      }
    }
  }, [])

  const restartTutorial = () => {
    const newTour = createTour()
    tourRef.current = newTour
    
    newTour.on('complete', () => {
      try {
        localStorage.setItem('hasSeenTutorial', 'true')
      } catch (e) {
        console.warn('Unable to use localStorage. Falling back to sessionStorage.')
      }
      sessionStorage.setItem('hasSeenTutorialThisSession', 'true')
      setShowRestartButton(true)
      tourRef.current = null
    })

    newTour.on('cancel', () => {
      sessionStorage.setItem('hasSeenTutorialThisSession', 'true')
      tourRef.current = null
    })

    newTour.start()
    setShowRestartButton(false)
  }

  return (
    <>
      {children}
      <AnimatePresence>
        {showRestartButton && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4"
          >
            <Button onClick={restartTutorial} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> Reiniciar Tutorial
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {tourRef.current && (
        <style jsx global>{`
          .shepherd-content {
            padding: 0;
          }
          .shepherd-text {
            padding: 1rem;
          }
          .shepherd-footer {
            padding: 0.5rem 1rem;
            border-top: 1px solid hsl(var(--border));
          }
          .shepherd-button {
            @apply bg-primary text-primary-foreground hover:bg-primary/90;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
          }
          .shepherd-button-secondary {
            @apply bg-secondary text-secondary-foreground hover:bg-secondary/80;
          }
          .shepherd-progress {
            @apply bg-muted;
            height: 4px;
            width: 100%;
          }
          .shepherd-progress-bar {
            @apply bg-primary;
            height: 100%;
            transition: width 0.3s ease;
          }
        `}</style>
      )}
    </>
  )
}

export default DashboardTutorial

