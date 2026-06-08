import { CalendarDays, Eye, ShieldCheck, Users, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { NoticePriorityBadge } from './NoticePriorityBadge'
import {
  getNoticeVisibilityLabel,
  NoticeVisibilityBadge,
} from './NoticeVisibilityBadge'
import type { NoticeItem } from '@/types/notice'

interface AdminNoticeDetailsModalProps {
  open: boolean
  notice: NoticeItem | null
  teacherNameById: Map<number, string>
  onClose: () => void
}

function formatDate(value: string | null) {
  if (!value) return '—'

  return new Date(value).toLocaleDateString('pt-BR', {
    timeZone: 'UTC',
  })
}

function getReadersInfo(notice: NoticeItem) {
  const visibilities = notice.notice_visibilities ?? []

  if (visibilities.length === 0) {
    return {
      read: 0,
      total: 0,
    }
  }

  return {
    read: visibilities.filter((visibility) =>
      Boolean(visibility.notice_visibility_viewed_in),
    ).length,
    total: visibilities.length,
  }
}

export function AdminNoticeDetailsModal({
  open,
  notice,
  teacherNameById,
  onClose,
}: AdminNoticeDetailsModalProps) {
  if (!open || !notice) return null

  const visibilityLabel = getNoticeVisibilityLabel(notice)
  const visibilities = notice.notice_visibilities ?? []
  const readers = getReadersInfo(notice)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">
                Aviso completo
              </h2>
              <p className="text-xs text-slate-400">
                Visualização completa do comunicado.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-73px)] space-y-6 overflow-y-auto px-6 py-5">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={notice.notice_status} />
              <NoticePriorityBadge priority={notice.notice_priority} />
              <NoticeVisibilityBadge notice={notice} />
            </div>

            <h3 className="text-xl font-semibold leading-7 text-white">
              {notice.notice_title}
            </h3>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">
              {notice.notice_content}
            </p>
          </div>

          <div className="space-y-3 border-t border-slate-800 pt-5">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <CalendarDays className="h-4 w-4 text-slate-500" />
              <span>Data de publicação: {formatDate(notice.notice_date)}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-400">
              <ShieldCheck className="h-4 w-4 text-slate-500" />
              <span>Prioridade:</span>
              <NoticePriorityBadge priority={notice.notice_priority} />
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Users className="h-4 w-4 text-slate-500" />
              <span>Visibilidade:</span>
              <NoticeVisibilityBadge notice={notice} />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-5">
            <p className="text-sm font-medium text-white">Quem pode visualizar</p>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              {visibilityLabel === 'Pública'
                ? 'Aviso público, visível para todos os professores.'
                : 'Aviso restrito aos professores selecionados.'}
            </p>

            {visibilities.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Professores selecionados ({visibilities.length})
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {visibilities.map((visibility) => (
                    <div
                      key={visibility.notice_visibility_id}
                      className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2"
                    >
                      <p className="text-sm font-medium text-slate-200">
                        {teacherNameById.get(visibility.teacher_id) ??
                          `Professor #${visibility.teacher_id}`}
                      </p>
                      <p className="text-xs text-slate-500">
                        Vinculado ao aviso
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 pt-5">
            <p className="text-sm font-medium text-white">Leitores</p>

            <p className="mt-1 text-sm text-slate-400">
              {readers.total > 0
                ? `${readers.read} de ${readers.total} professores visualizaram este aviso.`
                : 'Ainda não há leitura registrada para este aviso.'}
            </p>
          </div>

          <div className="flex justify-end border-t border-slate-800 pt-5">
            <Button type="button" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
