import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getTeacherDisciplines,
  associateDiscipline,
  removeDisciplineAssociation,
} from '@/integrations/teachers/teachersApi'

export function useTeacherDisciplines(
  teacherId: number,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['teacher-disciplines', teacherId],
    queryFn: () => getTeacherDisciplines(teacherId),
    enabled: (options?.enabled ?? true) && teacherId > 0,
    staleTime: 2 * 60 * 1000,
  })
}

export function useAssociateDiscipline() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      teacherId,
      disciplineId,
    }: {
      teacherId: number
      disciplineId: number
    }) => associateDiscipline(teacherId, disciplineId),
    onSuccess: (_, { teacherId }) => {
      void qc.invalidateQueries({ queryKey: ['teacher-disciplines', teacherId] })
      toast.success('Disciplina vinculada com sucesso')
    },
    onError: (e: Error) => {
      console.error('[useAssociateDiscipline]', e.message)
      toast.error(e.message || 'Erro ao vincular disciplina')
    },
  })
}

export function useRemoveTeacherDiscipline() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      teacherId,
      disciplineId,
    }: {
      teacherId: number
      disciplineId: number
    }) => removeDisciplineAssociation(teacherId, disciplineId),
    onSuccess: (_, { teacherId }) => {
      void qc.invalidateQueries({ queryKey: ['teacher-disciplines', teacherId] })
      toast.success('Disciplina desvinculada')
    },
    onError: (e: Error) => {
      console.error('[useRemoveTeacherDiscipline]', e.message)
      toast.error(e.message || 'Erro ao desvincular disciplina')
    },
  })
}
