import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/avisos/')({
  component: AvisosPage,
})

function AvisosPage() {
  return <div>Avisos</div>
}
