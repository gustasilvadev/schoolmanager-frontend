import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { getStoredSession } from '../../../context/AuthContext'
import { useLogin } from '../../../hooks/useLogin'

export const Route = createFileRoute('/_auth/login/')({
  beforeLoad: () => {
    const session = getStoredSession()
    if (session) {
      throw redirect({
        to: session.role === 'ADMIN' ? '/admin/dashboard' : '/teacher/dashboard',
      })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate: login, isPending, error } = useLogin()

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    login({ email, password })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-md px-6">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-4.022L12 14z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">SchoolManager</h1>
          <p className="mt-1 text-sm text-slate-400">Sistema de Gestão Escolar</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <h2 className="mb-6 text-lg font-semibold text-white">Entrar na conta</h2>

          {error && (
            <div className="mb-5 rounded-lg border border-red-800 bg-red-950 px-4 py-3">
              <p className="text-sm text-red-400">{error.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} SchoolManager. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
