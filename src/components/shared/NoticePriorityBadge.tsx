import { cn } from '@/lib/utils'
import type { NoticePriority } from '@/types/notice'

const PRIORITY_MAP: Record<NoticePriority, { label: string; className: string }> =
  {
    1: {
      label: 'Baixa',
      className: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
    },
    2: {
      label: 'Média',
      className: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    },
    3: {
      label: 'Alta',
      className: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    },
    4: {
      label: 'Urgente',
      className: 'bg-red-500/10 text-red-400 border border-red-500/20',
    },
  }

export function NoticePriorityBadge({
  priority,
}: {
  priority: NoticePriority
}) {
  const config = PRIORITY_MAP[priority]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
      )}
    >
      {config.label}
    </span>
  )
}
