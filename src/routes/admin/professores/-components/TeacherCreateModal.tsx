import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCreateTeacher } from '@/hooks/useTeachers'
import { getTeacherByCpf, getTeacherByEmail } from '@/integrations/teachers/teachersApi'

const schema = z.object({
  teacher_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  teacher_cpf: z.string().min(11, 'CPF inválido').max(14),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type FormValues = z.infer<typeof schema>

interface TeacherCreateModalProps {
  open: boolean
  onClose: () => void
}

export function TeacherCreateModal({ open, onClose }: TeacherCreateModalProps) {
  const { mutateAsync: createTeacher, isPending } = useCreateTeacher()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    let hasConflict = false

    const existingByCpf = await getTeacherByCpf(values.teacher_cpf)
    if (existingByCpf) {
      setError('teacher_cpf', { message: 'CPF já cadastrado' })
      hasConflict = true
    }

    const existingByEmail = await getTeacherByEmail(values.email)
    if (existingByEmail) {
      setError('email', { message: 'E-mail já cadastrado' })
      hasConflict = true
    }

    if (hasConflict) return

    try {
      await createTeacher({
        teacher_name: values.teacher_name,
        teacher_cpf: values.teacher_cpf,
        email: values.email,
        password: values.password,
        role: 'TEACHER',
      })
      toast.success('Professor criado com sucesso!')
      reset()
      onClose()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao criar professor'
      toast.error(message)
    }
  }

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} title="Novo Professor">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Dados do Professor
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
          <div>
            <Input
              label="E-mail"
              type="email"
              placeholder="professor@escola.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <p className="mt-1 text-xs text-slate-500">
              Será usado pelo professor para acessar o sistema
            </p>
          </div>
          <div>
            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              error={errors.password?.message}
              {...register('password')}
            />
            <p className="mt-1 text-xs text-slate-500">
              O professor poderá alterar a senha após o primeiro acesso
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
            {isPending ? 'Criando...' : 'Criar Professor'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
