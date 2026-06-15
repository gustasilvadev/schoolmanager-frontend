import { GradeCell } from './GradeCell'
import { Button } from '@/components/ui/Button'
import { Save, AlertCircle, Loader2, Users } from 'lucide-react'
import { useGradeSheetSave } from '@/hooks/useGradeSheetSave'
import type { GradeSheetStudent } from '@/types/student'
import type { Grade } from '@/types/grade'

interface GradeSheetProps {
  testId: number
  students: GradeSheetStudent[]
  existingGrades: Grade[]
}

export function GradeSheet({ testId, students, existingGrades }: GradeSheetProps) {
  const { formState, handleRowChange, handleSaveAll, isSaving } = useGradeSheetSave(
    testId,
    students,
    existingGrades,
  )

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

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">
          <Users className="h-8 w-8 text-slate-600" />
          <p className="text-slate-400 text-sm">Nenhum aluno matriculado nesta turma.</p>
          <p className="text-slate-500 text-xs">Matricule alunos na turma para poder lançar notas.</p>
        </div>
      ) : (
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
      )}

      {students.length > 0 && (
        <div className="flex justify-end pt-4">
          <Button onClick={handleSaveAll} disabled={isSaving} className="flex items-center gap-2 min-w-[140px]">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar tudo
          </Button>
        </div>
      )}
    </div>
  )
}
