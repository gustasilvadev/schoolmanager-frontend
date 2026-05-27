import { BookOpen, ChevronRight } from 'lucide-react'

interface TeacherClassesLandingProps {
  onNavigate: () => void
}

export function TeacherClassesLanding({
  onNavigate,
}: TeacherClassesLandingProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10">
          <BookOpen className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Turmas</h1>
          <p className="text-xs text-slate-400">
            Consulte as turmas e seus detalhes
          </p>
        </div>
      </div>

      <button
        onClick={onNavigate}
        className="group flex w-full flex-col gap-4 rounded-xl border border-blue-600/20 bg-slate-900/60 p-6 text-left transition-all duration-200 hover:border-blue-500/40 hover:bg-slate-900 sm:max-w-sm"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-slate-400" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-white">Minhas Turmas</h2>
          <p className="mt-1 text-sm text-slate-400">
            Visualize turmas, alunos matriculados, professores e disciplinas.
          </p>
        </div>

        <ul className="space-y-1.5">
          {[
            'Listar todas as turmas',
            'Ver alunos de cada turma',
            'Consultar professores associados',
            'Verificar disciplinas da turma',
          ].map((f) => (
            <li
              key={f}
              className="flex items-center gap-2 text-xs text-slate-500"
            >
              <span className="h-1 w-1 rounded-full bg-blue-400" />
              {f}
            </li>
          ))}
        </ul>
      </button>
    </div>
  )
}
