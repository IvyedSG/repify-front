'use client';
import React from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
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

  // Group nav items logically
  const navSections = [
    {
      title: 'Proyectos',
      items: navItems.slice(0, 5), // Project-related items
    },
    {
      title: 'Perfil y Servicios',
      items: navItems.slice(5), // Profile and additional services
    },
  ];

  return (
    <aside
      className={cn(
        `relative hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
        <Link href={'/'} target="_blank">
          <Image
            src="/logo.webp"
            alt="Logo de Repify"
            width={40}
            height={40}
            className="mr-2"
            priority
          />
        </Link>
      </div>
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-10 z-50 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <div className="space-y-6 py-4">
        {navSections.map((section, index) => (
          <div key={index} className="space-y-4">
            <h3 className="px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="px-3 py-2">
              <DashboardNav items={section.items} />
            </div>
            {index < navSections.length - 1 && <hr className="mx-4 border-muted" />}
          </div>
        ))}
      </div>
    </aside>
  );
}
