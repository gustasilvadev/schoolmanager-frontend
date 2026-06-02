import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Bell, CheckCircle2, Circle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProfile } from '@/hooks/useProfile'
import { useMarkAsViewed, useTeacherNotices } from '@/hooks/useNotices'
import type { NoticePriority } from '@/types/notice'

export const Route = createFileRoute('/teacher/avisos/')({
  component: AvisosPage,
})

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

const FILTER_TABS = [
  { key: 'all', label: 'Todos' },
  { key: 'unread', label: 'Não lidos' },
  { key: 'read', label: 'Lidos' },
] as const

type FilterTab = (typeof FILTER_TABS)[number]['key']

function AvisosPage() {
  const [filter, setFilter] = useState<FilterTab>('all')

  const { data: profile } = useProfile()
  const teacherId = profile?.teacher?.teacher_id

  const { data: notices = [], isLoading } = useTeacherNotices(teacherId)
  const { mutate: markViewed, isPending } = useMarkAsViewed()

  const unreadCount = notices.filter((n) => !n.viewed).length

  const filtered = notices.filter((n) => {
    if (filter === 'unread') return !n.viewed
    if (filter === 'read') return n.viewed
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10">
          <Bell className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Avisos</h1>
          <p className="text-xs text-slate-400">
            {unreadCount > 0
              ? `${unreadCount} não lido${unreadCount !== 1 ? 's' : ''}`
              : 'Todos os avisos lidos'}
          </p>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg border border-slate-700 bg-slate-800/50 p-1 w-fit">
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading || !teacherId ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-slate-700 bg-slate-800/50"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <Bell className="h-10 w-10 text-slate-700" />
          <p className="text-sm text-slate-500">Nenhum aviso encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notice) => (
            <div
              key={notice.notice_id}
              className={`rounded-xl border p-5 transition ${
                notice.viewed
                  ? 'border-slate-700/60 bg-slate-800/30'
                  : 'border-slate-600 bg-slate-800/70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  {notice.viewed ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                  )}
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium ${notice.viewed ? 'text-slate-400' : 'text-white'}`}
                    >
                      {notice.notice_title}
                    </p>
                    {notice.notice_date && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {new Date(notice.notice_date).toLocaleDateString(
                          'pt-BR',
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLE[notice.notice_priority]}`}
                >
                  {PRIORITY_LABEL[notice.notice_priority]}
                </span>
              </div>

              <p
                className={`mt-3 text-sm leading-relaxed ${notice.viewed ? 'text-slate-500' : 'text-slate-300'}`}
              >
                {notice.notice_content}
              </p>

              {!notice.viewed && (
                <div className="mt-4 flex justify-end border-t border-slate-700/50 pt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => markViewed(notice.notice_id)}
                    disabled={isPending}
                  >
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                    Marcar como lido
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
