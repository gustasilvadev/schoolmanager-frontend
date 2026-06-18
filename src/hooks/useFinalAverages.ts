import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import * as finalAveragesApi from '@/integrations/finalAverages/finalAveragesApi'
import { useClassDisciplines } from '@/hooks/useClassDisciplines'
import type { UpdateFinalAverageDTO } from '@/types/finalAverage'

export function useStudentFinalAverages(studentId: string) {
  return useQuery({
    queryKey: ['final-averages', 'byStudent', studentId],
    queryFn: () => finalAveragesApi.listFinalAveragesByStudent(studentId),
    staleTime: 3 * 60 * 1000,
    enabled: !!studentId,
  })
}

export function useClassDisciplineFinalAverages(classDisciplineId: number) {
  return useQuery({
    queryKey: ['final-averages', 'byClassDiscipline', classDisciplineId],
    queryFn: () =>
      finalAveragesApi.listFinalAveragesByClassDiscipline(classDisciplineId),
    staleTime: 3 * 60 * 1000,
    enabled: classDisciplineId > 0,
  })
}

export function useClassFinalAverages(classId: number) {
  const { data: disciplines = [], isLoading: loadingDisciplines } =
    useClassDisciplines(classId)

  const queries = useQueries({
    queries: disciplines.map((d) => ({
      queryKey: ['final-averages', 'byClassDiscipline', d.class_discipline_id],
      queryFn: () =>
        finalAveragesApi.listFinalAveragesByClassDiscipline(
          d.class_discipline_id,
        ),
      enabled: d.class_discipline_id > 0,
      staleTime: 3 * 60 * 1000,
    })),
  })

  const isLoading = loadingDisciplines || queries.some((q) => q.isLoading)
  const averages = queries.flatMap((q) => q.data ?? [])

  return { averages, isLoading }
}

export function useCalculateFinalAverage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ studentId, classDisciplineId }: { studentId: string, classDisciplineId: string }) =>
      finalAveragesApi.calculateFinalAverage(studentId, classDisciplineId),
    onSuccess: () => {
      toast.success('Média calculada com sucesso')
      queryClient.invalidateQueries({ queryKey: ['final-averages'] })
    },
    onError: (error: Error) => {
      console.error('[useCalculateFinalAverage] calculateFinalAverage error:', error)
      toast.error(error.message || 'Erro ao calcular média')
    },
  })
}

export function useCalculateAveragesBatch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (
      pairs: { studentId: number; classDisciplineId: number }[],
    ) => {
      const results = await Promise.allSettled(
        pairs.map((p) =>
          finalAveragesApi.calculateFinalAverage(
            String(p.studentId),
            String(p.classDisciplineId),
          ),
        ),
      )
      const failed = results.filter((r) => r.status === 'rejected').length
      return { total: pairs.length, failed }
    },
    onSuccess: ({ total, failed }) => {
      void qc.invalidateQueries({ queryKey: ['final-averages'] })
      if (total === 0) return
      if (failed > 0) {
        toast.warning(
          `${total - failed} de ${total} média${total !== 1 ? 's' : ''} calculada${total - failed !== 1 ? 's' : ''}; ${failed} falhou(aram)`,
        )
      } else {
        toast.success(
          `${total} média${total !== 1 ? 's' : ''} calculada${total !== 1 ? 's' : ''}`,
        )
      }
    },
    onError: (e: Error) => {
      console.error('[useCalculateAveragesBatch]', e.message)
      toast.error(e.message || 'Erro ao calcular médias')
    },
  })
}

export function useUpdateFinalAverage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateFinalAverageDTO }) =>
      finalAveragesApi.updateFinalAverageById(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['final-averages'] })
      toast.success('Média atualizada com sucesso')
    },
    onError: (e: Error) => {
      console.error('[useUpdateFinalAverage]', e.message)
      toast.error(e.message || 'Erro ao atualizar média')
    },
  })
}

export function useDeleteFinalAverage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => finalAveragesApi.deleteFinalAverageById(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['final-averages'] })
      toast.success('Média excluída com sucesso')
    },
    onError: (e: Error) => {
      console.error('[useDeleteFinalAverage]', e.message)
      toast.error(e.message || 'Erro ao excluir média')
    },
  })
}

export function useRestoreFinalAverage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => finalAveragesApi.restoreFinalAverageById(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['final-averages'] })
      toast.success('Média restaurada com sucesso')
    },
    onError: (e: Error) => {
      console.error('[useRestoreFinalAverage]', e.message)
      toast.error(e.message || 'Erro ao restaurar média')
    },
  })
}
