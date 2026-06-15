type VisibilityType = 'public' | 'restricted'

interface VisibilitySelectorProps {
  value: VisibilityType
  onChange: (value: VisibilityType) => void
}

export function VisibilitySelector({
  value,
  onChange,
}: VisibilitySelectorProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-300">Visibilidade</p>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300 transition hover:border-blue-500/50">
          <input
            type="radio"
            name="visibility"
            value="public"
            checked={value === 'public'}
            onChange={() => onChange('public')}
          />
          <div>
            <p className="font-medium text-white">Pública</p>
            <p className="text-xs text-slate-500">
              Todos os professores poderão visualizar.
            </p>
          </div>
        </label>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300 transition hover:border-blue-500/50">
          <input
            type="radio"
            name="visibility"
            value="restricted"
            checked={value === 'restricted'}
            onChange={() => onChange('restricted')}
          />
          <div>
            <p className="font-medium text-white">Restrita</p>
            <p className="text-xs text-slate-500">
              Selecione quais professores poderão visualizar.
            </p>
          </div>
        </label>
      </div>
    </div>
  )
}
