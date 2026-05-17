import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/alunos/')({
  component: AlunosPage,
})

function AlunosPage() {
  return <div>Alunos</div>
}
