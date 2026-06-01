import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createNotice,
  deleteNotice,
  getNoticeById,
  getNoticesForTeacher,
  listNotices,
  restoreNotice,
  updateNotice,
} from '@/integrations/notices/noticesApi'
import type {
  CreateNoticePayload,
  ListNoticesParams,
  UpdateNoticePayload,
} from '@/types/notice'
import { toast } from 'sonner'

export function useTeacherNotices(teacherId: number | undefined) {
  return useQuery({
    queryKey: ['notices', 'teacher', teacherId],
    queryFn: () => getNoticesForTeacher(teacherId!),
    enabled: !!teacherId,
    staleTime: 3 * 60 * 1000,
    retry: false,
  })
}

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

export function useNotice(id?: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['notices', id],
    queryFn: () => getNoticeById(id as number),
    enabled: Boolean(id) && (options?.enabled ?? true),
    staleTime: 3 * 60 * 1000,
    retry: false,
  })
}

export function useCreateNotice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateNoticePayload) => createNotice(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['notices'] })
      toast.success('Aviso criado com sucesso')
    },
    onError: (error: Error) => {
      console.error('[useCreateNotice]', error.message)
      toast.error(error.message || 'Erro ao criar aviso')
    },
  })
}

export function useUpdateNotice() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateNoticePayload
    }) => updateNotice(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['notices'] })
      toast.success('Aviso atualizado com sucesso')
    },
    onError: (error: Error) => {
      console.error('[useUpdateNotice]', error.message)
      toast.error(error.message || 'Erro ao atualizar aviso')
    },
  })
}