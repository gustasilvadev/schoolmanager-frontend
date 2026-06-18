import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Eye, GraduationCap, Pencil, RotateCcw, ShieldCheck, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { User } from '@/types/user'
import { UserTableEmpty } from './UserTableEmpty'

interface UserTableProps {
  users: User[]
  isLoading: boolean
  onView: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onRestore: (user: User) => void
}

const columnHelper = createColumnHelper<User>()

function RoleBadge({ role }: { role: 'ADMIN' | 'TEACHER' }) {
  if (role === 'ADMIN') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-blue-600/15 px-2 py-0.5 text-xs font-medium text-blue-400">
        <ShieldCheck className="h-3 w-3" />
        Admin
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
      <GraduationCap className="h-3 w-3" />
      Professor
    </span>
  )
}

export function UserTable({
  users,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onRestore,
}: UserTableProps) {
  const columns = [
    columnHelper.accessor('user_email', {
      header: 'E-mail',
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
    columnHelper.accessor('role', {
      header: 'Papel',
      cell: (info) => <RoleBadge role={info.getValue()} />,
    }),
    columnHelper.accessor('user_status', {
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const user = row.original
        const isDeleted = user.user_status === 2

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(user)}
              title="Visualizar"
              className="h-8 w-8 p-0"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>

            {!isDeleted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(user)}
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
                onClick={() => onRestore(user)}
                title="Restaurar"
                className="h-8 w-8 p-0 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(user)}
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
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading || users.length === 0) {
    return <UserTableEmpty isLoading={isLoading} />
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
