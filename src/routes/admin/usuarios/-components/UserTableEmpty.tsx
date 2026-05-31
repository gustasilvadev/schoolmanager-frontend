import { Loader2 } from 'lucide-react'

interface UserTableEmptyProps {
  isLoading: boolean
}

export function UserTableEmpty({ isLoading }: UserTableEmptyProps) {
  return (
    <div className="flex h-48 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
      ) : (
        <p className="text-sm text-slate-500">Nenhum usuário encontrado.</p>
      )}
    </div>
  )
}
