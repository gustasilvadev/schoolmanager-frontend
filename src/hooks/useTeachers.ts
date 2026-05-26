import { useQuery } from '@tanstack/react-query'
import { listTeachers } from '@/integrations/teachers/teachersApi'
import type { ListTeachersParams } from '@/types/teacher'

export function useTeachers(
  params?: ListTeachersParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['teachers', params],
    queryFn: () => listTeachers(params),
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  })
}
