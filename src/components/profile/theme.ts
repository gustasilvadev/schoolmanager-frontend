export type Accent = 'blue' | 'emerald'

export const ROLE_LABEL = {
  ADMIN: 'Administrador',
  TEACHER: 'Professor',
} as const

export const ACCENT: Record<
  Accent,
  { avatar: string; badge: string; divider: string }
> = {
  blue: {
    avatar: 'bg-blue-600',
    badge: 'bg-blue-600/20 text-blue-300 border border-blue-600/30',
    divider: 'bg-blue-600/30',
  },
  emerald: {
    avatar: 'bg-emerald-600',
    badge: 'bg-emerald-600/20 text-emerald-300 border border-emerald-600/30',
    divider: 'bg-emerald-600/30',
  },
}
