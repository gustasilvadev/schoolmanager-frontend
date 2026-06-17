import { useMemo, useState } from 'react'
import { GraduationCap, Loader2, Trash2, UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AssignSelectionModal } from './AssignSelectionModal'
import { FinalAverageManagerModal } from './FinalAverageManagerModal'
import type { FinalAverageRow } from './FinalAverageManagerModal'
import {
  useClassStudents,
  useEnrollStudents,
  useUnenrollStudent,
} from '@/hooks/useClassStudents'
import { useClassDisciplines } from '@/hooks/useClassDisciplines'
import { useClassFinalAverages } from '@/hooks/useFinalAverages'
import { useStudents } from '@/hooks/useStudents'
import { getInitials } from '@/utils/strings'
import { formatAverage, meanOfAverages } from '@/utils/averages'
import type { ClassStudent } from '@/types/classes'

interface ClassStudentsTabProps {
  classId: number
  canEdit: boolean
  canManageGrades?: boolean
}

export function ClassStudentsTab({
  classId,
  canEdit,
  canManageGrades = false,
}: ClassStudentsTabProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [gradesStudent, setGradesStudent] = useState<ClassStudent | null>(null)

  const { data: classStudents = [], isLoading } = useClassStudents(classId)
  const { mutate: enrollStudents, isPending: enrolling } = useEnrollStudents()
  const { mutate: unenroll } = useUnenrollStudent()

  const { averages, isLoading: loadingAverages } = useClassFinalAverages(classId)
  const { data: disciplines = [] } = useClassDisciplines(classId)

  const {
    data: allStudentsData,
    isLoading: loadingStudents,
    isError: studentsError,
  } = useStudents({ limit: 500, includeDeleted: true })

  const studentMap = useMemo(() => {
    const map = new Map<number, { name: string; email: string }>()
    allStudentsData?.students.forEach((s) => {
      map.set(s.student_id, { name: s.student_name, email: s.student_email })
    })
    return map
  }, [allStudentsData])

  const disciplineNameById = useMemo(() => {
    const map = new Map<number, string>()
    disciplines.forEach((d) => {
      map.set(
        d.class_discipline_id,
        d.disciplines?.discipline_name ?? `Disciplina #${d.discipline_id}`,
      )
    })
    return map
  }, [disciplines])

  const averagesByStudent = useMemo(() => {
    const map = new Map<number, typeof averages>()
    averages.forEach((a) => {
      const list = map.get(a.student_id) ?? []
      list.push(a)
      map.set(a.student_id, list)
    })
    return map
  }, [averages])

  const showActions = canEdit || canManageGrades

  const enrolledIds = new Set(classStudents.map((s) => s.student_id))

  const availableItems = (allStudentsData?.students ?? [])
    .filter((s) => !enrolledIds.has(s.student_id) && s.student_status !== 2)
    .map((s) => ({
      id: s.student_id,
      label: s.student_name,
      sublabel: s.student_email,
    }))

  function resolveStudent(studentId: number, fallbackName?: string | null) {
    if (fallbackName) return { name: fallbackName, email: studentMap.get(studentId)?.email }
    const fromMap = studentMap.get(studentId)
    return fromMap ?? { name: `Aluno #${studentId}`, email: undefined }
  }

  function handleConfirm(ids: number[]) {
    enrollStudents(
      { classId, studentIds: ids },
      { onSuccess: () => setModalOpen(false) },
    )
  }

  const gradesRows: FinalAverageRow[] = gradesStudent
    ? (averagesByStudent.get(gradesStudent.student_id) ?? []).map((a) => ({
        label:
          disciplineNameById.get(a.class_discipline_id) ??
          `Disciplina #${a.class_discipline_id}`,
        average: a,
      }))
    : []

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {classStudents.length > 0
            ? `${classStudents.length} aluno${classStudents.length !== 1 ? 's' : ''} matriculado${classStudents.length !== 1 ? 's' : ''}`
            : 'Nenhum aluno matriculado'}
        </p>
        {canEdit && (
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
            Matricular Alunos
          </Button>
        )}
      </div>

      {classStudents.length === 0 ? (
        <div className="flex flex-col h-36 items-center justify-center gap-2 rounded-lg border border-dashed border-slate-800">
          <Users className="h-7 w-7 text-slate-700" />
          <p className="text-sm text-slate-500">Nenhum aluno matriculado nesta turma.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Aluno
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  E-mail
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Média
                </th>
                {showActions && (
                  <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              {classStudents.map((s) => {
                const info = resolveStudent(s.student_id, s.student_name)
                const mean = meanOfAverages(averagesByStudent.get(s.student_id) ?? [])
                return (
                  <tr key={s.class_student_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-xs font-semibold text-blue-300">
                          {getInitials(info.name)}
                        </div>
                        <span className="font-medium text-white">{info.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {info.email ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      {loadingAverages ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-600" />
                      ) : (
                        <span className={mean === null ? 'text-slate-600' : 'font-semibold text-white'}>
                          {formatAverage(mean)}
                        </span>
                      )}
                    </td>
                    {showActions && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {canManageGrades && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setGradesStudent(s)}
                              title="Gerenciar médias"
                              className="h-7 w-7 p-0 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                            >
                              <GraduationCap className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => unenroll({ classId, studentId: s.student_id })}
                              title="Remover da turma"
                              className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <AssignSelectionModal
        open={modalOpen}
        title="Matricular Alunos"
        isLoading={loadingStudents}
        isError={studentsError}
        items={availableItems}
        searchPlaceholder="Buscar por nome ou e-mail..."
        confirmLabel="Matricular"
        isPending={enrolling}
        onConfirm={handleConfirm}
        onClose={() => setModalOpen(false)}
      />

      <FinalAverageManagerModal
        open={gradesStudent !== null}
        title="Médias do aluno"
        subtitle={
          gradesStudent
            ? resolveStudent(gradesStudent.student_id, gradesStudent.student_name).name
            : undefined
        }
        rows={gradesRows}
        isLoading={loadingAverages}
        onClose={() => setGradesStudent(null)}
      />
    </div>
  )
}
