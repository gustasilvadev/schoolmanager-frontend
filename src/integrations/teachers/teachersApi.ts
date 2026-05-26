import { create } from '@/lib/api'
import type { ListTeachersParams, ListTeachersResponse } from '@/types/teacher'

const api = create('teachers')

export async function listTeachers(
  params?: ListTeachersParams,
): Promise<ListTeachersResponse> {
  const { data } = await api.get<ListTeachersResponse>('/listTeachers', {
    params,
  })
  return data
}
