import type { ReactNode } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { Teacher } from '@/types/teacher'

interface TeacherViewModalProps {
  teacher: Teacher | null
  open: boolean
  onClose: () => void
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <span className="text-sm text-white">{value}</span>
    </div>
  )
}

export function TeacherViewModal({ teacher, open, onClose }: TeacherViewModalProps) {
  return (
    <Dialog open={open} onClose={onClose} title="Detalhes do Professor">
      {teacher ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <InfoRow label="Nome" value={teacher.teacher_name} />
          </div>
          <InfoRow
            label="CPF"
            value={<span className="font-mono">{teacher.teacher_cpf}</span>}
          />
          <InfoRow label="E-mail" value={teacher.teacher_email} />
          <InfoRow
            label="Status"
            value={<StatusBadge status={teacher.teacher_status} />}
          />
          <InfoRow label="ID do Usuário" value={teacher.user_id} />
        </div>
      ) : null}
    </Dialog>
  )
}
