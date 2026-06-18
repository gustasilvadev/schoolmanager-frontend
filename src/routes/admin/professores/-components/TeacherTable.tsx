import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { BookOpen, Eye, Pencil, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { Teacher } from '@/types/teacher'
import { TeacherTableEmpty } from './TeacherTableEmpty'

interface TeacherTableProps {
  teachers: Teacher[]
  isLoading: boolean
  onView: (teacher: Teacher) => void
  onEdit: (teacher: Teacher) => void
  onDelete: (teacher: Teacher) => void
  onRestore: (teacher: Teacher) => void
  onDisciplines: (teacher: Teacher) => void
}

const columnHelper = createColumnHelper<Teacher>()

export function TeacherTable({
  teachers,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onRestore,
  onDisciplines,
}: TeacherTableProps) {
  const columns = [
    columnHelper.accessor('teacher_name', {
      header: 'Nome',
      cell: (info) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={info.row.original.user_photo}
            name={info.getValue()}
            size="md"
          />
          <span className="font-medium text-white">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('teacher_cpf', {
      header: 'CPF',
      cell: (info) => (
        <span className="font-mono text-slate-300">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('teacher_email', {
      header: 'E-mail',
      cell: (info) => <span className="text-slate-300">{info.getValue()}</span>,
    }),
    columnHelper.accessor('teacher_status', {
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const teacher = row.original
        const isDeleted = teacher.teacher_status === 2

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(teacher)}
              title="Visualizar"
              className="h-8 w-8 p-0"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>

            {!isDeleted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDisciplines(teacher)}
                title="Gerenciar habilitações"
                className="h-8 w-8 p-0 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
              >
                <BookOpen className="h-3.5 w-3.5" />
              </Button>
            )}
            {!isDeleted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(teacher)}
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
                onClick={() => onRestore(teacher)}
                title="Restaurar"
                className="h-8 w-8 p-0 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(teacher)}
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
    data: teachers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading || teachers.length === 0) {
    return <TeacherTableEmpty isLoading={isLoading} />
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
