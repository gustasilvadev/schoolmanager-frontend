import type { ReactNode } from 'react'

interface InfoRowProps {
  icon: ReactNode
  label: string
  value: ReactNode
}

export function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 shrink-0 text-slate-500">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500">{label}</p>
        <div className="mt-0.5 text-sm text-white">{value}</div>
      </div>
    </div>
  )
}
