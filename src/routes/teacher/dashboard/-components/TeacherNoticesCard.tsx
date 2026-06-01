import { Bell, CheckCircle2, Circle } from 'lucide-react'
import { useTeacherNotices } from '@/hooks/useNotices'
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

interface TeacherNoticesCardProps {
  teacherId: number
}

export function TeacherNoticesCard({ teacherId }: TeacherNoticesCardProps) {
  const { data: notices = [], isLoading } = useTeacherNotices(teacherId)

  const recent = notices.slice(0, 6)

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50">
      <div className="flex items-center gap-2 border-b border-slate-700 px-5 py-4">
        <Bell className="h-4 w-4 text-blue-400" />
        <h2 className="text-sm font-semibold text-white">Meus Avisos</h2>
      </div>

      <div className="divide-y divide-slate-700/50">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 px-5 py-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-pulse rounded-full bg-slate-700" />
                <div className="h-3.5 w-40 animate-pulse rounded bg-slate-700" />
              </div>
              <div className="h-5 w-14 animate-pulse rounded-full bg-slate-700" />
            </div>
          ))
        ) : recent.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-slate-500">
            Nenhum aviso disponível
          </p>
        ) : (
          recent.map((notice) => (
            <div
              key={notice.notice_id}
              className="flex items-center justify-between gap-3 px-5 py-3.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                {notice.viewed ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-slate-500" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-blue-400" />
                )}
                <p
                  className={`line-clamp-1 text-sm ${
                    notice.viewed
                      ? 'text-slate-400'
                      : 'font-medium text-white'
                  }`}
                >
                  {notice.notice_title}
                </p>
              </div>
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
