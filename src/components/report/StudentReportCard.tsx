import { useQuery } from '@tanstack/react-query'
import { listGradesByStudent } from '@/integrations/grades/gradesApi'
import { useStudentFinalAverages, useCalculateFinalAverage } from '@/hooks/useFinalAverages'
import { useClassDisciplineNameMap } from '@/hooks/useClassDisciplineNameMap'
import { DisciplineGradeCard } from './DisciplineGradeCard'
import type { GradeWithTest } from '@/types/grade'
import { Loader2, User } from 'lucide-react'

interface StudentReportCardProps {
  studentId: string
  studentName?: string
  studentEmail?: string
  canCalculate?: boolean
}

export function StudentReportCard({
  studentId,
  studentName,
  studentEmail,
  canCalculate,
}: StudentReportCardProps) {
  const { data: grades, isLoading: isLoadingGrades } = useQuery({
    queryKey: ['grades', 'byStudent', studentId],
    queryFn: () => listGradesByStudent(studentId),
    enabled: !!studentId,
  })

  const { data: averages, isLoading: isLoadingAverages } = useStudentFinalAverages(studentId)
  const { mutate: calculateAverage } = useCalculateFinalAverage()
  const { nameMap: disciplineNames } = useClassDisciplineNameMap()

  if (isLoadingGrades || isLoadingAverages) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  const gradesByDiscipline = new Map<string, GradeWithTest[]>()
  for (const grade of grades ?? []) {
    const key = grade.tests.class_discipline_id.toString()
    const list = gradesByDiscipline.get(key)
    if (list) list.push(grade)
    else gradesByDiscipline.set(key, [grade])
  }

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">{studentName || 'Aluno'}</h2>
          <p className="text-slate-400 text-sm">E-mail: {studentEmail || '—'} • Status: Ativo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...gradesByDiscipline].map(([classDisciplineId, discGrades]) => (
          <DisciplineGradeCard
            key={classDisciplineId}
            disciplineName={
              disciplineNames.get(Number(classDisciplineId)) ??
              `Disciplina #${classDisciplineId}`
            }
            grades={discGrades}
            finalAverage={averages?.find(
              (a) => a.class_discipline_id.toString() === classDisciplineId,
            )}
            canCalculate={canCalculate}
            onCalculate={(classDiscId) => {
              calculateAverage({ studentId, classDisciplineId: classDiscId })
            }}
          />
        ))}

        {gradesByDiscipline.size === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
            <p className="text-slate-500">Nenhuma nota lançada para este aluno ainda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
