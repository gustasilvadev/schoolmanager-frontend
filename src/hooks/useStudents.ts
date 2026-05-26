import { useQuery } from '@tanstack/react-query'
import { listStudents } from '@/integrations/students/studentsApi'
import type { ListStudentsParams } from '@/types/student'

export function useStudents(
  params?: ListStudentsParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => listStudents(params),
    staleTime: 3 * 60 * 1000,
    enabled: options?.enabled ?? true,
  })
}
