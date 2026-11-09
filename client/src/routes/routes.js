import { Home, BookOpen, Sprout, Wallet, Gamepad2, Settings } from 'lucide-react';

export const ROUTES = [
  {
    id: 'home',
    label: 'Home',
    title: 'Portal',
    icon: Home,
    description: 'Daily portal, quests, and trainer overview',
  },
  {
    id: 'journal',
    label: 'Journal',
    title: 'Dear Diary',
    icon: BookOpen,
    description: 'Personal chronicle and writing prompts',
  },
  {
    id: 'routines',
    label: 'Routines',
    title: 'Daily Care',
    icon: Sprout,
    description: 'Gym check-in, nutrition, water intake, wellness',
  },
  {
    id: 'finance',
    label: 'Finance',
    title: 'Money Map',
    icon: Wallet,
    description: 'Salary, monthly budget, spending, recurring bills',
  },
  {
    id: 'pokedex',
    label: 'Pokédex',
    title: 'Kanto Guide',
    icon: Gamepad2,
    description: 'Pokémon collection, companion selection, and Pokédex',
  },
  {
    id: 'settings',
    label: 'Settings',
    title: 'Settings',
    icon: Settings,
    description: 'Privacy, data export, theme, reset',
  },
];

export function getRouteById(id) {
  return ROUTES.find((route) => route.id === id) || ROUTES[0];
}

export default ROUTES;

