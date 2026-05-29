import type { Test } from '@/types/test'
import { STATUS } from '@/types/test'
import { Button } from '@/components/ui/Button'
import { Pencil, Trash2, RotateCcw } from 'lucide-react'
import { useDeleteTest, useRestoreTest } from '@/hooks/useTests'

interface AdminTestActionsProps {
  test: Test
  onEdit: (test: Test) => void
}

export function AdminTestActions({ test, onEdit }: AdminTestActionsProps) {
  const { mutate: deleteTest, isPending: isDeleting } = useDeleteTest()
  const { mutate: restoreTest, isPending: isRestoring } = useRestoreTest()

  const isDeleted = test.test_status === STATUS.DELETED

  const handleDelete = () => {
    if (confirm(`Deseja realmente excluir a avaliação "${test.test_type}"?`)) {
      deleteTest(test.test_id)
    }
  }

  const handleRestore = () => {
    restoreTest(test.test_id)
  }

  if (isDeleted) {
    return (
      <div className="flex items-center justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRestore}
          disabled={isRestoring}
          className="flex items-center gap-2 text-green-400 hover:text-green-300"
          title="Restaurar"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden md:inline">Restaurar</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(test)}
        className="text-slate-400 hover:text-white"
        title="Editar"
      >
        <Pencil className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-400 hover:text-red-300"
        title="Excluir"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
