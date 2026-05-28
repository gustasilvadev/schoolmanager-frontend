import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listTeachers,
  getTeacherById,
  updateTeacherById,
} from '@/integrations/teachers/teachersApi'
import { createUser } from '@/integrations/users/usersApi'
import type { ListTeachersParams, UpdateTeacher } from '@/types/teacher'
import type { CreateUserTeacherPayload } from '@/types/user'

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
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      queryClient.invalidateQueries({ queryKey: ['teacher', id] })
    },
    onError: (error) => {
      console.error('[useUpdateTeacher]', error)
    },
  })
}

export function useCreateTeacher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserTeacherPayload) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
    onError: (error) => {
      console.error('[useCreateTeacher]', error)
    },
  })
}
