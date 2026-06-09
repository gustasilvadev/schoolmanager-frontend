import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Bell, Search } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import {
  useMarkNoticeAsViewed,
  useTeacherNotices,
} from '@/hooks/useNotices'
import { isPublicNotice } from '@/utils/noticeFormatters'
import { TeacherNoticeCard } from './-components/TeacherNoticeCard'
import type { TeacherNotice } from '@/types/notice'

export const Route = createFileRoute('/teacher/avisos/')({
  component: TeacherAvisosPage,
})

type FilterType = 'all' | 'unread' | 'read'

function TeacherAvisosPage() {
  const { session } = useAuth()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [expandedNoticeId, setExpandedNoticeId] = useState<number | null>(null)

  const teacherId = session?.teacherId

  const { data, isLoading, isError } = useTeacherNotices(teacherId)
  const { mutate: markAsViewed, isPending: isMarkingAsViewed } =
    useMarkNoticeAsViewed()

  const notices = data ?? []

  const filteredNotices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return notices.filter((notice) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        notice.notice_title.toLowerCase().includes(normalizedSearch) ||
        notice.notice_content.toLowerCase().includes(normalizedSearch)

      const isPublic = isPublicNotice(notice)
      const matchesFilter =
        filter === 'all' ||
        (filter === 'unread' && !isPublic && !notice.viewed) ||
        (filter === 'read' && !isPublic && notice.viewed)

      return matchesSearch && matchesFilter
    })
  }, [notices, search, filter])

  const unreadCount = notices.filter((notice) => !isPublicNotice(notice) && !notice.viewed).length

  useEffect(() => {
    if (isError) toast.error('Erro ao carregar avisos')
  }, [isError])

  function handleToggle(notice: TeacherNotice) {
    const nextExpandedId =
      expandedNoticeId === notice.notice_id ? null : notice.notice_id

    setExpandedNoticeId(nextExpandedId)
  }

  function handleMarkAsViewed(notice: TeacherNotice) {
    if (notice.viewed) return

    markAsViewed(notice.notice_id)
  }

  if (session?.role !== 'TEACHER') {
    return (
      <div className="rounded-xl border border-slate-800 p-6">
        <p className="text-sm text-slate-400">
          Esta área é exclusiva para professores.
        </p>
      </div>
    )
  }

  if (!teacherId) {
    return (
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-6">
        <p className="text-sm text-yellow-300">
          Não foi possível identificar seu perfil de professor. Faça logout e
          login novamente para atualizar sua sessão.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10">
            <Bell className="h-5 w-5 text-blue-400" />
          </div>

          <div>
            <h1 className="text-lg font-semibold text-white">Meus avisos</h1>
            <p className="text-xs text-slate-400">
              {unreadCount > 0
                ? `${unreadCount} aviso${unreadCount !== 1 ? 's' : ''} não lido${
                    unreadCount !== 1 ? 's' : ''
                  }`
                : 'Nenhum aviso pendente'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_180px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por título ou conteúdo..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as FilterType)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">Todos</option>
          <option value="unread">Não lidos</option>
          <option value="read">Lidos</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-slate-800">
          <p className="text-sm text-slate-500">Carregando avisos...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-slate-800">
          <p className="text-sm text-slate-500">Nenhum aviso encontrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotices.map((notice) => (
            <TeacherNoticeCard
              key={notice.notice_id}
              notice={notice}
              expanded={expandedNoticeId === notice.notice_id}
              isMarkingAsViewed={isMarkingAsViewed}
              onToggle={handleToggle}
              onMarkAsViewed={handleMarkAsViewed}
            />
          ))}
        </div>
      )}
    </div>
  )
}