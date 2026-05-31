import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as gradesApi from '@/integrations/grades/gradesApi'
import type { UpdateGradeDTO } from '@/types/grade'
import { toast } from 'sonner'

export function useGradesByTest(testId: number) {
  return useQuery({
    queryKey: ['grades', 'byTest', testId],
    queryFn: () => gradesApi.listGradesByTest(testId),
    enabled: testId > 0,
  })
}

export function useBulkCreateGrades() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: gradesApi.bulkCreateGrades,
    onSuccess: (data) => {
      toast.success(data.message || `${data.count} nota(s) salva(s) com sucesso`)
      queryClient.invalidateQueries({ queryKey: ['grades'] })
    },
    onError: (error: Error) => {
      console.error('[useBulkCreateGrades] bulkCreateGrades error:', error)
      toast.error(error.message || 'Erro ao salvar notas em lote')
    },
  })
}

export function useUpdateGrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGradeDTO }) =>
      gradesApi.updateGradeById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] })
    },
    onError: (error: Error) => {
      console.error('[useUpdateGrade] updateGrade error:', error)
      toast.error(error.message || 'Erro ao atualizar nota')
    },
  })
}
