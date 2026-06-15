import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Eye, Loader2, Pencil, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { Student } from '@/types/student'

interface StudentTableProps {
  students: Student[]
  isLoading: boolean
  onView: (student: Student) => void
  onEdit: (student: Student) => void
  onDelete: (student: Student) => void
  onRestore: (student: Student) => void
}

const columnHelper = createColumnHelper<Student>()

function StudentTableEmpty({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="flex h-48 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
      ) : (
        <p className="text-sm text-slate-500">Nenhum aluno encontrado.</p>
      )}
    </div>
  )
}

export function StudentTable({
  students,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onRestore,
}: StudentTableProps) {
  const columns = [
    columnHelper.accessor('student_name', {
      header: 'Nome',
      cell: (info) => (
        <span className="font-medium text-white">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('student_cpf', {
      header: 'CPF',
      cell: (info) => (
        <span className="font-mono text-slate-300">
          {info.getValue() ?? '—'}
        </span>
      ),
    }),
    columnHelper.accessor('student_status', {
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const student = row.original
        const isDeleted = student.student_status === 2

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(student)}
              title="Ver detalhes"
              className="h-8 w-8 p-0"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>

            {!isDeleted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(student)}
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
                onClick={() => onRestore(student)}
                title="Restaurar"
                className="h-8 w-8 p-0 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(student)}
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
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading || students.length === 0) {
    return <StudentTableEmpty isLoading={isLoading} />
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-900">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
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
