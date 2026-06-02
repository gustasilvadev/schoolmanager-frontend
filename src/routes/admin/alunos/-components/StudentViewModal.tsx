import type { ReactNode } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { Student } from '@/types/student'

interface StudentViewModalProps {
  student: Student | null
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

export function StudentViewModal({ student, open, onClose }: StudentViewModalProps) {
  const responsibles = student?.student_responsibles ?? []

  return (
    <Dialog open={open} onClose={onClose} title="Detalhes do Aluno" className="max-w-lg">
      {student ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <InfoRow label="Nome" value={student.student_name} />
            </div>
            <InfoRow
              label="CPF"
              value={
                student.student_cpf ? (
                  <span className="font-mono">{student.student_cpf}</span>
                ) : (
                  <span className="text-slate-500">—</span>
                )
              }
            />
            <InfoRow
              label="Data de nascimento"
              value={
                student.student_birthday
                  ? new Date(student.student_birthday).toLocaleDateString('pt-BR')
                  : <span className="text-slate-500">—</span>
              }
            />
            <InfoRow label="E-mail" value={student.student_email} />
            <InfoRow
              label="Status"
              value={<StatusBadge status={student.student_status} />}
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Responsáveis
            </p>
            {responsibles.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhum responsável cadastrado.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {responsibles.map((sr, i) => (
                  <div
                    key={sr.responsibles.responsible_id}
                    className="flex flex-col gap-0.5 rounded-lg border border-slate-700 bg-slate-800/40 px-4 py-3"
                  >
                    <span className="text-xs text-slate-500">
                      Responsável {i + 1}
                    </span>
                    <span className="text-sm text-white">
                      {sr.responsibles.responsible_name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {sr.responsibles.responsible_email}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </Dialog>
  )
}
