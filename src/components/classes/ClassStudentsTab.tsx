import { useState } from 'react'
import { Loader2, Trash2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AssignSelectionModal } from './AssignSelectionModal'
import {
  useClassStudents,
  useEnrollStudents,
  useUnenrollStudent,
} from '@/hooks/useClassStudents'
import { useStudents } from '@/hooks/useStudents'

interface ClassStudentsTabProps {
  classId: number
  canEdit: boolean
}

export function ClassStudentsTab({ classId, canEdit }: ClassStudentsTabProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const { data: classStudents = [], isLoading } = useClassStudents(classId)
  const { mutate: enrollStudents, isPending: enrolling } = useEnrollStudents()
  const { mutate: unenroll } = useUnenrollStudent()

  const enrolledIds = new Set(classStudents.map((s) => s.student_id))

  const {
    data: allStudentsData,
    isLoading: loadingStudents,
    isError: studentsError,
  } = useStudents({ status: 1, limit: 500 }, { enabled: modalOpen })

  const availableItems = (allStudentsData?.students ?? [])
    .filter((s) => !enrolledIds.has(s.student_id))
    .map((s) => ({
      id: s.student_id,
      label: s.student_name,
      sublabel: s.student_email,
    }))

  function handleConfirm(ids: number[]) {
    enrollStudents(
      { classId, studentIds: ids },
      { onSuccess: () => setModalOpen(false) },
    )
  }

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
            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
            Matricular Alunos
          </Button>
        </div>
      )}

      {classStudents.length === 0 ? (
        <div className="flex h-28 items-center justify-center rounded-lg border border-slate-800">
          <p className="text-sm text-slate-500">Nenhum aluno matriculado.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  ID
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Nome
                </th>
                {canEdit && (
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              {classStudents.map((s) => (
                <tr key={s.class_student_id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-2.5 font-mono text-slate-400">
                    {s.student_id}
                  </td>
                  <td className="px-4 py-2.5 text-white">
                    {s.student_name ?? `Aluno #${s.student_id}`}
                  </td>
                  {canEdit && (
                    <td className="px-4 py-2.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          unenroll({ classId, studentId: s.student_id })
                        }
                        title="Remover da turma"
                        className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
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
    </div>
  )
}
