import { useState } from 'react'
import { formatGradeDisplay, parseGradeValue } from '@/utils/grade'
import { cn } from '@/lib/utils'

interface GradeCellProps {
  studentId: string
  studentName: string
  initialValue?: number
  maxScore?: number
  onChange: (data: { value: string }) => void
  isSaving?: boolean
  saveStatus?: 'idle' | 'success' | 'error'
}

export function GradeCell({
  studentName,
  initialValue,
  onChange,
  isSaving,
  saveStatus,
}: GradeCellProps) {
  const [value, setValue] = useState(formatGradeDisplay(initialValue))

  const isEdited = value !== formatGradeDisplay(initialValue)
  const numericValue = parseGradeValue(value)
  const isInvalid = !isNaN(numericValue) && (numericValue < 0 || numericValue > 10)

  return (
    <tr
      className={cn(
        'border-b border-slate-800/50 transition-colors',
        isEdited ? 'bg-blue-900/10' : 'hover:bg-slate-900/30',
      )}
    >
      <td className="py-3 px-4 text-sm text-white font-medium">{studentName}</td>
      <td className="py-3 px-4">
        <div className="relative max-w-[100px]">
          <input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => {
              const next = e.target.value
              setValue(next)
              onChange({ value: next })
            }}
            disabled={isSaving}
            placeholder="0,0"
            className={cn(
              'w-full bg-slate-800 border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 transition-all',
              isInvalid
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-700 focus:ring-blue-500',
              isSaving && 'opacity-50',
            )}
          />
          {isInvalid && (
            <span className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-medium truncate w-full">
              Máx: 10
            </span>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        {saveStatus === 'success' && (
          <span className="text-xs text-green-400 flex items-center justify-end gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Salvo
          </span>
        )}
        {saveStatus === 'error' && (
          <span className="text-xs text-red-400 flex items-center justify-end gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Erro
          </span>
        )}
        {isEdited && saveStatus !== 'success' && (
          <span className="text-xs text-blue-400 flex items-center justify-end gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Pendente
          </span>
        )}
        {!isEdited && !saveStatus && initialValue !== undefined && (
          <span className="text-xs text-slate-500 flex items-center justify-end gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Lançado
          </span>
        )}
      </td>
    </tr>
  )
}
