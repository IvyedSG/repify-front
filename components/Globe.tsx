'use client'

import { useEffect, useRef, useState } from 'react'
import createGlobe from 'cobe'

interface GlobeProps {
  size: number
}

export default function Globe({ size }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false)

  useEffect(() => {
    let globe: any

    const loadGlobe = async () => {
      let phi = 0

      if (canvasRef.current) {
        globe = createGlobe(canvasRef.current, {
          devicePixelRatio: 2,
          width: size * 2,
          height: size * 2,
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
  }, [size])

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLElement).style.cursor = 'grabbing'
    pointerInteracting.current = e.clientX - pointerInteractionMovement.current
  }

  const handlePointerUp = () => {
    (canvasRef.current as HTMLElement).style.cursor = 'grab'
    pointerInteracting.current = null
  }

  const handlePointerOut = handlePointerUp

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (pointerInteracting.current !== null) {
      const delta = e.clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta / 100
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (pointerInteracting.current !== null && e.touches[0]) {
      const delta = e.touches[0].clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta / 100
    }
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        maxWidth: '100%',
        aspectRatio: '1',
        cursor: 'grab',
        opacity: isGlobeLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerOut}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    />
  )
}