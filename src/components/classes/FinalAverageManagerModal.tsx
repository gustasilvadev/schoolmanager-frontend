import { useEffect, useState } from 'react'
import { Calculator, Check, Loader2, RotateCcw, Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import {
  useCalculateAveragesBatch,
  useDeleteFinalAverage,
  useRestoreFinalAverage,
  useUpdateFinalAverage,
} from '@/hooks/useFinalAverages'
import { STATUS } from '@/types/test'
import { approvalStatus, formatAverage } from '@/utils/averages'
import type { FinalAverage } from '@/types/finalAverage'

export interface FinalAverageRow {
  label: string
  average: FinalAverage
}

interface FinalAverageManagerModalProps {
  open: boolean
  title: string
  subtitle?: string
  rows: FinalAverageRow[]
  isLoading?: boolean
  onClose: () => void
}

export function FinalAverageManagerModal({
  open,
  title,
  subtitle,
  rows,
  isLoading,
  onClose,
}: FinalAverageManagerModalProps) {
  const { mutate: calculateBatch, isPending: isCalculating } =
    useCalculateAveragesBatch()

  function handleRecalculate() {
    if (rows.length === 0) return
    calculateBatch(
      rows.map((r) => ({
        studentId: r.average.student_id,
        classDisciplineId: r.average.class_discipline_id,
      })),
    )
  }

  return (
    <Modal open={open} title={title} onClose={onClose} className="max-w-lg">
      {subtitle && <p className="-mt-3 mb-4 text-xs text-slate-400">{subtitle}</p>}

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
        </div>
      ) : rows.length === 0 ? (
        <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-slate-800">
          <p className="text-sm text-slate-500">Nenhuma média lançada ainda.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <AverageRow key={row.average.final_average_id} row={row} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-5">
        {rows.length > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRecalculate}
            disabled={isCalculating}
            className="flex items-center gap-2 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
            title="Recalcular as médias a partir das notas atuais"
          >
            {isCalculating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Calculator className="h-3.5 w-3.5" />
            )}
            Recalcular
          </Button>
        ) : (
          <span />
        )}
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </Modal>
  )
}

function AverageRow({ row }: { row: FinalAverageRow }) {
  const { average, label } = row
  const isDeleted = average.final_average_status === STATUS.DELETED

  const [value, setValue] = useState(String(average.final_average_value))

  const { mutate: update, isPending: updating } = useUpdateFinalAverage()
  const { mutate: remove, isPending: deleting } = useDeleteFinalAverage()
  const { mutate: restore, isPending: restoring } = useRestoreFinalAverage()

  useEffect(() => {
    setValue(String(average.final_average_value))
  }, [average.final_average_value])

  const parsed = Number(value.replace(',', '.'))
  const isValid = value.trim() !== '' && !Number.isNaN(parsed)
  const changed = isValid && parsed !== average.final_average_value
  const busy = updating || deleting || restoring
  const status = approvalStatus(average.final_average_value)

  function handleSave() {
    if (!changed) return
    update({ id: average.final_average_id, payload: { final_average_value: parsed } })
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{label}</p>
        {isDeleted ? (
          <StatusBadge status={average.final_average_status} />
        ) : (
          status && (
            <span
              className={
                status === 'APROVADO'
                  ? 'text-[10px] font-bold uppercase tracking-widest text-green-400'
                  : 'text-[10px] font-bold uppercase tracking-widest text-red-400'
              }
            >
              {status}
            </span>
          )
        )}
      </div>

      {isDeleted ? (
        <span className="text-sm font-semibold text-slate-500">
          {formatAverage(average.final_average_value)}
        </span>
      ) : (
        <input
          type="number"
          step="0.1"
          min={0}
          max={10}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={busy}
          className="w-20 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-center text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      )}

      <div className="flex items-center gap-1">
        {!isDeleted && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={!changed || busy}
            title="Salvar nota"
            className="h-8 w-8 p-0 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
        )}
        {isDeleted ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => restore(average.final_average_id)}
            disabled={busy}
            title="Restaurar"
            className="h-8 w-8 p-0 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => remove(average.final_average_id)}
            disabled={busy}
            title="Excluir"
            className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
