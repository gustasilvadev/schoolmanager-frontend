import { cn } from '@/lib/utils'
import type { MeResponse } from '@/types/auth'
import { ACCENT, ROLE_LABEL } from './theme'
import type { Accent } from './theme'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ProfilePhotoUploader } from './ProfilePhotoUploader'

interface ProfileHeaderProps {
  data: MeResponse
  accent: Accent
}

export function ProfileHeader({ data, accent }: ProfileHeaderProps) {
  const ac = ACCENT[accent]
  const displayName = data.teacher?.teacher_name ?? data.user_email

  return (
    <div className="flex items-center gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <ProfilePhotoUploader
        currentPhoto={data.user_photo}
        name={displayName}
        fallbackClassName={ac.avatar}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="truncate text-xl font-semibold text-white">
            {displayName}
          </h1>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              ac.badge,
            )}
          >
            {ROLE_LABEL[data.role]}
          </span>
          <StatusBadge status={data.user_status} />
        </div>
        <p className="mt-1 text-sm text-slate-400">{data.user_email}</p>
      </div>
    </div>
  )
}
