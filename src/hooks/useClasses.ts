import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  listClasses,
  createClass,
  updateClass,
  deleteClass,
  restoreClass,
} from '@/integrations/classes/classesApi'
import type { ListClassesParams } from '@/types/classes'

export function useClasses(params?: ListClassesParams) {
  return useQuery({
    queryKey: ['classes', params],
    queryFn: () => listClasses(params),
    staleTime: 3 * 60 * 1000,
  })
}

export function useCreateClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['classes'] })
      toast.success('Turma criada com sucesso')
    },
    onError: (e: Error) => {
      console.error('[useCreateClass]', e.message)
      toast.error(e.message || 'Erro ao criar turma')
    },
  })
}

export function useUpdateClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<{
        class_name: string
        class_school_year: string
        class_status: number
      }>
    }) => updateClass(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['classes'] })
      toast.success('Turma atualizada com sucesso')
    },
    onError: (e: Error) => {
      console.error('[useUpdateClass]', e.message)
      toast.error(e.message || 'Erro ao atualizar turma')
    },
  })
}

export function useDeleteClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['classes'] })
      toast.success('Turma excluída com sucesso')
    },
    onError: (e: Error) => {
      console.error('[useDeleteClass]', e.message)
      toast.error(e.message || 'Erro ao excluir turma')
    },
  })
}

export function useRestoreClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: restoreClass,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['classes'] })
      toast.success('Turma restaurada com sucesso')
    },
    onError: (e: Error) => {
      console.error('[useRestoreClass]', e.message)
      toast.error(e.message || 'Erro ao restaurar turma')
    },
  })
}
