import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin } from '@/hooks/useLogin'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const loginSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(1, 'Campo obrigatório'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginForm() {
  const { mutate: login, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  function onSubmit(values: LoginForm) {
    login(values)
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
      <h2 className="mb-6 text-lg font-semibold text-white">Entrar na conta</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" size="full" disabled={isPending} className="mt-2">
          {isPending ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  )
}
