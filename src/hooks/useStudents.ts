import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listStudents,
  createStudent,
  updateStudent,
} from '@/integrations/students/studentsApi'
import type {
  ListStudentsParams,
  CreateStudentPayload,
  UpdateStudentPayload,
} from '@/types/student'

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

export function useCreateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateStudentPayload) => createStudent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
    onError: (error) => {
      console.error('[useCreateStudent]', error)
    },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateStudentPayload }) =>
      updateStudent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
    onError: (error) => {
      console.error('[useUpdateStudent]', error)
    },
  })
}
