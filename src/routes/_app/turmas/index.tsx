import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/turmas/')({
  component: TurmasPage,
})

function TurmasPage() {
  return <div>Turmas</div>
}
