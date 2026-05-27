import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SelectionItem } from './AssignSelectionModal'

interface CheckboxListProps {
  items: SelectionItem[]
  selected: Set<number>
  onToggle: (id: number) => void
  onToggleAll: () => void
}

export function CheckboxList({
  items,
  selected,
  onToggle,
  onToggleAll,
}: CheckboxListProps) {
  const allSelected = items.length > 0 && items.every((item) => selected.has(item.id))
  const someSelected = items.some((item) => selected.has(item.id)) && !allSelected

  return (
    <>
      <div className="flex items-center justify-between px-1">
        <label className="flex cursor-pointer select-none items-center gap-2.5 text-xs text-slate-400">
          <input
            type="checkbox"
            className="sr-only"
            checked={allSelected}
            onChange={onToggleAll}
          />
          <span
            className={cn(
              'flex h-4 w-4 items-center justify-center rounded border transition',
              allSelected || someSelected
                ? 'border-blue-600 bg-blue-600'
                : 'border-slate-600 bg-slate-900',
            )}
          >
            {allSelected && <Check className="h-2.5 w-2.5 text-white" />}
            {someSelected && <Minus className="h-2 w-2 text-white" />}
          </span>
          Selecionar todos ({items.length})
        </label>

        {selected.size > 0 && (
          <span className="text-xs font-medium text-blue-400">
            {selected.size} selecionado{selected.size !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-800">
        {items.length === 0 ? (
          <div className="flex h-24 items-center justify-center">
            <p className="text-sm text-slate-500">Nenhum resultado.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-800">
            {items.map((item) => {
              const isChecked = selected.has(item.id)
              return (
                <li key={item.id}>
                  <label
                    className={cn(
                      'flex cursor-pointer select-none items-center gap-3 px-4 py-2.5 transition',
                      isChecked ? 'bg-blue-600/10' : 'hover:bg-slate-800/60',
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isChecked}
                      onChange={() => onToggle(item.id)}
                    />
                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition',
                        isChecked
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-slate-600 bg-slate-900',
                      )}
                    >
                      {isChecked && <Check className="h-2.5 w-2.5 text-white" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {item.label}
                      </p>
                      {item.sublabel && (
                        <p className="truncate text-xs text-slate-500">
                          {item.sublabel}
                        </p>
                      )}
                    </div>
                  </label>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
