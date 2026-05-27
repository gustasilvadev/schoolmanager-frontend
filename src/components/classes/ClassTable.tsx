import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Eye, Loader2, Pencil, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { ClassItem } from '@/types/classes'

interface ClassTableProps {
  classes: ClassItem[]
  isLoading: boolean
  canEdit: boolean
  onView: (cls: ClassItem) => void
  onEdit: (cls: ClassItem) => void
  onDelete: (cls: ClassItem) => void
  onRestore: (cls: ClassItem) => void
}

const col = createColumnHelper<ClassItem>()

export function ClassTable({
  classes,
  isLoading,
  canEdit,
  onView,
  onEdit,
  onDelete,
  onRestore,
}: ClassTableProps) {
  const columns = [
    col.accessor('class_name', {
      header: 'Nome da Turma',
      cell: (info) => (
        <span className="font-medium text-white">{info.getValue()}</span>
      ),
    }),
    col.accessor('class_school_year', {
      header: 'Ano Letivo',
      cell: (info) => <span className="text-slate-300">{info.getValue()}</span>,
    }),
    col.accessor('class_status', {
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    col.display({
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const cls = row.original
        const isDeleted = cls.class_status === 2
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(cls)}
              title="Ver detalhes"
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            {canEdit && !isDeleted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(cls)}
                title="Editar"
                className="h-8 w-8 p-0"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            {canEdit && isDeleted ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRestore(cls)}
                title="Restaurar"
                className="h-8 w-8 p-0 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            ) : canEdit ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(cls)}
                title="Excluir"
                className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            ) : null}
          </div>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: classes,
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

  if (classes.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-slate-800">
        <p className="text-sm text-slate-500">Nenhuma turma encontrada.</p>
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
