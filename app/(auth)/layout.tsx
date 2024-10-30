'use client'
import { ReactNode, useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import fondo from '/app/(auth)/fondo.jpg'

const ThreeJsLoader = dynamic(() => import('@/components/loader'), { ssr: false })
const DynamicContent = dynamic(() => import('@/components/DynamicContent'), { ssr: false })

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadDynamicContent, setLoadDynamicContent] = useState(true);
  const fpsRef = useRef<number[]>([]);

  useEffect(() => {
    const measurePerformance = () => {
      let lastTimestamp = performance.now();

      const updateFPS = (now: number) => {
        const delta = now - lastTimestamp;
        lastTimestamp = now;

        const fps = 1000 / delta;
        fpsRef.current.push(fps);

        if (fpsRef.current.length > 60) fpsRef.current.shift();

        const avgFPS = fpsRef.current.reduce((a, b) => a + b) / fpsRef.current.length;
        if (avgFPS < 30) setLoadDynamicContent(false);

        requestAnimationFrame(updateFPS);
      };

      requestAnimationFrame(updateFPS);
    };

    const timer = setTimeout(() => setIsLoading(false), 3000);
    measurePerformance();

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ThreeJsLoader onLoadComplete={() => setIsLoading(false)} />;
  }

  if (!loadDynamicContent) {
    // Cuando el fondo está visible, muestra el formulario alineado a la derecha
    return (
      <div className="flex items-center justify-center w-full h-screen">
        {children}
      <div
        className="flex w-full h-screen bg-center bg-cover"
        style={{ backgroundImage: `url(${fondo.src})` }}
      >
        <div className="absolute w-full transform -translate-y-1/2 top-1/2 right-10 lg:w-1/2">
          {children}
        </div>
      </div>
    );
  }

  // Cuando el contenido dinámico está cargado, muestra el formulario en su posición normal
  return (
    <div className="flex h-screen">
      <div className="relative flex-col hidden w-1/2 p-10 text-white bg-black lg:flex">
        <div className="flex items-center text-lg font-medium">
          <Image
            src="/logo.webp"
            alt="Logo de Repify"
            width={40}
            height={40}
            className="mr-2"
            priority
          />
          Repify
        </div>
        <DynamicContent />
      </div>
      <div className="flex items-center justify-center w-full lg:w-1/2">
      <div className="absolute w-full top-1/3 right-10 lg:w-1/2">
        {children}
      </div>
    </div>
  );
}
