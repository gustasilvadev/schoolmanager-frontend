import { BookOpen, Users } from 'lucide-react'
import { useTopTeachersByDisciplines } from '@/hooks/useTeacherDisciplines'

export function TopTeachersCard() {
  const { data = [], isLoading } = useTopTeachersByDisciplines(3)

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50">
      <div className="flex items-center gap-2 border-b border-slate-700 px-5 py-4">
        <Users className="h-4 w-4 text-blue-400" />
        <h2 className="text-sm font-semibold text-white">
          Top Professores por Disciplinas
        </h2>
      </div>

      <div className="divide-y divide-slate-700/50">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 animate-pulse rounded-full bg-slate-700" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-32 animate-pulse rounded bg-slate-700" />
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-700/60" />
                </div>
              </div>
              <div className="h-5 w-8 animate-pulse rounded bg-slate-700" />
            </div>
          ))
        ) : data.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-slate-500">
            Nenhum professor cadastrado
          </p>
        ) : (
          data.map(({ teacher, count }, index) => (
            <div
              key={teacher.teacher_id}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-300">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {teacher.teacher_name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {teacher.teacher_email}
                  </p>
                </div>
              </div>
              <div className="ml-3 flex shrink-0 items-center gap-1.5 text-violet-400">
                <BookOpen className="h-3.5 w-3.5" />
                <span className="text-sm font-semibold">{count}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
