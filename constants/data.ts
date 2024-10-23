import { NavItem } from '@/types';


export const navItems: NavItem[] = [
  {
    title: 'Explorar Proyectos',
    href: '/projects',
    icon: 'dashboard',
    label: 'Proyectos'
  },
  {
    title: 'Mis Solicitudes',
    href: '/projects/aplications',
    icon: 'solicitudes',
    label: 'Solicitudes'
  },
  {
    title: 'Proyectos Activos',
    href: '/projects/teams',
    icon: 'equipo',
    label: 'Mis Equipos'
  },
  {
    title: 'Logros',
    href: '/projects/records',
    icon: 'records',
    label: 'Mis Records'
  },
  {
    title: 'Perfil',
    href: '/projects/profiles',
    icon: 'perfil',
    label: 'Mi Perfil'
  },
];