import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(date: Date, language: 'en' | 'fr' = 'en'): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const translations = {
    en: {
      justNow: "Just now",
      minutesAgo: (m: number) => `${m}m ago`,
      hoursAgo: (h: number) => `${h}h ago`,
      daysAgo: (d: number) => `${d}d ago`,
    },
    fr: {
      justNow: "À l'instant",
      minutesAgo: (m: number) => `Il y a ${m} min`,
      hoursAgo: (h: number) => `Il y a ${h}h`,
      daysAgo: (d: number) => `Il y a ${d}j`,
    },
  };

  const t = translations[language];

  if (seconds < 60) return t.justNow;
  if (seconds < 3600) return t.minutesAgo(Math.floor(seconds / 60));
  if (seconds < 86400) return t.hoursAgo(Math.floor(seconds / 3600));
  if (seconds < 604800) return t.daysAgo(Math.floor(seconds / 86400));
  
  return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US');
}

export function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

