import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/turmas/')({
  component: TurmasPage,
})

function TurmasPage() {
  return <div>Turmas</div>
}
