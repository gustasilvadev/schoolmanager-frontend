import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ACCENT } from './theme'
import type { Accent } from './theme'

interface ProfileCardProps {
  icon: ReactNode
  title: string
  accent: Accent
  children: ReactNode
}

export function ProfileCard({
  icon,
  title,
  accent,
  children,
}: ProfileCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-slate-400">{icon}</span>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      <div className={cn('mb-4 h-px', ACCENT[accent].divider)} />
      {children}
    </div>
  )
}
