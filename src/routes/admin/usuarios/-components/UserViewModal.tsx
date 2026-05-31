import type { ReactNode } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { User } from '@/types/user'

interface UserViewModalProps {
  user: User | null
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

export function UserViewModal({ user, open, onClose }: UserViewModalProps) {
  return (
    <Dialog open={open} onClose={onClose} title="Detalhes do Usuário">
      {user ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <InfoRow label="E-mail" value={user.user_email} />
          </div>
          <InfoRow
            label="Papel"
            value={user.role === 'ADMIN' ? 'Administrador' : 'Professor'}
          />
          <InfoRow
            label="Status"
            value={<StatusBadge status={user.user_status} />}
          />
          <InfoRow label="ID" value={`#${user.user_id}`} />
          {user.teacher_id != null && (
            <InfoRow label="ID do Professor" value={`#${user.teacher_id}`} />
          )}
        </div>
      ) : null}
    </Dialog>
  )
}
