import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  listDisciplines,
  createDiscipline,
  updateDiscipline,
  deleteDiscipline,
  restoreDiscipline,
} from '@/integrations/classes/disciplinesApi'
import type { ListDisciplinesParams } from '@/types/classes'

export function useDisciplines(
  params?: ListDisciplinesParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['disciplines', params],
    queryFn: () => listDisciplines(params),
    enabled: options?.enabled ?? true,
    staleTime: 3 * 60 * 1000,
  })
}

export function useCreateDiscipline() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createDiscipline,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['disciplines'] })
      toast.success('Disciplina criada com sucesso')
    },
    onError: (e: Error) => {
      console.error('[useCreateDiscipline]', e.message)
      toast.error(e.message || 'Erro ao criar disciplina')
    },
  })
}

export function useUpdateDiscipline() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<{
        discipline_name: string
        discipline_hour: number
        discipline_status: number
      }>
    }) => updateDiscipline(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['disciplines'] })
      toast.success('Disciplina atualizada com sucesso')
    },
    onError: (e: Error) => {
      console.error('[useUpdateDiscipline]', e.message)
      toast.error(e.message || 'Erro ao atualizar disciplina')
    },
  })
}

export function useDeleteDiscipline() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteDiscipline,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['disciplines'] })
      toast.success('Disciplina excluída com sucesso')
    },
    onError: (e: Error) => {
      console.error('[useDeleteDiscipline]', e.message)
      toast.error(e.message || 'Erro ao excluir disciplina')
    },
  })
}

export function useRestoreDiscipline() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: restoreDiscipline,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['disciplines'] })
      toast.success('Disciplina restaurada com sucesso')
    },
    onError: (e: Error) => {
      console.error('[useRestoreDiscipline]', e.message)
      toast.error(e.message || 'Erro ao restaurar disciplina')
    },
  })
}
