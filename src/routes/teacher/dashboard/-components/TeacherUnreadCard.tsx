import { Bell } from 'lucide-react'
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

interface TeacherUnreadCardProps {
  teacherId: number
}

export function TeacherUnreadCard({ teacherId }: TeacherUnreadCardProps) {
  const { data: notices = [], isLoading } = useTeacherNotices(teacherId)

  const unread = notices.filter((n) => !n.viewed).slice(0, 3)
  const unreadTotal = notices.filter((n) => !n.viewed).length

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50">
      <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Avisos Não Lidos</h2>
        </div>
        {!isLoading && unreadTotal > 0 && (
          <span className="rounded-full bg-blue-600/10 px-2 py-0.5 text-xs font-semibold text-blue-400">
            {unreadTotal}
          </span>
        )}
      </div>

      <div className="divide-y divide-slate-700/50">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 px-5 py-3.5"
            >
              <div className="h-3.5 w-44 animate-pulse rounded bg-slate-700" />
              <div className="h-5 w-14 animate-pulse rounded-full bg-slate-700" />
            </div>
          ))
        ) : unread.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-8">
            <Bell className="h-8 w-8 text-slate-700" />
            <p className="text-sm text-slate-500">Todos os avisos foram lidos</p>
          </div>
        ) : (
          unread.map((notice) => (
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
