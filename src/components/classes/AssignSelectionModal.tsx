import { useState, useMemo } from 'react'
import { AlertTriangle, Loader2, Search } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { CheckboxList } from './CheckboxList'

export interface SelectionItem {
  id: number
  label: string
  sublabel?: string
}

interface AssignSelectionModalProps {
  open: boolean
  title: string
  isLoading: boolean
  isError?: boolean
  items: SelectionItem[]
  searchPlaceholder?: string
  confirmLabel?: string
  isPending?: boolean
  onConfirm: (ids: number[]) => void
  onClose: () => void
}

export function AssignSelectionModal({
  open,
  title,
  isLoading,
  isError = false,
  items,
  searchPlaceholder = 'Buscar...',
  confirmLabel = 'Adicionar',
  isPending = false,
  onConfirm,
  onClose,
}: AssignSelectionModalProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return items
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.sublabel?.toLowerCase().includes(q),
    )
  }, [items, search])

  function toggleItem(id: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    const allSelected =
      filtered.length > 0 && filtered.every((item) => selected.has(item.id))
    setSelected((prev) => {
      const next = new Set(prev)
      if (allSelected) filtered.forEach((item) => next.delete(item.id))
      else filtered.forEach((item) => next.add(item.id))
      return next
    })
  }

  function handleConfirm() {
    onConfirm(Array.from(selected))
    setSelected(new Set())
    setSearch('')
  }

  function handleClose() {
    setSelected(new Set())
    setSearch('')
    onClose()
  }

  return (
    <Modal open={open} title={title} onClose={handleClose} className="max-w-lg">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {isLoading ? (
          <div className="flex h-52 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          </div>
        ) : isError ? (
          <div className="flex h-52 flex-col items-center justify-center gap-2 rounded-lg border border-red-900/40 bg-red-950/20">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="text-sm text-slate-300">Erro ao carregar os dados.</p>
            <p className="text-xs text-slate-500">
              Verifique a conexão com o servidor.
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-52 items-center justify-center rounded-lg border border-slate-800">
            <p className="text-sm text-slate-500">
              Nenhum item disponível para adicionar.
            </p>
          </div>
        ) : (
          <CheckboxList
            items={filtered}
            selected={selected}
            onToggle={toggleItem}
            onToggleAll={toggleAll}
          />
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={selected.size === 0 || isPending}
          >
            {isPending
              ? 'Adicionando...'
              : `${confirmLabel}${selected.size > 0 ? ` (${selected.size})` : ''}`}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
