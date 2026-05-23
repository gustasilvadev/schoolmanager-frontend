import { Mail, Shield, UserCircle } from 'lucide-react'
import type { MeResponse } from '@/types/auth'
import { ROLE_LABEL } from './theme'
import type { Accent } from './theme'
import { ProfileCard } from './ProfileCard'
import { InfoRow } from './InfoRow'
import { StatusBadge } from './StatusBadge'

interface AccountInfoCardProps {
  data: MeResponse
  accent: Accent
}

export function AccountInfoCard({ data, accent }: AccountInfoCardProps) {
  return (
    <ProfileCard
      icon={<Shield className="h-4 w-4" />}
      title="Dados da Conta"
      accent={accent}
    >
      <div className="divide-y divide-slate-800/60">
        <InfoRow
          icon={<Mail className="h-4 w-4" />}
          label="E-mail de acesso"
          value={data.user_email}
        />
        <InfoRow
          icon={<Shield className="h-4 w-4" />}
          label="Função"
          value={ROLE_LABEL[data.role]}
        />
        <InfoRow
          icon={<UserCircle className="h-4 w-4" />}
          label="Status"
          value={<StatusBadge status={data.user_status} />}
        />
      </div>
    </ProfileCard>
  )
}
