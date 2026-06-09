import type { NoticeItem } from '@/types/notice'

export function isPublicNotice(notice: Pick<NoticeItem, 'notice_visibilities'>): boolean {
  return (notice.notice_visibilities?.length ?? 0) === 0
}

export function formatNoticeDate(value: string | null): string {
  if (!value) return '—'

  return new Date(value).toLocaleDateString('pt-BR', {
    timeZone: 'UTC',
  })
}

export function getNoticeReadersInfo(notice: NoticeItem): {
  read: number
  total: number
} {
  const visibilities = notice.notice_visibilities ?? []

  if (visibilities.length === 0) {
    return { read: 0, total: 0 }
  }

  return {
    read: visibilities.filter((visibility) =>
      Boolean(visibility.notice_visibility_viewed_in),
    ).length,
    total: visibilities.length,
  }
}
