import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteNotice, listNotices, restoreNotice } from '@/integrations/notices/noticesApi'
import type { ListNoticesParams } from '@/types/notice'
import { toast } from 'sonner'

export function useNotices(params?: ListNoticesParams) {
  return useQuery({
    queryKey: ['notices', params],
    queryFn: () => listNotices(params),
    staleTime: 3 * 60 * 1000,
    retry: false,
  })
}

export function useDeleteNotice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteNotice,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['notices'] })
      toast.success('Aviso excluído com sucesso')
    },
    onError: (error: Error) => {
      console.error('[useDeleteNotice]', error.message)
      toast.error(error.message || 'Erro ao excluir aviso')
    },
  })
}

export function useRestoreNotice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: restoreNotice,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['notices'] })
      toast.success('Aviso restaurado com sucesso')
    },
    onError: (error: Error) => {
      console.error('[useRestoreNotice]', error.message)
      toast.error(error.message || 'Erro ao restaurar aviso')
    },
  })
}