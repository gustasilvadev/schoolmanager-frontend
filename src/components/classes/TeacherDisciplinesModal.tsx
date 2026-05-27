import { useState } from 'react'
import { BookOpen, Loader2, Plus, Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import {
  useTeacherDisciplines,
  useAssociateDiscipline,
  useRemoveTeacherDiscipline,
} from '@/hooks/useTeacherDisciplines'
import { useDisciplines } from '@/hooks/useDisciplines'
import type { Teacher } from '@/types/teacher'

interface TeacherDisciplinesModalProps {
  teacher: Teacher | null
  onClose: () => void
}

export function TeacherDisciplinesModal({
  teacher,
  onClose,
}: TeacherDisciplinesModalProps) {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState('')

  const open = teacher !== null
  const teacherId = teacher?.teacher_id ?? 0

  const { data: disciplinesData, isLoading: loadingDisciplines } =
    useTeacherDisciplines(teacherId, { enabled: open })

  const { data: allDisciplinesData, isLoading: loadingAll } = useDisciplines(
    { discipline_status: 1 },
  )

  const { mutate: associate, isPending: associating } = useAssociateDiscipline()
  const { mutate: remove } = useRemoveTeacherDiscipline()

  const linkedIds = new Set(disciplinesData?.discipline_ids ?? [])

  const allDisciplines = allDisciplinesData?.disciplines ?? []
  const linkedDisciplines = allDisciplines.filter((d) =>
    linkedIds.has(d.discipline_id),
  )
  const availableDisciplines = allDisciplines.filter(
    (d) => !linkedIds.has(d.discipline_id),
  )

  function handleAdd() {
    const id = parseInt(selectedDisciplineId, 10)
    if (!id || isNaN(id) || !teacher) return
    associate(
      { teacherId: teacher.teacher_id, disciplineId: id },
      { onSuccess: () => setSelectedDisciplineId('') },
    )
  }

  function handleClose() {
    setSelectedDisciplineId('')
    onClose()
  }

  const isLoading = loadingDisciplines || loadingAll

  return (
    <Modal
      open={open}
      title={`Habilitações — ${teacher?.teacher_name ?? ''}`}
      onClose={handleClose}
      className="max-w-lg"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          Disciplinas em que este professor está habilitado a lecionar. O
          professor só pode ser alocado em turmas que possuam ao menos uma dessas
          disciplinas.
        </p>

        <div className="flex gap-2">
          <select
            value={selectedDisciplineId}
            onChange={(e) => setSelectedDisciplineId(e.target.value)}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            disabled={isLoading || associating}
          >
            <option value="">Adicionar disciplina...</option>
            {availableDisciplines.map((d) => (
              <option key={d.discipline_id} value={d.discipline_id}>
                {d.discipline_name} ({d.discipline_hour}h)
              </option>
            ))}
          </select>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!selectedDisciplineId || associating || isLoading}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            {associating ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          </div>
        ) : linkedDisciplines.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700">
            <BookOpen className="h-5 w-5 text-slate-600" />
            <p className="text-sm text-slate-500">
              Nenhuma habilitação cadastrada.
            </p>
            <p className="text-xs text-slate-600">
              Adicione ao menos uma disciplina para poder alocar este professor em
              turmas.
            </p>
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
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                {linkedDisciplines.map((d) => (
                  <tr key={d.discipline_id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-white">{d.discipline_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-slate-400">
                      {d.discipline_hour}h
                    </td>
                    <td className="px-4 py-2.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          remove({
                            teacherId: teacher!.teacher_id,
                            disciplineId: d.discipline_id,
                          })
                        }
                        title="Remover habilitação"
                        className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
