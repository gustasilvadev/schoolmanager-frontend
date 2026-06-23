import { LogOut } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'

export function AdminHeader() {
  const { session, clearAuth } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    clearAuth()
    navigate({ to: '/login' })
  }

  return (
    <header className="flex h-20 items-center justify-end border-b border-slate-800 bg-slate-900 px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate({ to: '/admin/perfil' })}
          title="Ver perfil"
          className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <Avatar src={session?.userPhoto} name={session?.userEmail} size="sm" />
          <span>{session?.userEmail}</span>
        </button>

        <div className="h-4 w-px bg-slate-700" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  )
}
