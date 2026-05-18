import { GraduationCap } from 'lucide-react'

export function LoginHeader() {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
        <GraduationCap className="h-6 w-6 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-white">SchoolManager</h1>
      <p className="mt-1 text-sm text-slate-400">Sistema de Gestão Escolar</p>
    </div>
  )
}
