import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useUpdateUser } from '@/hooks/useUsers'
import type { User } from '@/types/user'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  status: z.string(),
})

type FormValues = z.infer<typeof schema>

interface UserEditModalProps {
  user: User | null
  open: boolean
  onClose: () => void
}

export function UserEditModal({ user, open, onClose }: UserEditModalProps) {
  const { mutateAsync: updateUser, isPending } = useUpdateUser()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (user) {
      reset({
        email: user.user_email,
        status: String(user.user_status === 0 ? 0 : 1),
      })
    }
  }, [user, reset])

  async function onSubmit(values: FormValues) {
    if (!user) return
    try {
      await updateUser({
        id: user.user_id,
        payload: { email: values.email, status: Number(values.status) as 0 | 1 },
      })
      toast.success('Usuário atualizado com sucesso')
      onClose()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao atualizar usuário'
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Editar Usuário">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          placeholder="usuario@escola.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Status
          </label>
          <select
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            {...register('status')}
          >
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
          </select>
          <p className="text-xs text-slate-500">
            A senha não pode ser alterada aqui. O usuário pode alterá-la no próprio perfil.
          </p>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
