export type NoticeStatus = 0 | 1 | 2

export type NoticePriority = 1 | 2 | 3 | 4

export interface NoticeVisibility {
  notice_visibility_id: number
  notice_id: number
  teacher_id: number
  notice_visibility_viewed_in: string | null
}

export interface NoticeItem {
  notice_id: number
  notice_title: string
  notice_content: string
  notice_date: string | null
  notice_status: NoticeStatus
  notice_priority: NoticePriority
  notice_visibilities?: NoticeVisibility[]
}

export interface ListNoticesParams {
  page?: number
  limit?: number
  notice_title?: string
  notice_status?: NoticeStatus
  includeDeleted?: boolean
  notice_priority?: NoticePriority
}

export interface ListNoticesResponse {
  notices: NoticeItem[]
  total: number
  page: number
  limit: number
}

export interface CreateNoticePayload {
  notice_title: string
  notice_content: string
  notice_date?: string | null
  notice_status?: NoticeStatus
  notice_priority: NoticePriority
  teacher_ids?: number[]
}

export interface UpdateNoticePayload {
  notice_title?: string
  notice_content?: string
  notice_date?: string | null
  notice_status?: NoticeStatus
  notice_priority?: NoticePriority
  teacher_ids?: number[]
}