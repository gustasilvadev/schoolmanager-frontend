import { Link } from '@tanstack/react-router'
import {
  Bell,
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  UserCircle,
  UserCog,
  Users,
} from 'lucide-react'
import { cn } from '#/lib/utils'

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Alunos', to: '/admin/alunos', icon: Users },
  { label: 'Professores', to: '/admin/professores', icon: GraduationCap },
  { label: 'Turmas', to: '/admin/turmas', icon: BookOpen },
  { label: 'Usuários', to: '/admin/usuarios', icon: UserCog },
  { label: 'Avaliações', to: '/admin/avaliacoes', icon: ClipboardList },
  { label: 'Avisos', to: '/admin/avisos', icon: Bell },
  { label: 'Perfil', to: '/admin/perfil', icon: UserCircle },
] as const

export function AdminSidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900">
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">SchoolManager</p>
          <p className="text-xs text-slate-400">Administrador</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                activeProps={{ className: 'bg-blue-600 text-white' }}
                inactiveProps={{ className: 'text-white hover:bg-white/10' }}
                className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150')}
              >
                <item.icon className="h-4 w-4 shrink-0 text-white" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
