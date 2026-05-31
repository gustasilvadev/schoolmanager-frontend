import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { ClassDisciplineFilter } from './-components/ClassDisciplineFilter'
import { TestList } from './-components/TestList'
import { TestFormModal } from '@/components/tests/TestFormModal'
import { useTests } from '@/hooks/useTests'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import type { Test } from '@/types/test'

const testsSearchSchema = z.object({
  classId: z.number().optional(),
  classDisciplineId: z.number().optional(),
})

type TestsSearch = z.infer<typeof testsSearchSchema>

export const Route = createFileRoute('/teacher/avaliacoes/')({
  validateSearch: (search: Record<string, unknown>): TestsSearch => {
    return {
      classId: Number(search.classId) || undefined,
      classDisciplineId: Number(search.classDisciplineId) || undefined,
    }
  },
  component: AvaliacoesPage,
})

function AvaliacoesPage() {
  const { classId, classDisciplineId } = Route.useSearch()
  const navigate = Route.useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<Test | undefined>()

  const { data: allTestsData, isLoading } = useTests({
    class_discipline_id: classDisciplineId,
  })

  const handleClassChange = (id?: number) => {
    navigate({
      search: (prev) => ({ ...prev, classId: id, classDisciplineId: undefined }),
    })
  }

  const handleClassDisciplineChange = (id?: number) => {
    navigate({ search: (prev) => ({ ...prev, classDisciplineId: id }) })
  }

  const handleCreate = () => {
    setEditingTest(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (test: Test) => {
    setEditingTest(test)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTest(undefined)
  }

  const tests = allTestsData?.tests ?? []

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Avaliações</h1>
          <p className="text-slate-400 text-sm">
            Gerencie as provas e trabalhos de suas turmas.
          </p>
        </div>

        <Button className="flex items-center gap-2 h-11" onClick={handleCreate}>
          <Plus className="w-5 h-5" />
          Nova avaliação
        </Button>
      </div>

      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <ClassDisciplineFilter
          selectedClassId={classId}
          onClassChange={handleClassChange}
          selectedClassDisciplineId={classDisciplineId}
          onClassDisciplineChange={handleClassDisciplineChange}
        />
      </div>

      <div className="bg-slate-900/30 rounded-2xl border border-slate-800 overflow-hidden">
        <TestList tests={tests} isLoading={isLoading} onEdit={handleEdit} />
      </div>

      <TestFormModal open={isModalOpen} onClose={handleCloseModal} test={editingTest} />
    </div>
  )
}
