import { cn } from '@/lib/utils'
import type { NoticeItem } from '@/types/notice'

interface NoticeVisibilityBadgeProps {
  notice: NoticeItem
}

export function getNoticeVisibilityLabel(notice: NoticeItem) {
  const visibilities = notice.notice_visibilities ?? []

  return visibilities.length > 0 ? 'Restrita' : 'Pública'
}

export function NoticeVisibilityBadge({ notice }: NoticeVisibilityBadgeProps) {
  const label = getNoticeVisibilityLabel(notice)
  const isRestricted = label === 'Restrita'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        isRestricted
          ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      )}
    >
      {label}
    </span>
  )
}
