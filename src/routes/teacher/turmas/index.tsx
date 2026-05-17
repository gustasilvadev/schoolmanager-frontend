import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teacher/turmas/')({
  component: TurmasPage,
})

function TurmasPage() {
  return <div>Turmas</div>
}
