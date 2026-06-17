import { useQueries } from '@tanstack/react-query'
import { useClasses } from './useClasses'
import { getClassDisciplines } from '@/integrations/classes/classesApi'

export function useClassDisciplineNameMap() {
  const { data: classesData, isLoading: isLoadingClasses } = useClasses({
    class_status: 1,
  })
  const classIds = classesData?.classes.map((c) => c.class_id) ?? []

  const results = useQueries({
    queries: classIds.map((classId) => ({
      queryKey: ['class-disciplines', classId],
      queryFn: () => getClassDisciplines(classId),
      enabled: classId > 0,
      staleTime: 2 * 60 * 1000,
    })),
  })

  const nameMap = new Map<number, string>()
  for (const result of results) {
    if (!result.data) continue
    for (const entry of result.data) {
      if (entry.disciplines?.discipline_name) {
        nameMap.set(entry.class_discipline_id, entry.disciplines.discipline_name)
      }
    }
  }

  const isLoading = isLoadingClasses || results.some((r) => r.isLoading)

  return { nameMap, isLoading }
}
