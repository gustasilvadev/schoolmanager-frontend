import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Loader2, Pencil, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { Discipline } from '@/types/classes'

interface DisciplineTableProps {
  disciplines: Discipline[]
  isLoading: boolean
  onEdit: (d: Discipline) => void
  onDelete: (d: Discipline) => void
  onRestore: (d: Discipline) => void
}

const col = createColumnHelper<Discipline>()

export function DisciplineTable({
  disciplines,
  isLoading,
  onEdit,
  onDelete,
  onRestore,
}: DisciplineTableProps) {
  const columns = [
    col.accessor('discipline_name', {
      header: 'Nome',
      cell: (info) => (
        <span className="font-medium text-white">{info.getValue()}</span>
      ),
    }),
    col.accessor('discipline_hour', {
      header: 'Carga Horária',
      cell: (info) => (
        <span className="text-slate-300">{info.getValue()}h</span>
      ),
    }),
    col.accessor('discipline_status', {
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    col.display({
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const d = row.original
        const isDeleted = d.discipline_status === 2
        return (
          <div className="flex items-center gap-1">
            {!isDeleted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(d)}
                title="Editar"
                className="h-8 w-8 p-0"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            {isDeleted ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRestore(d)}
                title="Restaurar"
                className="h-8 w-8 p-0 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(d)}
                title="Excluir"
                className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: disciplines,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-slate-800">
        <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
      </div>
    )
  }

  if (disciplines.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-slate-800">
        <p className="text-sm text-slate-500">Nenhuma disciplina encontrada.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-900">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400"
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-900/50">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="transition-colors hover:bg-slate-800/40"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
