import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/perfil/')({
  component: PerfilPage,
})

function PerfilPage() {
  return <div>Perfil</div>
}
