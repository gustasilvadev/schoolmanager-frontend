import { createFileRoute, redirect } from '@tanstack/react-router'
import { getStoredSession } from '@/context/AuthContext'
import { LoginForm } from './-components/LoginForm'
import { LoginHeader } from './-components/LoginHeader'

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
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-md px-6">
        <LoginHeader />
        <LoginForm />
        <p className="mt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} SchoolManager. Todos os direitos
          reservados.
        </p>
      </div>
    </div>
  )
}
