import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Search, UserPlus, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useUsers, useDeleteUser, useRestoreUser } from '@/hooks/useUsers'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { UserTable } from './-components/UserTable'
import { UserViewModal } from './-components/UserViewModal'
import { UserEditModal } from './-components/UserEditModal'
import { UserCreateModal } from './-components/UserCreateModal'
import type { User } from '@/types/user'

export const Route = createFileRoute('/admin/usuarios/')({
  component: UsuariosPage,
})

const LIMIT = 10

function UsuariosPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [includeDeleted, setIncludeDeleted] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [viewingUser, setViewingUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [pendingDelete, setPendingDelete] = useState<User | null>(null)
  const [pendingRestore, setPendingRestore] = useState<User | null>(null)

  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser()
  const { mutateAsync: restoreUser, isPending: isRestoring } = useRestoreUser()

  const { data: users = [], isLoading, isError } = useUsers({
    page,
    limit: LIMIT,
    includeDeleted,
    email: search || undefined,
  })

  const hasMore = users.length === LIMIT
  const hasPrev = page > 1

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleToggleDeleted(checked: boolean) {
    setIncludeDeleted(checked)
    setPage(1)
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return
    try {
      await deleteUser(pendingDelete.user_id)
      toast.success('Usuário excluído com sucesso')
      setPendingDelete(null)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao excluir usuário',
      )
    }
  }

  async function handleConfirmRestore() {
    if (!pendingRestore) return
    try {
      const { message } = await restoreUser(pendingRestore.user_id)
      toast.success(message)
      setPendingRestore(null)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao restaurar usuário',
      )
    }
  }

  useEffect(() => {
    if (isError) {
      console.error('[useUsers] erro ao carregar usuários')
      toast.error('Erro ao carregar usuários')
    }
  }, [isError])

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Usuários</h1>
              <p className="text-xs text-slate-400">
                {users.length > 0
                  ? `${users.length}${hasMore ? '+' : ''} usuário${users.length !== 1 ? 's' : ''} nesta página`
                  : 'Nenhum usuário'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => setIsCreating(true)}>
              <UserPlus className="h-4 w-4" />
              Novo Usuário
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
            placeholder="Buscar por e-mail..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <UserTable
          users={users}
          isLoading={isLoading}
          onView={(user) => setViewingUser(user)}
          onEdit={(user) => setEditingUser(user)}
          onDelete={(user) => setPendingDelete(user)}
          onRestore={(user) => setPendingRestore(user)}
        />

        {(hasPrev || hasMore) && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">Página {page}</p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!hasPrev}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <UserViewModal
        user={viewingUser}
        open={viewingUser !== null}
        onClose={() => setViewingUser(null)}
      />

      <UserEditModal
        user={editingUser}
        open={editingUser !== null}
        onClose={() => setEditingUser(null)}
      />

      <UserCreateModal open={isCreating} onClose={() => setIsCreating(false)} />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Excluir Usuário"
        description={`Deseja excluir o usuário "${pendingDelete?.user_email}"?\nO acesso ao sistema será bloqueado. A ação pode ser desfeita via restauração.`}
        confirmLabel="Excluir"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setPendingDelete(null)}
      />

      <ConfirmDialog
        open={pendingRestore !== null}
        title="Restaurar Usuário"
        description={`Deseja restaurar o usuário "${pendingRestore?.user_email}"?\nO acesso ao sistema será reativado.`}
        confirmLabel="Restaurar"
        isLoading={isRestoring}
        onConfirm={handleConfirmRestore}
        onClose={() => setPendingRestore(null)}
      />
    </>
  )
}
