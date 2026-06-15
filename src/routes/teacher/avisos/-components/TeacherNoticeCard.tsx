import { Bell, CheckCheck, ChevronDown, ChevronUp, Mail, MailOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NoticePriorityBadge } from '@/components/shared/NoticePriorityBadge'
import { cn } from '@/lib/utils'
import { formatNoticeDate, isPublicNotice } from '@/utils/noticeFormatters'
import type { TeacherNotice } from '@/types/notice'

interface TeacherNoticeCardProps {
  notice: TeacherNotice
  expanded: boolean
  isMarkingAsViewed: boolean
  onToggle: (notice: TeacherNotice) => void
  onMarkAsViewed: (notice: TeacherNotice) => void
}

export function TeacherNoticeCard({
  notice,
  expanded,
  isMarkingAsViewed,
  onToggle,
  onMarkAsViewed,
}: TeacherNoticeCardProps) {
  const isPublic = isPublicNotice(notice)
  const isUnread = !isPublic && !notice.viewed

  return (
    <article
      className={cn(
        'rounded-2xl border bg-slate-900/60 transition',
        isUnread ? 'border-blue-500/40 bg-blue-500/5' : 'border-slate-800',
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(notice)}
        className="flex w-full cursor-pointer items-start justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex min-w-0 gap-3">
          <div
            className={cn(
              'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
              isUnread ? 'bg-blue-600/10' : 'bg-slate-800',
            )}
          >
            {isPublic ? (
              <Bell className="h-4 w-4 text-slate-400" />
            ) : notice.viewed ? (
              <MailOpen className="h-4 w-4 text-slate-400" />
            ) : (
              <Mail className="h-4 w-4 text-blue-400" />
            )}
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {isUnread && (
                <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                  Não lido
                </span>
              )}

              <NoticePriorityBadge priority={notice.notice_priority} />

              <span className="text-xs text-slate-500">
                {formatNoticeDate(notice.notice_date)}
              </span>
            </div>

            <h2 className="truncate text-sm font-semibold text-white">
              {notice.notice_title}
            </h2>

            {!expanded && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                {notice.notice_content}
              </p>
            )}
          </div>
        </div>

        <div className="mt-1 shrink-0 text-slate-500">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-800 px-5 py-4">
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
            {notice.notice_content}
          </p>

          {isUnread && (
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                size="sm"
                onClick={() => onMarkAsViewed(notice)}
                disabled={isMarkingAsViewed}
              >
                <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
                {isMarkingAsViewed ? 'Marcando...' : 'Marcar como lido'}
              </Button>
            </div>
          )}
        </div>
      )}
    </article>
  )
}
