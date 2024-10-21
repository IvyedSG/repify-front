'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useTransition, animated } from '@react-spring/web'

const words = ['LOGRAMOS', 'GRANDES', 'METAS']

export default function DynamicContent() {
  const ref = useRef<ReturnType<typeof setTimeout>[]>([])
  const [items, set] = useState<string[]>([])
  const transitions = useTransition(items, {
    from: {
      opacity: 0,
      height: 0,
      innerHeight: 0,
      transform: 'perspective(600px) rotateX(0deg)',
      color: '#8fa5b6',
    },
    enter: [
      { opacity: 1, height: 80, innerHeight: 80 },
      { transform: 'perspective(600px) rotateX(180deg)', color: '#28d79f' },
      { transform: 'perspective(600px) rotateX(0deg)' },
    ],
    leave: [{ color: '#c23369' }, { innerHeight: 0 }, { opacity: 0, height: 0 }],
    update: { color: '#28b4d7' },
  })

  const reset = useCallback(() => {
    ref.current.forEach(clearTimeout)
    ref.current = []
    set([])
    words.forEach((word, i) => {
      ref.current.push(setTimeout(() => set(prev => [...prev, word]), i * 3000))
    })
  }, [])

  useEffect(() => {
    reset()

    const interval = setInterval(() => {
      reset(); // Reinicia el ciclo de palabras
    }, words.length * 3000); // Ajusta el tiempo basado en la cantidad de palabras

    return () => {
      ref.current.forEach(clearTimeout)
      clearInterval(interval); // Limpia el intervalo al desmontar
    }
  }, [])

  return (
    <div className="flex flex-col h-full bg-black items-center justify-center">
      <div className="w-full max-w-3xl px-4">
        <div className="h-[240px] md:h-[320px]">
          {transitions(({ innerHeight, ...rest }, item) => (
            <animated.div
              className="overflow-hidden w-full text-white flex justify-center items-start text-6xl md:text-8xl font-extrabold uppercase will-change-transform cursor-pointer"
              style={{ ...rest, marginTop: '20px' }} // Aumenta el margen superior según sea necesario
              onClick={reset}
            >
              <animated.div style={{ overflow: 'hidden', height: innerHeight }}>{item}</animated.div>
            </animated.div>
          ))}
        </div>
      </div>
    </div>
  )
}
