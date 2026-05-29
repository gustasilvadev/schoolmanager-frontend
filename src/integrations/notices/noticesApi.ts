import { create } from '@/lib/api'
import type { ListNoticesParams, ListNoticesResponse } from '@/types/notice'

const api = create('notices')

export async function listNotices(
  params?: ListNoticesParams,
): Promise<ListNoticesResponse> {
  const { data } = await api.get<ListNoticesResponse>('/listNotices', {
    params,
  })

  return data
}

export async function deleteNotice(id: number): Promise<void> {
  await api.delete(`/deleteNoticeById/${id}`)
}

export async function restoreNotice(id: number): Promise<void> {
  await api.post(`/restoreNoticeById/${id}`)
}