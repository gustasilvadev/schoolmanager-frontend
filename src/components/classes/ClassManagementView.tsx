import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { ClassTable } from './ClassTable'
import { ClassFormModal } from './ClassFormModal'
import { useClasses, useDeleteClass, useRestoreClass } from '@/hooks/useClasses'
import type { ClassItem } from '@/types/classes'

interface ClassManagementViewProps {
  canEdit: boolean
  onBack: () => void
  onSelectClass: (cls: ClassItem) => void
}

const LIMIT = 10

export function ClassManagementView({
  canEdit,
  onBack,
  onSelectClass,
}: ClassManagementViewProps) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [includeDeleted, setIncludeDeleted] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ClassItem | null>(null)

  const { data, isLoading, isError } = useClasses({
    page,
    limit: LIMIT,
    class_name: search || undefined,
    includeDeleted,
  })

  const { mutate: deleteClass } = useDeleteClass()
  const { mutate: restoreClass } = useRestoreClass()

  const classes = data?.classes ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  useEffect(() => {
    if (isError) {
      console.error('[ClassManagementView] erro ao carregar turmas')
      toast.error('Erro ao carregar turmas')
    }
  }, [isError])

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleEdit(cls: ClassItem) {
    setEditing(cls)
    setModalOpen(true)
  }

  function handleDelete(cls: ClassItem) {
    deleteClass(cls.class_id)
  }

  function handleRestore(cls: ClassItem) {
    restoreClass(cls.class_id)
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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10">
            <BookOpen className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Turmas</h1>
            <p className="text-xs text-slate-400">
              {total > 0
                ? `${total} turma${total !== 1 ? 's' : ''}`
                : 'Nenhuma turma'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {canEdit && (
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
                <div className="h-5 w-9 rounded-full bg-slate-700 transition-colors peer-checked:bg-blue-600" />
                <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
              </div>
            </label>
          )}
          {canEdit && (
            <Button
              size="sm"
              onClick={() => {
                setEditing(null)
                setModalOpen(true)
              }}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Nova Turma
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <ClassTable
        classes={classes}
        isLoading={isLoading}
        canEdit={canEdit}
        onView={onSelectClass}
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

      <ClassFormModal
        open={modalOpen}
        editing={editing}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
