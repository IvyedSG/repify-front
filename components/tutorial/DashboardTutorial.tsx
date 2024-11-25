'use client'

import React, { useEffect, useState, useRef } from 'react'
import Shepherd from 'shepherd.js'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
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
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false)

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
        scrollTo: true,
        modalOverlayOpeningPadding: 4,
        popperOptions: {
          modifiers: [{ name: 'offset', options: { offset: [0, 12] } }]
        }
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
        id: 'search-filter',
        title: 'Búsqueda y Filtros',
        text: 'Utiliza estas herramientas para encontrar rápidamente los proyectos atractivos para ti',
        attachTo: { element: '.search-filter', on: 'bottom' },
      },
      {
        id: 'project-list',
        title: 'Lista de Proyectos',
        text: 'Explora todos los proyectos actuales y de tu interés en esta sección',
        attachTo: { element: '.project-list', on: 'top' },
      },
      {
        id: 'project-card',
        title: 'Tarjeta de Proyecto',
        text: 'Cada tarjeta muestra información clave sobre un proyecto',
        attachTo: { element: '.project-card', on: 'bottom' },
      },
      {
        id: 'project-leader',
        title: 'Líder del Proyecto',
        text: 'Haz clic en el nombre del líder para ver su perfil',
        attachTo: { element: '.project-leader-link', on: 'bottom' },
      },
      {
        id: 'project-details',
        title: 'Detalles del Proyecto',
        text: 'Haz clic en "Ver detalles" para más información sobre el proyecto y poder aplicar a él',
        attachTo: { element: '.view-details-button', on: 'bottom' },
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
      let seenTutorial = false
      
      try {
        seenTutorial = localStorage.getItem('hasSeenTutorial') === 'true'
      } catch (e) {
        console.warn('Unable to access localStorage. Falling back to default value.')
      }

      setHasSeenTutorial(seenTutorial)
      
      if (!seenTutorial && !tourRef.current) {
        const checkElements = () => {
          const elements = [
            '.dashboard-title',
            '.search-filter',
            '.project-list',
            '.project-card',
            '.project-leader-link',
            '.view-details-button'
          ]

          const allElementsExist = elements.every(selector => 
            document.querySelector(selector)
          )

          if (allElementsExist) {
            const newTour = createTour()
            tourRef.current = newTour
            
            newTour.on('complete', () => {
              try {
                localStorage.setItem('hasSeenTutorial', 'true')
              } catch (e) {
                console.warn('Unable to set localStorage. Tutorial may restart on page refresh.')
              }
              setHasSeenTutorial(true)
              setShowRestartButton(true)
              tourRef.current = null
            })

            newTour.on('cancel', () => {
              setHasSeenTutorial(true)
              tourRef.current = null
            })

            newTour.start()
          } else {
            setTimeout(checkElements, 500)
          }
        }

        setTimeout(checkElements, 1000)
      } else {
        setShowRestartButton(true)
      }
    }

    checkAndStartTutorial()

    return () => {
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
        console.warn('Unable to set localStorage. Tutorial may restart on page refresh.')
      }
      setHasSeenTutorial(true)
      setShowRestartButton(true)
      tourRef.current = null
    })

    newTour.on('cancel', () => {
      setHasSeenTutorial(true)
      tourRef.current = null
    })

    newTour.start()
    setShowRestartButton(false)
  }

  return (
    <>
      {children}
      <AnimatePresence>
        {showRestartButton && hasSeenTutorial && (
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

