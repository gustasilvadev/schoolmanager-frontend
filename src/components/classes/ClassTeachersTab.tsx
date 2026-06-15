import { useMemo, useState } from 'react'
import { GraduationCap, Info, Loader2, Trash2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AssignSelectionModal } from './AssignSelectionModal'
import {
  useClassTeachers,
  useAssignTeachers,
  useUnassignTeacher,
} from '@/hooks/useClassTeachers'
import { useTeachers } from '@/hooks/useTeachers'
import { getInitials } from '@/utils/strings'

interface ClassTeachersTabProps {
  classId: number
  canEdit: boolean
}

export function ClassTeachersTab({ classId, canEdit }: ClassTeachersTabProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const { data: classTeachers = [], isLoading } = useClassTeachers(classId)
  const { mutate: assignTeachers, isPending: assigning } = useAssignTeachers()
  const { mutate: unassign } = useUnassignTeacher()
  const {
    data: allTeachersData,
    isLoading: loadingTeachers,
    isError: teachersError,
  } = useTeachers({ limit: 500, includeDeleted: true })

  const teacherMap = useMemo(() => {
    const map = new Map<number, { name: string; email: string }>()
    allTeachersData?.teachers.forEach((t) => {
      map.set(t.teacher_id, { name: t.teacher_name, email: t.teacher_email })
    })
    return map
  }, [allTeachersData])

  const assignedIds = new Set(classTeachers.map((t) => t.teacher_id))

  const availableItems = (allTeachersData?.teachers ?? [])
    .filter((t) => !assignedIds.has(t.teacher_id) && t.teacher_status !== 2)
    .map((t) => ({
      id: t.teacher_id,
      label: t.teacher_name,
      sublabel: t.teacher_email,
    }))

  function resolveTeacher(teacherId: number, fallbackName?: string | null, fallbackEmail?: string | null) {
    const name = fallbackName ?? teacherMap.get(teacherId)?.name ?? `Professor #${teacherId}`
    const email = fallbackEmail ?? teacherMap.get(teacherId)?.email
    return { name, email }
  }

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
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          {classTeachers.length > 0
            ? `${classTeachers.length} professor${classTeachers.length !== 1 ? 'es' : ''} associado${classTeachers.length !== 1 ? 's' : ''}`
            : 'Nenhum professor associado'}
        </p>
        {canEdit && (
          <Button size="sm" onClick={() => setModalOpen(true)} className="shrink-0">
            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
            Associar Professores
          </Button>
        )}
      </div>

      {canEdit && (
        <div className="flex items-start gap-2 rounded-lg border border-blue-900/40 bg-blue-950/20 px-3 py-2 text-xs text-blue-300">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
          <span>
            Para associar um professor, ele precisa ter ao menos uma{' '}
            <strong>habilitação</strong> que coincida com as disciplinas desta turma.
            Gerencie as habilitações em <strong>Admin → Professores</strong>.
          </span>
        </div>
      )}

      {classTeachers.length === 0 ? (
        <div className="flex flex-col h-36 items-center justify-center gap-2 rounded-lg border border-dashed border-slate-800">
          <GraduationCap className="h-7 w-7 text-slate-700" />
          <p className="text-sm text-slate-500">Nenhum professor associado a esta turma.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Professor
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  E-mail
                </th>
                {canEdit && (
                  <th className="px-4 py-2.5 w-12" />
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              {classTeachers.map((t) => {
                const info = resolveTeacher(t.teacher_id, t.teacher_name, t.teacher_email)
                return (
                  <tr key={t.class_teachers_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600/20 text-xs font-semibold text-violet-300">
                          {getInitials(info.name)}
                        </div>
                        <span className="font-medium text-white">{info.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {info.email ?? '—'}
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => unassign({ classId, teacherId: t.teacher_id })}
                          title="Remover da turma"
                          className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
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
