import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, GraduationCap, Search, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { useTeachers, useDeleteTeacher, useRestoreTeacher } from '@/hooks/useTeachers'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { TeacherTable } from './-components/TeacherTable'
import { TeacherViewModal } from './-components/TeacherViewModal'
import { TeacherEditModal } from './-components/TeacherEditModal'
import { TeacherCreateModal } from './-components/TeacherCreateModal'
import { TeacherDisciplinesModal } from '@/components/classes/TeacherDisciplinesModal'
import type { Teacher } from '@/types/teacher'

export const Route = createFileRoute('/admin/professores/')({
  component: ProfessoresPage,
})

const LIMIT = 10

function ProfessoresPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [includeDeleted, setIncludeDeleted] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [disciplinesTeacher, setDisciplinesTeacher] = useState<Teacher | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Teacher | null>(null)
  const [pendingRestore, setPendingRestore] = useState<Teacher | null>(null)

  const { mutateAsync: deleteTeacher, isPending: isDeleting } = useDeleteTeacher()
  const { mutateAsync: restoreTeacher, isPending: isRestoring } = useRestoreTeacher()

  const { data, isLoading, isError } = useTeachers({
    page,
    limit: LIMIT,
    includeDeleted,
    name: search || undefined,
  })

  const teachers = data?.teachers ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleToggleDeleted(checked: boolean) {
    setIncludeDeleted(checked)
    setPage(1)
  }

  function handleView(teacher: Teacher) {
    setViewingTeacher(teacher)
  }

  function handleEdit(teacher: Teacher) {
    setEditingTeacher(teacher)
  }

  function handleDelete(teacher: Teacher) {
    setPendingDelete(teacher)
  }

  function handleRestore(teacher: Teacher) {
    setPendingRestore(teacher)
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return
    try {
      await deleteTeacher(pendingDelete.teacher_id)
      toast.success('Professor excluído com sucesso')
      setPendingDelete(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir professor')
    }
  }

  async function handleConfirmRestore() {
    if (!pendingRestore) return
    try {
      const { message } = await restoreTeacher(pendingRestore.teacher_id)
      toast.success(message)
      setPendingRestore(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao restaurar professor')
    }
  }

  function handleDisciplines(teacher: Teacher) {
    setDisciplinesTeacher(teacher)
  }

  useEffect(() => {
    if (isError) {
      console.error('[useTeachers] erro ao carregar professores')
      toast.error('Erro ao carregar professores')
    }
  }, [isError])

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10">
              <GraduationCap className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Professores</h1>
              <p className="text-xs text-slate-400">
                {total > 0
                  ? `${total} professor${total !== 1 ? 'es' : ''} encontrado${total !== 1 ? 's' : ''}`
                  : 'Nenhum professor'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => setIsCreating(true)}>
              <UserPlus className="h-4 w-4" />
              Novo Professor
            </Button>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
              <span>Incluir excluídos</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={includeDeleted}
                  onChange={(e) => handleToggleDeleted(e.target.checked)}
                />
                <div className="h-5 w-9 rounded-full bg-slate-700 transition-colors peer-checked:bg-blue-600" />
                <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
              </div>
            </label>
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

        <TeacherTable
          teachers={teachers}
          isLoading={isLoading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onDisciplines={handleDisciplines}
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

        <TeacherDisciplinesModal
          teacher={disciplinesTeacher}
          onClose={() => setDisciplinesTeacher(null)}
        />
      </div>

      <TeacherViewModal
        teacher={viewingTeacher}
        open={viewingTeacher !== null}
        onClose={() => setViewingTeacher(null)}
      />

      <TeacherEditModal
        teacher={editingTeacher}
        open={editingTeacher !== null}
        onClose={() => setEditingTeacher(null)}
      />

      <TeacherCreateModal
        open={isCreating}
        onClose={() => setIsCreating(false)}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Excluir Professor"
        description={`Deseja excluir o professor "${pendingDelete?.teacher_name}"?\nO registro do professor será removido, mas a conta de login (usuário no sistema) permanecerá ativa.`}
        confirmLabel="Excluir"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setPendingDelete(null)}
      />

      <ConfirmDialog
        open={pendingRestore !== null}
        title="Restaurar Professor"
        description={`Deseja restaurar o professor "${pendingRestore?.teacher_name}"?\nO registro voltará a ficar ativo no sistema.`}
        confirmLabel="Restaurar"
        isLoading={isRestoring}
        onConfirm={handleConfirmRestore}
        onClose={() => setPendingRestore(null)}
      />
    </>
  )
}
