import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teacher/avaliacoes/')({
  component: AvaliacoesPage,
})

function AvaliacoesPage() {
  return <div>Avaliações</div>
}
