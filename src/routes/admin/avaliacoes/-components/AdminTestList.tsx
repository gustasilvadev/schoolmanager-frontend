import type { Test } from '@/types/test'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { AdminTestActions } from './AdminTestActions'

interface AdminTestListProps {
  tests: Test[]
  isLoading: boolean
  onEdit: (test: Test) => void
}

export function AdminTestList({ tests, isLoading, onEdit }: AdminTestListProps) {
  if (isLoading) {
    return (
      <div className="space-y-0">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-14 w-full bg-slate-900/50 animate-pulse border-b border-slate-800/50 last:border-0"
          />
        ))}
      </div>
    )
  }

  if (tests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-2xl">
        <p className="text-slate-400 text-lg mb-2">Nenhuma avaliação encontrada.</p>
        <p className="text-slate-500 text-sm">Tente ajustar os filtros ou crie uma nova avaliação.</p>
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
              Status
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
                <StatusBadge status={test.test_status} />
              </td>
              <td className="py-4 px-4">
                <AdminTestActions test={test} onEdit={onEdit} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
