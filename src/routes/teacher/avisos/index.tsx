import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teacher/avisos/')({
  component: AvisosPage,
})

function AvisosPage() {
  return <div>Avisos</div>
}
