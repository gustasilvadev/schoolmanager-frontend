import { Link } from '@tanstack/react-router'
import { School } from 'lucide-react'
import { useClasses } from '@/hooks/useClasses'

export function RecentClassesCard() {
  const { data, isLoading } = useClasses({ limit: 5, page: 1 })
  const classes = data?.classes ?? []

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50">
      <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
        <div className="flex items-center gap-2">
          <School className="h-4 w-4 text-violet-400" />
          <h2 className="text-sm font-semibold text-white">Turmas Recentes</h2>
        </div>
        <Link
          to="/admin/turmas"
          className="text-xs text-blue-400 transition-colors hover:text-blue-300"
        >
          Ver todas
        </Link>
      </div>

      <div className="divide-y divide-slate-700/50">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <div className="space-y-1.5">
                <div className="h-3.5 w-32 animate-pulse rounded bg-slate-700" />
                <div className="h-3 w-20 animate-pulse rounded bg-slate-700/60" />
              </div>
              <div className="h-5 w-14 animate-pulse rounded-full bg-slate-700" />
            </div>
          ))
        ) : classes.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-slate-500">
            Nenhuma turma cadastrada
          </p>
        ) : (
          classes.map((cls) => (
            <div
              key={cls.class_id}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {cls.class_name}
                </p>
                <p className="text-xs text-slate-500">{cls.class_school_year}</p>
              </div>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  cls.class_status === 1
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-slate-500/10 text-slate-400'
                }`}
              >
                {cls.class_status === 1 ? 'Ativa' : 'Inativa'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
