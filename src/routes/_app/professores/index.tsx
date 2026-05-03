import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/professores/')({
  component: ProfessoresPage,
})

function ProfessoresPage() {
  return <div>Professores</div>
}
