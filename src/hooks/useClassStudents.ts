import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getClassStudents,
  enrollStudent,
  unenrollStudent,
} from '@/integrations/classes/classesApi'

export function useEnrollStudents() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      classId,
      studentIds,
    }: {
      classId: number
      studentIds: number[]
    }) => {
      await Promise.all(studentIds.map((id) => enrollStudent(classId, id)))
    },
    onSuccess: (_, { classId, studentIds }) => {
      void qc.invalidateQueries({ queryKey: ['class-students', classId] })
      toast.success(
        `${studentIds.length} aluno${studentIds.length !== 1 ? 's' : ''} matriculado${studentIds.length !== 1 ? 's' : ''} com sucesso`,
      )
    },
    onError: (e: Error) => {
      console.error('[useEnrollStudents]', e.message)
      toast.error(e.message || 'Erro ao matricular alunos')
    },
  })
}

export function useClassStudents(classId: number) {
  return useQuery({
    queryKey: ['class-students', classId],
    queryFn: () => getClassStudents(classId),
    enabled: classId > 0,
    staleTime: 2 * 60 * 1000,
  })
}

export function useUnenrollStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      classId,
      studentId,
    }: {
      classId: number
      studentId: number
    }) => unenrollStudent(classId, studentId),
    onSuccess: (_, { classId }) => {
      void qc.invalidateQueries({ queryKey: ['class-students', classId] })
      toast.success('Aluno removido da turma')
    },
    onError: (e: Error) => {
      console.error('[useUnenrollStudent]', e.message)
      toast.error(e.message || 'Erro ao remover aluno')
    },
  })
}
