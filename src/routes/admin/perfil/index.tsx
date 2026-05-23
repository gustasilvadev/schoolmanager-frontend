import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/components/profile/ProfilePage'

export const Route = createFileRoute('/admin/perfil/')({
  component: AdminPerfilPage,
})

function AdminPerfilPage() {
  return <ProfilePage accent="blue" />
}
