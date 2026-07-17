import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return formatDate(date)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getRiskLevelColor(level: string): string {
  switch (level) {
    case 'low':
      return 'text-green-500'
    case 'medium':
      return 'text-yellow-500'
    case 'high':
      return 'text-orange-500'
    case 'critical':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

export function getRiskLevelBg(level: string): string {
  switch (level) {
    case 'low':
      return 'bg-green-500/10 border-green-500/20'
    case 'medium':
      return 'bg-yellow-500/10 border-yellow-500/20'
    case 'high':
      return 'bg-orange-500/10 border-orange-500/20'
    case 'critical':
      return 'bg-red-500/10 border-red-500/20'
    default:
      return 'bg-gray-500/10 border-gray-500/20'
  }
}
