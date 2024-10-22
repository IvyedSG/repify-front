'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

const reasons = [
  "aprendemos haciendo lo que nos apasiona 💡",
  "cada reto nos impulsa a ser mejores 🚀",
  "todos aportamos algo único 🎯",
  "creamos en equipo, crecemos en equipo 🤝",
  "el aprendizaje nunca se detiene 🔥",
  "las ideas fluyen sin barreras 🌊",
  "juntos podemos con todo! 🌟"
]

const Globe = dynamic(() => import('./Globe'), { ssr: false, loading: () => <GlobeLoader /> })

const GlobeLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
)

const ReasonText = ({ reason }: { reason: string }) => (
  <motion.div
    key={reason}
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -20, opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="text-3xl font-bold text-blue-400"
  >
    {reason}
  </motion.div>
)

export default function DynamicContent() {
  const [currentReason, setCurrentReason] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [globeSize, setGlobeSize] = useState(300)

  const onResize = useCallback(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      const size = Math.min(width, height) * 0.8
      setGlobeSize(size)
    }
  }, [])

  useEffect(() => {
    onResize()
    const resizeObserver = new ResizeObserver(onResize)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    return () => resizeObserver.disconnect()
  }, [onResize])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReason((prev) => (prev + 1) % reasons.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col h-full" ref={containerRef}>
      <div className="relative flex-grow flex items-center justify-center">
        <Globe size={globeSize} />
      </div>

      <div className="text-center mt-4">
        <h2 className="text-3xl font-bold mb-2">¡Aquí los proyectos son épicos porque...</h2>
        <AnimatePresence mode="wait">
          <ReasonText reason={reasons[currentReason]} />
        </AnimatePresence>
      </div>
    </div>
  )
}