import { useQuery } from '@tanstack/react-query'
import { listTeachers } from '@/integrations/teachers/teachersApi'
import type { ListTeachersParams } from '@/types/teacher'

export function useTeachers(params?: ListTeachersParams) {
  return useQuery({
    queryKey: ['teachers', params],
    queryFn: () => listTeachers(params),
  })
}
