import { useState } from 'react'
import { Search } from 'lucide-react'
import { useTeachers } from '@/hooks/useTeachers'

interface TeacherPickerProps {
  selectedIds: number[]
  onToggle: (id: number) => void
  open: boolean
  error?: string
}

export function TeacherPicker({
  selectedIds,
  onToggle,
  open,
  error,
}: TeacherPickerProps) {
  const [search, setSearch] = useState('')

  const { data: teachersData, isLoading } = useTeachers(
    { page: 1, limit: 100, name: search || undefined, includeDeleted: false },
    { enabled: open },
  )

  const teachers = teachersData?.teachers ?? []

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="mb-3">
        <p className="text-sm font-medium text-white">Professores</p>
        <p className="text-xs text-slate-500">
          {selectedIds.length > 0
            ? `${selectedIds.length} professor${selectedIds.length !== 1 ? 'es' : ''} selecionado${selectedIds.length !== 1 ? 's' : ''}`
            : 'Nenhum professor selecionado'}
        </p>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar professor..."
          className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-slate-800 px-4 py-6 text-center text-sm text-slate-500">
          Carregando professores...
        </div>
      ) : teachers.length === 0 ? (
        <div className="rounded-lg border border-slate-800 px-4 py-6 text-center text-sm text-slate-500">
          Nenhum professor encontrado.
        </div>
      ) : (
        <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
          {teachers.map((teacher) => (
            <label
              key={teacher.teacher_id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 transition hover:border-blue-500/50"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(teacher.teacher_id)}
                onChange={() => onToggle(teacher.teacher_id)}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {teacher.teacher_name}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {teacher.teacher_email}
                </p>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
