import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/avaliacoes/')({
  component: AvaliacoesPage,
})

function AvaliacoesPage() {
  return <div>Avaliações</div>
}
