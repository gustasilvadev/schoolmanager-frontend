import { LogOut, UserCircle } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '#/hooks/useAuth'
import { Button } from '#/components/ui/Button'

export function TeacherHeader() {
  const { session, clearAuth } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    clearAuth()
    navigate({ to: '/login' })
  }

  return (
    <header className="flex h-20 items-center justify-end border-b border-slate-800 bg-slate-900 px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <UserCircle className="h-4 w-4 text-slate-400" />
          <span>{session?.userEmail}</span>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  )
}
