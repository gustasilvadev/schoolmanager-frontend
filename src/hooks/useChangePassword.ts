import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { changePassword } from '@/integrations/users/usersApi'

export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string
      newPassword: string
    }) => changePassword(oldPassword, newPassword),
    onSuccess: () => {
      toast.success('Senha alterada com sucesso')
    },
    onError: () => {
      toast.error('Senha atual incorreta')
    },
  })
}
