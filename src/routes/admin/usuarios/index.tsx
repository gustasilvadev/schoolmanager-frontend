import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/usuarios/')({
  component: UsuariosPage,
})

function UsuariosPage() {
  return <div>Usuários</div>
}
