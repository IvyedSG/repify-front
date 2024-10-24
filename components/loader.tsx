'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/web'

export default function ThreeJsLoader({ onLoadComplete }: { onLoadComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  const fadeProps = useSpring({
    opacity: fadeOut ? 0 : 1,
    config: { duration: 1000 },
    onRest: useCallback(() => {
      if (fadeOut) {
        onLoadComplete()
      }
    }, [fadeOut, onLoadComplete]),
  })

  useEffect(() => {
    if (!canvasRef.current) return

    let renderer: THREE.WebGLRenderer | null = null
    let scene: THREE.Scene | null = null
    let camera: THREE.PerspectiveCamera | null = null
    let icosahedron: THREE.LineSegments | null = null

    try {
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true })

      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0)

      const geometry = new THREE.IcosahedronGeometry(1, 1)
      const material = new THREE.LineBasicMaterial({ color: 0x666666 })
      icosahedron = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), material)
      scene.add(icosahedron)

      camera.position.z = 5
    } catch (error) {
      console.error("Error initializing Three.js:", error)
      onLoadComplete()
      return
    }

    const animate = () => {
      if (!icosahedron || !renderer || !scene || !camera) return
      requestAnimationFrame(animate)
      icosahedron.rotation.x += 0.005
      icosahedron.rotation.y += 0.005
      renderer.render(scene, camera)
    }

    animate()

    const incrementProgress = () => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          setFadeOut(true)
          return 100
        }
        return prevProgress + 1
      })
    }

    const progressInterval = setInterval(incrementProgress, 30)

    const handleResize = () => {
      if (!camera || !renderer) return
      const width = window.innerWidth
      const height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(progressInterval)
      window.removeEventListener('resize', handleResize)
      if (renderer) {
        renderer.dispose()
      }
      if (scene) {
        scene.clear()
      }
    }
  }, [onLoadComplete])

  return (
    <animated.div style={fadeProps} className="fixed inset-0 flex items-center justify-center bg-black">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="z-10 text-gray-300 text-4xl font-light">{progress}%</div>
    </animated.div>
  )
}