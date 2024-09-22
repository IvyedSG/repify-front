'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const reasons = [
  "el caos es divertido 💥",
  "cero presión 💨",
  "no hay deadlines absurdos 🕒",
  "el equipo fluye mejor ✨",
  "son mi zona de confort 😎",
  "no hay reglas 🤘",
  "la libertad manda 🚀"
]

export default function DynamicContent() {
  const [currentReason, setCurrentReason] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const [globeSize, setGlobeSize] = useState(300)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false)

  const onResize = useCallback(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      const size = Math.min(width, height) * 0.8
      setGlobeSize(size)
    }
  }, [])

  useEffect(() => {
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReason((prev) => (prev + 1) % reasons.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let globe: any

    const loadGlobe = async () => {
      const createGlobe = (await import('cobe')).default
      let phi = 0

      if (canvasRef.current) {
        globe = createGlobe(canvasRef.current, {
          devicePixelRatio: 2,
          width: globeSize * 2,
          height: globeSize * 2,
          phi: 0,
          theta: 0.3,
          dark: 1,
          diffuse: 1.2,
          mapSamples: 16000,
          mapBrightness: 6,
          baseColor: [0.3, 0.3, 0.3],
          markerColor: [0.1, 0.8, 1],
          glowColor: [0.1, 0.8, 1],
          markers: [
            { location: [37.7595, -122.4367], size: 0.03 },
            { location: [40.7128, -74.006], size: 0.1 },
          ],
          onRender: (state: any) => {
            if (!pointerInteracting.current) {
              phi += 0.005
            }
            state.phi = phi + pointerInteractionMovement.current
          }
        })
        setIsGlobeLoaded(true)
      }
    }

    loadGlobe()

    return () => {
      if (globe) {
        globe.destroy()
      }
    }
  }, [globeSize])

  return (
    <div className="flex flex-col h-full" ref={containerRef}>
      <div className="relative flex-grow flex items-center justify-center">
        {!isGlobeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          style={{
            width: `${globeSize}px`,
            height: `${globeSize}px`,
            maxWidth: '100%',
            aspectRatio: '1',
            cursor: 'grab',
            opacity: isGlobeLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
          onPointerDown={(e) => {
            (e.target as HTMLElement).style.cursor = 'grabbing'
            pointerInteracting.current = e.clientX - pointerInteractionMovement.current
          }}
          onPointerUp={() => {
            (canvasRef.current as HTMLElement).style.cursor = 'grab'
            pointerInteracting.current = null
          }}
          onPointerOut={() => {
            (canvasRef.current as HTMLElement).style.cursor = 'grab'
            pointerInteracting.current = null
          }}
          onMouseMove={(e) => {
            if (pointerInteracting.current !== null) {
              const delta = e.clientX - pointerInteracting.current
              pointerInteractionMovement.current = delta / 100
            }
          }}
          onTouchMove={(e) => {
            if (pointerInteracting.current !== null && e.touches[0]) {
              const delta = e.touches[0].clientX - pointerInteracting.current
              pointerInteractionMovement.current = delta / 100
            }
          }}
        />
      </div>

      <div className="text-center mt-4">
        <h2 className="text-3xl font-bold mb-2">Amamos los proyectos casuales porque</h2>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentReason}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-blue-400"
          >
            {reasons[currentReason]}
          </motion.div>
        </AnimatePresence>
        
      </div>
    </div>
  )
}