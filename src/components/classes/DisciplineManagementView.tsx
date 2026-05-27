import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Plus,
  Search,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { DisciplineTable } from './DisciplineTable'
import { DisciplineFormModal } from './DisciplineFormModal'
import {
  useDisciplines,
  useDeleteDiscipline,
  useRestoreDiscipline,
} from '@/hooks/useDisciplines'
import type { Discipline } from '@/types/classes'

interface DisciplineManagementViewProps {
  onBack: () => void
}

const LIMIT = 10

export function DisciplineManagementView({
  onBack,
}: DisciplineManagementViewProps) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [includeDeleted, setIncludeDeleted] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Discipline | null>(null)

  const { data, isLoading, isError } = useDisciplines({
    page,
    limit: LIMIT,
    discipline_name: search || undefined,
    includeDeleted,
  })

  const { mutate: deleteDiscipline } = useDeleteDiscipline()
  const { mutate: restoreDiscipline } = useRestoreDiscipline()

  const disciplines = data?.disciplines ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  useEffect(() => {
    if (isError) toast.error('Erro ao carregar disciplinas')
  }, [isError])

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleEdit(d: Discipline) {
    setEditing(d)
    setModalOpen(true)
  }

  function handleDelete(d: Discipline) {
    deleteDiscipline(d.discipline_id)
  }

  function handleRestore(d: Discipline) {
    restoreDiscipline(d.discipline_id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600/10">
            <ClipboardList className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Disciplinas</h1>
            <p className="text-xs text-slate-400">
              {total > 0
                ? `${total} disciplina${total !== 1 ? 's' : ''}`
                : 'Nenhuma disciplina'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
            <span className="text-xs">Incluir excluídas</span>
            <div className="relative">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={includeDeleted}
                onChange={(e) => {
                  setIncludeDeleted(e.target.checked)
                  setPage(1)
                }}
              />
              <div className="h-5 w-9 rounded-full bg-slate-700 transition-colors peer-checked:bg-violet-600" />
              <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
            </div>
          </label>
          <Button
            size="sm"
            className="bg-violet-600 hover:bg-violet-700"
            onClick={() => {
              setEditing(null)
              setModalOpen(true)
            }}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Nova Disciplina
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
      </div>

      <DisciplineTable
        disciplines={disciplines}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Página {page} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <DisciplineFormModal
        open={modalOpen}
        editing={editing}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
