import type { Test } from '@/types/test'
import { TestActions } from './TestActions'

interface TestListProps {
  tests: Test[]
  isLoading: boolean
  onEdit: (test: Test) => void
  classDisciplineMap?: Map<number, string>
}

export function TestList({ tests, isLoading, onEdit, classDisciplineMap }: TestListProps) {
  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 w-full bg-slate-900/50 animate-pulse rounded-lg border border-slate-800/50"
          />
        ))}
      </div>
    )
  }

  if (tests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
        <p className="text-slate-400 text-lg mb-2">Nenhuma avaliação encontrada.</p>
        <p className="text-slate-500 text-sm">Crie a primeira avaliação para começar.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tipo
            </th>
            <th className="py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Descrição
            </th>
            <th className="py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Disciplina
            </th>
            <th className="py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {tests.map((test) => (
            <tr key={test.test_id} className="group hover:bg-slate-900/50 transition-colors">
              <td className="py-4 px-4">
                <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                  {test.test_type}
                </span>
              </td>
              <td className="py-4 px-4 text-sm text-slate-400 truncate max-w-[280px]">
                {test.test_description || '—'}
              </td>
              <td className="py-4 px-4">
                {classDisciplineMap?.get(test.class_discipline_id) ? (
                  <span className="inline-flex items-center rounded-md bg-blue-600/10 px-2 py-0.5 text-xs font-medium text-blue-300 ring-1 ring-inset ring-blue-600/20">
                    {classDisciplineMap.get(test.class_discipline_id)}
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">—</span>
                )}
              </td>
              <td className="py-4 px-4 text-right">
                <TestActions test={test} onEdit={onEdit} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
