import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as finalAveragesApi from '@/integrations/finalAverages/finalAveragesApi'
import { toast } from 'sonner'

export function useStudentFinalAverages(studentId: string) {
  return useQuery({
    queryKey: ['final-averages', 'byStudent', studentId],
    queryFn: () => finalAveragesApi.listFinalAveragesByStudent(studentId),
    staleTime: 3 * 60 * 1000,
    enabled: !!studentId,
  })
}

export function useCalculateFinalAverage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ studentId, classDisciplineId }: { studentId: string, classDisciplineId: string }) =>
      finalAveragesApi.calculateFinalAverage(studentId, classDisciplineId),
    onSuccess: (_, { studentId }) => {
      toast.success('Média calculada com sucesso')
      queryClient.invalidateQueries({ queryKey: ['final-averages', 'byStudent', studentId] })
    },
    onError: (error: Error) => {
      console.error('[useCalculateFinalAverage] calculateFinalAverage error:', error)
      toast.error(error.message || 'Erro ao calcular média')
    },
  })
}
