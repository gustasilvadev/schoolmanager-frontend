import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/avisos/')({
  component: AvisosPage,
})

function AvisosPage() {
  return <div>Avisos</div>
}
