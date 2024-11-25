'use client';
import React from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import Link from 'next/link';
import Image from 'next/image';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  const handleToggle = () => {
    toggle();
  };

  const navSections = [
    {
      title: 'Proyectos',
      items: navItems.slice(0, 5), 
    },
    {
      title: 'Perfil y Servicios',
      items: navItems.slice(5), 
    },
  ];

  return (
    <aside
      className={cn(
        `relative hidden h-screen border-r bg-card transition-all duration-300 ease-in-out md:block`,
        isMinimized ? 'w-[60px]' : 'w-64',
        className
      )}
    >
      <div className={cn("flex items-center justify-center p-4", isMinimized ? "py-4" : "py-6")}>
        <Link href={'/'} target="_blank">
          <Image
            src="/logo.webp"
            alt="Logo de Repify"
            width={isMinimized ? 32 : 40}
            height={isMinimized ? 32 : 40}
            className="transition-all duration-300 ease-in-out"
            priority
          />
        </Link>
      </div>
      <div
        className={cn(
          'absolute -right-4 top-20 z-50 flex h-8 w-8 items-center justify-center rounded-full border bg-background text-foreground cursor-pointer',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      >
        {isMinimized ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </div>
      <div className="space-y-4 py-4">
        {navSections.map((section, index) => (
          <div key={index} className="space-y-2">
            {!isMinimized && (
              <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="px-3 py-1">
              <DashboardNav items={section.items} />
            </div>
            {index < navSections.length - 1 && !isMinimized && <hr className="mx-4 border-muted" />}
          </div>
        ))}
      </div>
    </aside>
  );
}

