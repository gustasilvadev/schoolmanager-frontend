import { createFileRoute, Link } from '@tanstack/react-router'
import { StudentReportCard } from '@/components/report/StudentReportCard'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const Route = createFileRoute('/teacher/turmas/$id/aluno/$studentId')({
  component: TeacherAlunoBoletimPage,
})

function TeacherAlunoBoletimPage() {
  const { studentId } = Route.useParams()
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <Link to="/teacher/turmas">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 -ml-2 text-slate-400">
            <ChevronLeft className="w-4 h-4" />
            Voltar para turma
          </Button>
        </Link>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-white">Boletim do Aluno</h1>
          <p className="text-slate-400 text-sm">Acompanhamento de desempenho individual.</p>
        </div>
      </div>

      <StudentReportCard 
        studentId={studentId} 
        canCalculate={true} // Teacher pode disparar cálculo de média
      />
    </div>
  )
}
