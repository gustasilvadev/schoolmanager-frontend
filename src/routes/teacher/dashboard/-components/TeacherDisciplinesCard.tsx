import { AlertCircle, BookOpen } from 'lucide-react'
import { useTeacherDisciplineDetails } from '@/hooks/useTeacherDisciplines'

interface TeacherDisciplinesCardProps {
  teacherId: number
}

export function TeacherDisciplinesCard({ teacherId }: TeacherDisciplinesCardProps) {
  const {
    data: disciplines,
    isLoading,
    isError,
  } = useTeacherDisciplineDetails(teacherId)

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50">
      <div className="flex items-center gap-2 border-b border-slate-700 px-5 py-4">
        <BookOpen className="h-4 w-4 text-violet-400" />
        <h2 className="text-sm font-semibold text-white">Minhas Disciplinas</h2>
      </div>

      <div className="divide-y divide-slate-700/50">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <div className="h-3.5 w-36 animate-pulse rounded bg-slate-700" />
              <div className="h-3.5 w-10 animate-pulse rounded bg-slate-700" />
            </div>
          ))
        ) : isError ? (
          <div className="flex items-center gap-2 px-5 py-6 text-sm text-slate-500">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>Não foi possível carregar as disciplinas.</span>
          </div>
        ) : !disciplines || disciplines.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-slate-500">
            Nenhuma disciplina vinculada
          </p>
        ) : (
          disciplines.map((d) => (
            <div
              key={d.discipline_id}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <p className="text-sm font-medium text-white">
                {d.discipline_name}
              </p>
              <span className="text-xs text-slate-500">
                {d.discipline_hour}h
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
