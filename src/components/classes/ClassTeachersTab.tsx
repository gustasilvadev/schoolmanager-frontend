import { useState } from 'react'
import { Info, Loader2, Trash2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AssignSelectionModal } from './AssignSelectionModal'
import {
  useClassTeachers,
  useAssignTeachers,
  useUnassignTeacher,
} from '@/hooks/useClassTeachers'
import { useTeachers } from '@/hooks/useTeachers'

interface ClassTeachersTabProps {
  classId: number
  canEdit: boolean
}

export function ClassTeachersTab({ classId, canEdit }: ClassTeachersTabProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const { data: classTeachers = [], isLoading } = useClassTeachers(classId)
  const { mutate: assignTeachers, isPending: assigning } = useAssignTeachers()
  const { mutate: unassign } = useUnassignTeacher()

  const assignedIds = new Set(classTeachers.map((t) => t.teacher_id))

  const {
    data: allTeachersData,
    isLoading: loadingTeachers,
    isError: teachersError,
  } = useTeachers({ status: 1, limit: 500 }, { enabled: modalOpen })

  const availableItems = (allTeachersData?.teachers ?? [])
    .filter((t) => !assignedIds.has(t.teacher_id))
    .map((t) => ({
      id: t.teacher_id,
      label: t.teacher_name,
      sublabel: t.teacher_email,
    }))

  function handleConfirm(ids: number[]) {
    assignTeachers(
      { classId, teacherIds: ids },
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
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-2 rounded-lg border border-blue-900/40 bg-blue-950/20 px-3 py-2 text-xs text-blue-300">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
            <span>
              Para associar um professor, ele precisa ter ao menos uma{' '}
              <strong>habilitação</strong> que coincida com as disciplinas desta
              turma. Gerencie as habilitações em{' '}
              <strong>Admin → Professores</strong>.
            </span>
          </div>
          <Button size="sm" onClick={() => setModalOpen(true)} className="shrink-0">
            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
            Associar Professores
          </Button>
        </div>
      )}

      {classTeachers.length === 0 ? (
        <div className="flex h-28 items-center justify-center rounded-lg border border-slate-800">
          <p className="text-sm text-slate-500">Nenhum professor associado.</p>
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
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  E-mail
                </th>
                {canEdit && (
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              {classTeachers.map((t) => (
                <tr key={t.class_teachers_id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-2.5 font-mono text-slate-400">
                    {t.teacher_id}
                  </td>
                  <td className="px-4 py-2.5 text-white">
                    {t.teacher_name ?? `Professor #${t.teacher_id}`}
                  </td>
                  <td className="px-4 py-2.5 text-slate-400">
                    {t.teacher_email ?? '—'}
                  </td>
                  {canEdit && (
                    <td className="px-4 py-2.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          unassign({ classId, teacherId: t.teacher_id })
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
        title="Associar Professores"
        isLoading={loadingTeachers}
        isError={teachersError}
        items={availableItems}
        searchPlaceholder="Buscar por nome ou e-mail..."
        confirmLabel="Associar"
        isPending={assigning}
        onConfirm={handleConfirm}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
