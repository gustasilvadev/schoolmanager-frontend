import type { Test } from '@/types/test'
import { Button } from '@/components/ui/Button'
import { Pencil, Trash2, ClipboardList } from 'lucide-react'
import { useDeleteTest } from '@/hooks/useTests'
import { Link } from '@tanstack/react-router'

interface TestActionsProps {
  test: Test
  onEdit: (test: Test) => void
}

export function TestActions({ test, onEdit }: TestActionsProps) {
  const { mutate: deleteTest, isPending } = useDeleteTest()

  const handleDelete = () => {
    if (confirm(`Deseja realmente excluir a avaliação "${test.test_type}"?`)) {
      deleteTest(test.test_id)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        to="/teacher/avaliacoes/$id/lancar"
        params={{ id: test.test_id.toString() }}
        className="inline-flex"
      >
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
          title="Lançar notas"
        >
          <ClipboardList className="w-4 h-4" />
          <span className="hidden md:inline">Lançar notas</span>
        </Button>
      </Link>

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
        disabled={isPending}
        className="text-red-400 hover:text-red-300"
        title="Excluir"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
