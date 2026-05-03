import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/alunos/')({
  component: AlunosPage,
})

function AlunosPage() {
  return <div>Alunos</div>
}
