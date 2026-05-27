import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listTeachers,
  getTeacherById,
  updateTeacherById,
} from '@/integrations/teachers/teachersApi'
import type { ListTeachersParams, UpdateTeacher } from '@/types/teacher'

export function useTeachers(params?: ListTeachersParams) {
  return useQuery({
    queryKey: ['teachers', params],
    queryFn: () => listTeachers(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useTeacher(id: number | undefined) {
  return useQuery({
    queryKey: ['teacher', id],
    queryFn: () => getTeacherById(id!),
    enabled: id !== undefined,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTeacher }) =>
      updateTeacherById(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}
