import type { ReactNode } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { User } from '@/types/user'
import { UserPhotoUploader } from './UserPhotoUploader'

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
        <div className="flex flex-col gap-5">
          <div className="flex justify-center">
            <UserPhotoUploader
              key={user.user_id}
              userId={user.user_id}
              initialPhoto={user.user_photo}
              name={user.user_email}
              disabled={user.user_status === 2}
            />
          </div>

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
          </div>
        </div>
      ) : null}
    </Dialog>
  )
}
