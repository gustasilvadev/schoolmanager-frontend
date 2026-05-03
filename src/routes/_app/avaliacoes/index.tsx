import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/avaliacoes/')({
  component: AvaliacoesPage,
})

function AvaliacoesPage() {
  return <div>Avaliações</div>
}
