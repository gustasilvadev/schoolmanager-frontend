import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/components/profile/ProfilePage'

export const Route = createFileRoute('/teacher/perfil/')({
  component: TeacherPerfilPage,
})

function TeacherPerfilPage() {
  return <ProfilePage accent="emerald" />
}
