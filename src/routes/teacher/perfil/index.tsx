import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teacher/perfil/')({
  component: PerfilPage,
})

function PerfilPage() {
  return <div>Perfil</div>
}
