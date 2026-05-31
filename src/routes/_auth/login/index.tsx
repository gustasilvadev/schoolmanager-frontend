import { createFileRoute, redirect } from '@tanstack/react-router'
import { getStoredSession } from '@/context/AuthContext'
import { LoginForm } from './-components/LoginForm'

export const Route = createFileRoute('/_auth/login/')({
  beforeLoad: () => {
    const session = getStoredSession()
    if (session) {
      throw redirect({
        to:
          session.role === 'ADMIN' ? '/admin/dashboard' : '/teacher/dashboard',
      })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6">
      {/* Spotlight — halo externo */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-140 w-140 rounded-full bg-indigo-700/8 blur-3xl" />
      {/* Spotlight — glow médio */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-indigo-600/15 blur-2xl" />
      {/* Spotlight — núcleo brilhante */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-28 w-28 rounded-full bg-indigo-400/25 blur-xl" />
      {/* Acento azul deslocado */}
      <div className="pointer-events-none absolute top-2/3 left-1/3 -translate-x-1/2 -translate-y-1/2 h-56 w-56 rounded-full bg-blue-500/6 blur-3xl" />

      <div className="relative z-10 w-full max-w-sm">
        <LoginForm />
      </div>
      <p className="relative z-10 mt-10 text-xs text-slate-700">
        © {new Date().getFullYear()} SchoolManager. Todos os direitos
        reservados.
      </p>
    </div>
  )
}
