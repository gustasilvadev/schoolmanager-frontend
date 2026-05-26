import { create } from '@/lib/api'
import type { ListStudentsParams, ListStudentsResponse } from '@/types/student'

const api = create('students')

export async function listStudents(
  params?: ListStudentsParams,
): Promise<ListStudentsResponse> {
  const { data } = await api.get<ListStudentsResponse>('/listStudents', {
    params,
  })
  return data
}
