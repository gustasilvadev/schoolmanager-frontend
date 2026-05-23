import { FileText, Mail, User } from 'lucide-react'
import type { TeacherProfileData } from '@/types/auth'
import type { Accent } from './theme'
import { ProfileCard } from './ProfileCard'
import { InfoRow } from './InfoRow'

interface PersonalInfoCardProps {
  teacher: TeacherProfileData | null
  accent: Accent
}

export function PersonalInfoCard({ teacher, accent }: PersonalInfoCardProps) {
  return (
    <ProfileCard
      icon={<User className="h-4 w-4" />}
      title="Dados Pessoais"
      accent={accent}
    >
      {teacher ? (
        <div className="divide-y divide-slate-800/60">
          <InfoRow
            icon={<User className="h-4 w-4" />}
            label="Nome completo"
            value={teacher.teacher_name}
          />
          <InfoRow
            icon={<FileText className="h-4 w-4" />}
            label="CPF"
            value={teacher.teacher_cpf}
          />
          <InfoRow
            icon={<Mail className="h-4 w-4" />}
            label="E-mail pessoal"
            value={teacher.teacher_email}
          />
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          Nenhum dado pessoal encontrado.
        </p>
      )}
    </ProfileCard>
  )
}
