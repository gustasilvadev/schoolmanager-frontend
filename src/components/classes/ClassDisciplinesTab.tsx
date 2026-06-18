import { useMemo, useState } from 'react'
import { BookOpen, GraduationCap, Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AssignSelectionModal } from './AssignSelectionModal'
import { FinalAverageManagerModal } from './FinalAverageManagerModal'
import type { FinalAverageRow } from './FinalAverageManagerModal'
import {
  useClassDisciplines,
  useAddDisciplinesToClass,
  useRemoveDisciplineFromClass,
} from '@/hooks/useClassDisciplines'
import { useClassStudents } from '@/hooks/useClassStudents'
import { useClassFinalAverages } from '@/hooks/useFinalAverages'
import { useDisciplines } from '@/hooks/useDisciplines'
import { useStudents } from '@/hooks/useStudents'
import { formatAverage, meanOfAverages } from '@/utils/averages'
import type { ClassDisciplineEntry } from '@/types/classes'

interface ClassDisciplinesTabProps {
  classId: number
  canEdit: boolean
  canManageGrades?: boolean
}

export function ClassDisciplinesTab({
  classId,
  canEdit,
  canManageGrades = false,
}: ClassDisciplinesTabProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [gradesEntry, setGradesEntry] = useState<ClassDisciplineEntry | null>(null)

  const { data: entries = [], isLoading } = useClassDisciplines(classId)
  const { mutate: addDisciplines, isPending: adding } = useAddDisciplinesToClass()
  const { mutate: removeDiscipline } = useRemoveDisciplineFromClass()

  const { averages, isLoading: loadingAverages } = useClassFinalAverages(classId)
  const { data: classStudents = [] } = useClassStudents(classId)
  const { data: allStudentsData } = useStudents({ limit: 500, includeDeleted: true })

  const {
    data: allDisciplines,
    isLoading: loadingDisciplines,
    isError: disciplinesError,
  } = useDisciplines({ discipline_status: 1, limit: 500 }, { enabled: modalOpen })

  const studentNameById = useMemo(() => {
    const map = new Map<number, string>()
    allStudentsData?.students.forEach((s) => map.set(s.student_id, s.student_name))
    classStudents.forEach((s) => {
      if (s.student_name && !map.has(s.student_id)) map.set(s.student_id, s.student_name)
    })
    return map
  }, [allStudentsData, classStudents])

  const averagesByDiscipline = useMemo(() => {
    const map = new Map<number, typeof averages>()
    averages.forEach((a) => {
      const list = map.get(a.class_discipline_id) ?? []
      list.push(a)
      map.set(a.class_discipline_id, list)
    })
    return map
  }, [averages])

  const showActions = canEdit || canManageGrades

  const existingIds = new Set(entries.map((e) => e.discipline_id))
  const availableItems = (allDisciplines?.disciplines ?? [])
    .filter((d) => !existingIds.has(d.discipline_id))
    .map((d) => ({
      id: d.discipline_id,
      label: d.discipline_name,
      sublabel: `${d.discipline_hour}h`,
    }))

  function handleConfirm(ids: number[]) {
    addDisciplines(
      { classId, disciplineIds: ids },
      { onSuccess: () => setModalOpen(false) },
    )
  }

  const gradesRows: FinalAverageRow[] = gradesEntry
    ? (averagesByDiscipline.get(gradesEntry.class_discipline_id) ?? []).map((a) => ({
        label: studentNameById.get(a.student_id) ?? `Aluno #${a.student_id}`,
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
      {canEdit && (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Adicionar Disciplinas
          </Button>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="flex h-28 items-center justify-center rounded-lg border border-slate-800">
          <p className="text-sm text-slate-500">Nenhuma disciplina na turma.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Disciplina
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Carga Horária
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
              {entries.map((e) => {
                const mean = meanOfAverages(
                  averagesByDiscipline.get(e.class_discipline_id) ?? [],
                )
                return (
                  <tr key={e.class_discipline_id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-white">
                          {e.disciplines?.discipline_name ??
                            `Disciplina #${e.discipline_id}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-slate-400">
                      {e.disciplines ? `${e.disciplines.discipline_hour}h` : '—'}
                    </td>
                    <td className="px-4 py-2.5">
                      {loadingAverages ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-600" />
                      ) : (
                        <span className={mean === null ? 'text-slate-600' : 'font-semibold text-white'}>
                          {formatAverage(mean)}
                        </span>
                      )}
                    </td>
                    {showActions && (
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          {canManageGrades && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setGradesEntry(e)}
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
                              onClick={() =>
                                removeDiscipline({ classId, disciplineId: e.discipline_id })
                              }
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
        title="Adicionar Disciplinas"
        isLoading={loadingDisciplines}
        isError={disciplinesError}
        items={availableItems}
        searchPlaceholder="Buscar por nome ou carga horária..."
        confirmLabel="Adicionar"
        isPending={adding}
        onConfirm={handleConfirm}
        onClose={() => setModalOpen(false)}
      />

      <FinalAverageManagerModal
        open={gradesEntry !== null}
        title="Médias da disciplina"
        subtitle={
          gradesEntry?.disciplines?.discipline_name ??
          (gradesEntry ? `Disciplina #${gradesEntry.discipline_id}` : undefined)
        }
        rows={gradesRows}
        isLoading={loadingAverages}
        onClose={() => setGradesEntry(null)}
      />
    </div>
  )
}
