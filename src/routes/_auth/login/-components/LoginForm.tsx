import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { GraduationCap } from 'lucide-react'
import { useLogin } from '@/hooks/useLogin'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'

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
    <div className="space-y-8">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-white">SchoolManager</span>
      </div>
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold text-white">Acesse sua conta</h1>
        <p className="text-sm text-slate-500">
          Entre com suas credenciais para continuar.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <PasswordInput
          label="Senha"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button
          type="submit"
          size="full"
          disabled={isPending}
          className="mt-1"
        >
          {isPending ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  )
}
