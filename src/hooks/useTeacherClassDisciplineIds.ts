import { useQueries } from '@tanstack/react-query'
import { useClasses } from './useClasses'
import { useTeacherDisciplines } from './useTeacherDisciplines'
import { getClassDisciplines } from '@/integrations/classes/classesApi'

export function useTeacherClassDisciplineIds(teacherId?: number) {
  const { data: teacherDisc, isLoading: isLoadingDisc } = useTeacherDisciplines(
    teacherId ?? 0,
    { enabled: !!teacherId },
  )
  const disciplineIds = new Set(teacherDisc?.discipline_ids ?? [])

  const { data: classesData, isLoading: isLoadingClasses } = useClasses({ class_status: 1 })
  const classIds = classesData?.classes.map((c) => c.class_id) ?? []

  const enabled = !!teacherId && disciplineIds.size > 0 && classIds.length > 0

  const results = useQueries({
    queries: classIds.map((classId) => ({
      queryKey: ['class-disciplines', classId],
      queryFn: () => getClassDisciplines(classId),
      enabled,
      staleTime: 2 * 60 * 1000,
    })),
  })

  const classDisciplineIds = new Set<number>()
  for (const result of results) {
    if (result.data) {
      for (const entry of result.data) {
        if (disciplineIds.has(entry.discipline_id)) {
          classDisciplineIds.add(entry.class_discipline_id)
        }
      }
    }
  }

  const isLoading =
    (!!teacherId && isLoadingDisc) ||
    isLoadingClasses ||
    (enabled && results.some((r) => r.isLoading))

  return { classDisciplineIds, isLoading }
}
