import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardStatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  description?: string
  isLoading?: boolean
}

export function DashboardStatCard({
  label,
  value,
  icon: Icon,
  iconColor = 'text-blue-400',
  iconBg = 'bg-blue-600/10',
  description,
  isLoading,
}: DashboardStatCardProps) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-slate-400">{label}</p>
          {isLoading ? (
            <div className="h-9 w-16 animate-pulse rounded-md bg-slate-700" />
          ) : (
            <p className="text-3xl font-bold text-white">{value}</p>
          )}
          {description && (
            <p className="text-xs text-slate-500">{description}</p>
          )}
        </div>
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            iconBg,
          )}
        >
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
      </div>
    </div>
  )
}
