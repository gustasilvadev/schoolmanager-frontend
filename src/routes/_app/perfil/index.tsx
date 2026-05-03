import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/perfil/')({
  component: PerfilPage,
})

function PerfilPage() {
  return <div>Perfil</div>
}
