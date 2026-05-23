import { cn } from '@/lib/utils'

const STATUS_MAP = {
  1: {
    label: 'Ativo',
    className: 'bg-green-500/10 text-green-400 border border-green-500/20',
  },
  0: {
    label: 'Inativo',
    className: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  },
  2: {
    label: 'Excluído',
    className: 'bg-red-500/10 text-red-400 border border-red-500/20',
  },
} as const

export function StatusBadge({ status }: { status: number }) {
  const config =
    status in STATUS_MAP
      ? STATUS_MAP[status as keyof typeof STATUS_MAP]
      : {
          label: 'Desconhecido',
          className:
            'bg-slate-500/10 text-slate-400 border border-slate-500/20',
        }
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
