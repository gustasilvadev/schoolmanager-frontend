import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getClassDisciplines,
  addDisciplineToClass,
  removeDisciplineFromClass,
} from '@/integrations/classes/classesApi'

export function useAddDisciplinesToClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      classId,
      disciplineIds,
    }: {
      classId: number
      disciplineIds: number[]
    }) => {
      await Promise.all(disciplineIds.map((id) => addDisciplineToClass(classId, id)))
    },
    onSuccess: (_, { classId, disciplineIds }) => {
      void qc.invalidateQueries({ queryKey: ['class-disciplines', classId] })
      const n = disciplineIds.length
      toast.success(`${n} disciplina${n !== 1 ? 's' : ''} adicionada${n !== 1 ? 's' : ''} à turma`)
    },
    onError: (e: Error) => {
      console.error('[useAddDisciplinesToClass]', e.message)
      toast.error(e.message || 'Erro ao adicionar disciplinas')
    },
  })
}

export function useClassDisciplines(classId: number) {
  return useQuery({
    queryKey: ['class-disciplines', classId],
    queryFn: () => getClassDisciplines(classId),
    enabled: classId > 0,
    staleTime: 2 * 60 * 1000,
  })
}

export function useAddDisciplineToClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      classId,
      disciplineId,
    }: {
      classId: number
      disciplineId: number
    }) => addDisciplineToClass(classId, disciplineId),
    onSuccess: (_, { classId }) => {
      void qc.invalidateQueries({ queryKey: ['class-disciplines', classId] })
      toast.success('Disciplina adicionada à turma')
    },
    onError: (e: Error) => {
      console.error('[useAddDisciplineToClass]', e.message)
      toast.error(e.message || 'Erro ao adicionar disciplina')
    },
  })
}

export function useRemoveDisciplineFromClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      classId,
      disciplineId,
    }: {
      classId: number
      disciplineId: number
    }) => removeDisciplineFromClass(classId, disciplineId),
    onSuccess: (_, { classId }) => {
      void qc.invalidateQueries({ queryKey: ['class-disciplines', classId] })
      toast.success('Disciplina removida da turma')
    },
    onError: (e: Error) => {
      console.error('[useRemoveDisciplineFromClass]', e.message)
      toast.error(e.message || 'Erro ao remover disciplina')
    },
  })
}
