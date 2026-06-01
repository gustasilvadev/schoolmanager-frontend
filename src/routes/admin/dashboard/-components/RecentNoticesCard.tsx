import { Link } from '@tanstack/react-router'
import { Bell } from 'lucide-react'
import { useNotices } from '@/hooks/useNotices'
import type { NoticePriority } from '@/types/notice'

const PRIORITY_LABEL: Record<NoticePriority, string> = {
  1: 'Baixa',
  2: 'Média',
  3: 'Alta',
  4: 'Urgente',
}

const PRIORITY_STYLE: Record<NoticePriority, string> = {
  1: 'bg-slate-500/10 text-slate-400',
  2: 'bg-yellow-500/10 text-yellow-400',
  3: 'bg-orange-500/10 text-orange-400',
  4: 'bg-red-500/10 text-red-400',
}

export function RecentNoticesCard() {
  const { data, isLoading } = useNotices({ limit: 5, page: 1, notice_status: 1 })
  const notices = data?.notices ?? []

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50">
      <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Avisos Recentes</h2>
        </div>
        <Link
          to="/admin/avisos"
          className="text-xs text-blue-400 transition-colors hover:text-blue-300"
        >
          Ver todos
        </Link>
      </div>

      <div className="divide-y divide-slate-700/50">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 px-5 py-3.5"
            >
              <div className="h-3.5 w-40 animate-pulse rounded bg-slate-700" />
              <div className="h-5 w-14 animate-pulse rounded-full bg-slate-700" />
            </div>
          ))
        ) : notices.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-slate-500">
            Nenhum aviso ativo
          </p>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.notice_id}
              className="flex items-center justify-between gap-3 px-5 py-3.5"
            >
              <p className="line-clamp-1 text-sm font-medium text-white">
                {notice.notice_title}
              </p>
              <span
                className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLE[notice.notice_priority]}`}
              >
                {PRIORITY_LABEL[notice.notice_priority]}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
