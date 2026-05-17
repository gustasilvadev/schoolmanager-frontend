import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/professores/')({
  component: ProfessoresPage,
})

function ProfessoresPage() {
  return <div>Professores</div>
}
