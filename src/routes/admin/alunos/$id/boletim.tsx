import { createFileRoute } from '@tanstack/react-router'
import { StudentReportCard } from '@/routes/-components/report/StudentReportCard'

export const Route = createFileRoute('/admin/alunos/$id/boletim')({
  validateSearch: (
    search: Record<string, unknown>,
  ): { name?: string; email?: string; photo?: string } => ({
    name: typeof search.name === 'string' ? search.name : undefined,
    email: typeof search.email === 'string' ? search.email : undefined,
    photo: typeof search.photo === 'string' ? search.photo : undefined,
  }),
  component: AlunoBoletimPage,
})

function AlunoBoletimPage() {
  const { id } = Route.useParams()
  const { name, email, photo } = Route.useSearch()

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-white">Boletim Escolar</h1>
        <p className="text-slate-400 text-sm">Visualização administrativa das notas do aluno.</p>
      </div>

      <StudentReportCard
        studentId={id}
        studentName={name}
        studentEmail={email}
        studentPhoto={photo}
        canCalculate={false}
        canRecalculateAll
      />
    </div>
  )
}
