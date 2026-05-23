import { Loader2 } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import type { Accent } from './theme'
import { ProfileHeader } from './ProfileHeader'
import { AccountInfoCard } from './AccountInfoCard'
import { PersonalInfoCard } from './PersonalInfoCard'
import { ChangePasswordForm } from './ChangePasswordForm'

export function ProfilePage({ accent }: { accent: Accent }) {
  const { data, isLoading, isError } = useProfile()

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-slate-500">
          Não foi possível carregar o perfil.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ProfileHeader data={data} accent={accent} />

      <div className="grid gap-6 lg:grid-cols-2">
        <AccountInfoCard data={data} accent={accent} />
        <PersonalInfoCard teacher={data.teacher} accent={accent} />
      </div>

      <ChangePasswordForm accent={accent} />
    </div>
  )
}
