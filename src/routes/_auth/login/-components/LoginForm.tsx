import { useState } from 'react'
import { useLogin } from '../../../../hooks/useLogin'
import { Button } from '#/components/ui/Button'
import { Input } from '#/components/ui/Input'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate: login, isPending } = useLogin()

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    login({ email, password })
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
      <h2 className="mb-6 text-lg font-semibold text-white">Entrar na conta</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        <Button type="submit" size="full" disabled={isPending} className="mt-2">
          {isPending ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  )
}
