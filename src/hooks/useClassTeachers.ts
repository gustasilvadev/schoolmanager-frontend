import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getClassTeachers,
  assignTeacher,
  unassignTeacher,
} from '@/integrations/classes/classesApi'

export function useAssignTeachers() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      classId,
      teacherIds,
    }: {
      classId: number
      teacherIds: number[]
    }) => {
      await Promise.all(teacherIds.map((id) => assignTeacher(classId, id)))
    },
    onSuccess: (_, { classId, teacherIds }) => {
      void qc.invalidateQueries({ queryKey: ['class-teachers', classId] })
      toast.success(
        `${teacherIds.length} professor${teacherIds.length !== 1 ? 'es' : ''} associado${teacherIds.length !== 1 ? 's' : ''} com sucesso`,
      )
    },
    onError: (e: Error) => {
      console.error('[useAssignTeachers]', e.message)
      toast.error(e.message || 'Erro ao associar professores')
    },
  })
}

export function useClassTeachers(classId: number) {
  return useQuery({
    queryKey: ['class-teachers', classId],
    queryFn: () => getClassTeachers(classId),
    enabled: classId > 0,
    staleTime: 2 * 60 * 1000,
  })
}

export function useUnassignTeacher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      classId,
      teacherId,
    }: {
      classId: number
      teacherId: number
    }) => unassignTeacher(classId, teacherId),
    onSuccess: (_, { classId }) => {
      void qc.invalidateQueries({ queryKey: ['class-teachers', classId] })
      toast.success('Professor removido da turma')
    },
    onError: (e: Error) => {
      console.error('[useUnassignTeacher]', e.message)
      toast.error(e.message || 'Erro ao remover professor')
    },
  })
}
