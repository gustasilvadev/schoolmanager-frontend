import { KeyRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useChangePassword } from '@/hooks/useChangePassword'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ProfileCard } from './ProfileCard'
import type { Accent } from './theme'

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Campo obrigatório'),
    newPassword: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Campo obrigatório'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type PasswordForm = z.infer<typeof passwordSchema>

export function ChangePasswordForm({ accent }: { accent: Accent }) {
  const { mutate: changePassword, isPending } = useChangePassword()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })

  function onSubmit(values: PasswordForm) {
    changePassword(
      { oldPassword: values.oldPassword, newPassword: values.newPassword },
      { onSuccess: () => reset() },
    )
  }

  return (
    <ProfileCard
      icon={<KeyRound className="h-4 w-4" />}
      title="Alterar Senha"
      accent={accent}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 sm:grid-cols-3"
      >
        <Input
          label="Senha atual"
          type="password"
          placeholder="••••••••"
          error={errors.oldPassword?.message}
          {...register('oldPassword')}
        />
        <Input
          label="Nova senha"
          type="password"
          placeholder="••••••••"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <div className="flex justify-end sm:col-span-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Salvar nova senha'}
          </Button>
        </div>
      </form>
    </ProfileCard>
  )
}
