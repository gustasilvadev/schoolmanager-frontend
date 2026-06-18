import type { GradeWithTest } from '@/types/grade'
import type { FinalAverage } from '@/types/finalAverage'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Calculator } from 'lucide-react'

interface DisciplineGradeCardProps {
  disciplineName: string
  grades: GradeWithTest[]
  finalAverage?: FinalAverage
  canCalculate?: boolean
  onCalculate?: (classDisciplineId: string) => void
}

export function DisciplineGradeCard({
  disciplineName,
  grades,
  finalAverage,
  canCalculate,
  onCalculate,
}: DisciplineGradeCardProps) {
  const approvalStatus =
    finalAverage
      ? finalAverage.final_average_value >= 5 ? 'APROVADO' : 'REPROVADO'
      : null

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
      <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          {disciplineName}
        </h3>
        {approvalStatus && (
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest',
              approvalStatus === 'APROVADO'
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400',
            )}
          >
            {approvalStatus}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/50">
              <th className="py-2.5 px-4 font-semibold text-slate-500">Avaliação</th>
              <th className="py-2.5 px-4 font-semibold text-slate-500 text-center w-20">Nota</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {grades.map((grade) => (
              <tr key={grade.grade_id} className="hover:bg-slate-800/20 transition-colors">
                <td className="py-2.5 px-4 text-slate-300 font-medium">
                  {grade.tests.test_type}
                  {grade.tests.test_description && (
                    <span className="text-slate-500 ml-1">— {grade.tests.test_description}</span>
                  )}
                </td>
                <td className="py-2.5 px-4 text-white text-center font-bold">
                  {grade.grade_value.toString().replace('.', ',')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-900/30 flex items-center justify-between mt-2 border-t border-slate-800/50">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            Média Final
          </span>
          <span className={cn('text-xl font-black', finalAverage ? 'text-white' : 'text-slate-600')}>
            {finalAverage ? finalAverage.final_average_value.toFixed(2).replace('.', ',') : '—'}
          </span>
        </div>

        {!finalAverage && canCalculate && grades.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
            onClick={() => onCalculate?.(grades[0].tests.class_discipline_id.toString())}
          >
            <Calculator className="w-4 h-4" />
            Calcular
          </Button>
        )}
      </div>
    </div>
  )
}
