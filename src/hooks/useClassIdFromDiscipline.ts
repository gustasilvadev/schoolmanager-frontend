import { useQueries } from '@tanstack/react-query'
import { useClasses } from './useClasses'
import { getClassDisciplines } from '@/integrations/classes/classesApi'

export function useClassIdFromDiscipline(classDisciplineId?: number) {
  const { data: classesData } = useClasses({ class_status: 1 })
  const classIds = classesData?.classes.map((c) => c.class_id) ?? []

  const results = useQueries({
    queries: classIds.map((classId) => ({
      queryKey: ['class-disciplines', classId],
      queryFn: () => getClassDisciplines(classId),
      enabled: !!classDisciplineId && classIds.length > 0,
      staleTime: 2 * 60 * 1000,
    })),
  })

  if (!classDisciplineId) return { classId: undefined, isLoading: false }

  for (let i = 0; i < classIds.length; i++) {
    const disciplines = results[i]?.data
    if (disciplines) {
      const match = disciplines.find((d) => d.class_discipline_id === classDisciplineId)
      if (match) return { classId: classIds[i], isLoading: false }
    }
  }

  const isLoading = !classesData || results.some((r) => r.isLoading)
  return { classId: undefined, isLoading }
}
