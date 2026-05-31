import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCreateUser } from '@/hooks/useUsers'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['ADMIN', 'TEACHER']),
  teacher_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(45),
  teacher_cpf: z
    .string()
    .min(11, 'CPF inválido')
    .max(14)
    .refine((v) => v.replace(/\D/g, '').length >= 11, 'CPF inválido'),
})

type FormValues = z.infer<typeof schema>

interface UserCreateModalProps {
  open: boolean
  onClose: () => void
}

export function UserCreateModal({ open, onClose }: UserCreateModalProps) {
  const { mutateAsync: createUser, isPending } = useCreateUser()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'ADMIN' },
  })

  const selectedRole = watch('role')

  function handleRoleChange(role: 'ADMIN' | 'TEACHER') {
    setValue('role', role)
  }

  async function onSubmit(values: FormValues) {
    try {
      await createUser({
        email: values.email,
        password: values.password,
        role: values.role,
        teacher_name: values.teacher_name,
        teacher_cpf: values.teacher_cpf,
      })
      toast.success('Usuário criado com sucesso!')
      handleClose()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao criar usuário'
      toast.error(message)
    }
  }

  function handleClose() {
    reset({ role: 'ADMIN' })
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} title="Novo Usuário">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Papel no Sistema
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleRoleChange('ADMIN')}
              className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                selectedRole === 'ADMIN'
                  ? 'border-blue-500 bg-blue-600/15 text-blue-400'
                  : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              Administrador
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('TEACHER')}
              className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                selectedRole === 'TEACHER'
                  ? 'border-emerald-500 bg-emerald-600/15 text-emerald-400'
                  : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              Professor
            </button>
          </div>
          <input type="hidden" {...register('role')} />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Dados Pessoais
          </p>
          <Input
            label="Nome"
            placeholder="Nome completo"
            error={errors.teacher_name?.message}
            {...register('teacher_name')}
          />
          <Input
            label="CPF"
            placeholder="00000000000"
            error={errors.teacher_cpf?.message}
            {...register('teacher_cpf')}
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Conta de Acesso
          </p>
          <Input
            label="E-mail"
            type="email"
            placeholder="usuario@escola.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <div>
            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              error={errors.password?.message}
              {...register('password')}
            />
            <p className="mt-1 text-xs text-slate-500">
              O usuário poderá alterar a senha após o primeiro acesso
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Criando...' : 'Criar Usuário'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
