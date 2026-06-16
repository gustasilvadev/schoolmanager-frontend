import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as testsApi from '@/integrations/tests/testsApi'
import type { StatusValue } from '@/types/test'
import { toast } from 'sonner'

export function useTests(params?: {
  page?: number
  limit?: number
  class_discipline_id?: number
  test_status?: StatusValue
  includeDeleted?: boolean
}) {
  return useQuery({
    queryKey: ['tests', 'list', params],
    queryFn: () => testsApi.listTests(params),
    staleTime: 3 * 60 * 1000,
  })
}

export function useTest(id: number) {
  return useQuery({
    queryKey: ['tests', 'detail', id],
    queryFn: () => testsApi.getTestById(id),
    staleTime: 3 * 60 * 1000,
    enabled: id > 0,
  })
}

export function useTestsByClassDiscipline(classDisciplineId?: number) {
  return useQuery({
    queryKey: ['tests', 'byClassDiscipline', classDisciplineId],
    queryFn: () =>
      classDisciplineId
        ? testsApi.listByClassDiscipline(classDisciplineId)
        : Promise.resolve([]),
    staleTime: 3 * 60 * 1000,
    enabled: !!classDisciplineId,
  })
}

export function useDeleteTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => testsApi.deleteTestById(id),
    onSuccess: (data) => {
      toast.success(data.message || 'Avaliação removida com sucesso')
      queryClient.invalidateQueries({ queryKey: ['tests'] })
    },
    onError: (error: Error) => {
      console.error('[useDeleteTest] deleteTest error:', error)
      toast.error(error.message || 'Erro ao remover avaliação')
    },
  })
}

export function useRestoreTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => testsApi.restoreTestById(id),
    onSuccess: () => {
      toast.success('Avaliação restaurada com sucesso')
      queryClient.invalidateQueries({ queryKey: ['tests'] })
    },
    onError: (error: Error) => {
      console.error('[useRestoreTest] restoreTest error:', error)
      toast.error(error.message || 'Erro ao restaurar avaliação')
    },
  })
}
