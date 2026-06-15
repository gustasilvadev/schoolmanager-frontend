import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as testsApi from '@/integrations/tests/testsApi'
import { toast } from 'sonner'
import type { CreateTestDTO, UpdateTestDTO } from '@/types/test'

export function useCreateTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTestDTO) => testsApi.createTest(data),
    onSuccess: () => {
      toast.success('Avaliação criada com sucesso')
      queryClient.invalidateQueries({ queryKey: ['tests'] })
    },
    onError: (error: Error) => {
      console.error('[useCreateTest] createTest error:', error)
      toast.error(error.message || 'Erro ao criar avaliação')
    },
  })
}

export function useUpdateTest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTestDTO }) =>
      testsApi.updateTestById(id, data),
    onSuccess: () => {
      toast.success('Avaliação atualizada com sucesso')
      queryClient.invalidateQueries({ queryKey: ['tests'] })
    },
    onError: (error: Error) => {
      console.error('[useUpdateTest] updateTest error:', error)
      toast.error(error.message || 'Erro ao atualizar avaliação')
    },
  })
}
