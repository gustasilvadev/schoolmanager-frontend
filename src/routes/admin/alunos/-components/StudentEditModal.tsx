import { Modal } from '@/components/ui/Modal'
import type { Student } from '@/types/student'

interface StudentEditModalProps {
  student: Student | null
  open: boolean
  onClose: () => void
}

export function StudentEditModal({
  student,
  open,
  onClose,
}: StudentEditModalProps) {
  if (!student) return null

  return (
    <Modal open={open} title="Editar Aluno" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
            Nome
          </p>
          <p className="text-sm text-white">{student.student_name}</p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
            CPF
          </p>
          <p className="text-sm text-white">{student.student_cpf ?? '—'}</p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
            E-mail
          </p>
          <p className="text-sm text-white">{student.student_email}</p>
        </div>

        <p className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-xs text-slate-400">
          Formulário de edição em desenvolvimento.
        </p>
      </div>
    </Modal>
  )
}
