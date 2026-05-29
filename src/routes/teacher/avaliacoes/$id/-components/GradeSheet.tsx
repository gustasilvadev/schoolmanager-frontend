import { useState } from 'react'
import { GradeCell } from './GradeCell'
import { Button } from '@/components/ui/Button'
import { Save, AlertCircle, Loader2 } from 'lucide-react'
import { useBulkCreateGrades, useUpdateGrade } from '@/hooks/useGrades'
import { parseGradeValue } from '@/utils/grade'
import { toast } from 'sonner'
import type { Grade } from '@/types/grade'

interface Student {
  student_id: number
  student_name?: string
}

interface GradeSheetProps {
  testId: number
  students: Student[]
  existingGrades: Grade[]
}

interface RowState {
  value: string
  status: 'idle' | 'success' | 'error'
}

export function GradeSheet({ testId, students, existingGrades }: GradeSheetProps) {
  const [formState, setFormState] = useState<Record<string, RowState>>({})
  const { mutateAsync: bulkCreate, isPending: isBulkCreating } = useBulkCreateGrades()
  const { mutateAsync: updateGrade, isPending: isUpdating } = useUpdateGrade()

  const handleRowChange = (studentId: string, data: { value: string }) => {
    setFormState((prev) => ({
      ...prev,
      [studentId]: { value: data.value, status: 'idle' },
    }))
  }

  const handleSaveAll = async () => {
    const toCreate: Array<{ student_id: number; test_id: number; grade_value: number }> = []
    const toUpdate: Array<{ id: number; data: { grade_value: number } }> = []

    students.forEach((student) => {
      const state = formState[student.student_id.toString()]
      if (!state) return

      const existing = existingGrades.find((g) => g.student_id === student.student_id)
      const numericValue = parseGradeValue(state.value)

      if (isNaN(numericValue)) return

      if (numericValue < 0 || numericValue > 10) {
        setFormState((prev) => ({
          ...prev,
          [student.student_id]: { ...state, status: 'error' },
        }))
        return
      }

      if (!existing) {
        toCreate.push({
          student_id: student.student_id,
          test_id: testId,
          grade_value: numericValue,
        })
      } else if (existing.grade_value !== numericValue) {
        toUpdate.push({
          id: existing.grade_id,
          data: { grade_value: numericValue },
        })
      }
    })

    if (toCreate.length === 0 && toUpdate.length === 0) {
      toast.info('Nenhuma alteração para salvar')
      return
    }

    try {
      if (toCreate.length > 0) {
        await bulkCreate({ grades: toCreate })
        toCreate.forEach((item) => {
          setFormState((prev) => ({
            ...prev,
            [item.student_id]: { ...prev[item.student_id.toString()], status: 'success' },
          }))
        })
      }

      if (toUpdate.length > 0) {
        const results = await Promise.allSettled(toUpdate.map((item) => updateGrade(item)))

        results.forEach((result, index) => {
          const item = toUpdate[index]
          const existing = existingGrades.find((g) => g.grade_id === item.id)
          if (!existing) return

          setFormState((prev) => ({
            ...prev,
            [existing.student_id.toString()]: {
              ...prev[existing.student_id.toString()],
              status: result.status === 'fulfilled' ? 'success' : 'error',
            },
          }))
        })
      }

      toast.success('Alterações processadas')
    } catch {
      toast.error('Erro ao salvar algumas notas')
    }
  }

  const isSaving = isBulkCreating || isUpdating

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3 text-slate-400">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          <p className="text-sm">
            Use vírgula para decimais (ex: 8,5). Notas devem estar entre 0 e 10.
          </p>
        </div>
        <Button onClick={handleSaveAll} disabled={isSaving} className="flex items-center gap-2 min-w-[140px]">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar tudo
        </Button>
      </div>

      <div className="bg-slate-900/30 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Aluno
              </th>
              <th className="py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider w-[140px]">
                Nota (0–10)
              </th>
              <th className="py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const existing = existingGrades.find((g) => g.student_id === student.student_id)
              return (
                <GradeCell
                  key={student.student_id}
                  studentId={student.student_id.toString()}
                  studentName={student.student_name || `Aluno ${student.student_id}`}
                  initialValue={existing?.grade_value}
                  onChange={(data) => handleRowChange(student.student_id.toString(), data)}
                  isSaving={isSaving}
                  saveStatus={formState[student.student_id.toString()]?.status}
                />
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSaveAll} disabled={isSaving} className="flex items-center gap-2 min-w-[140px]">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar tudo
        </Button>
      </div>
    </div>
  )
}
