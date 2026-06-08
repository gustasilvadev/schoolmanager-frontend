import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { login } from '@/integrations/auth/authApi'
import { useAuth } from './useAuth'
import type { LoginCredentials } from '@/types/auth'

export function useLogin() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, password }: LoginCredentials) =>
      login(email, password),

    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ['me'] })
      setAuth({
        role: data.user.role,
        userId: data.user.user_id,
        userEmail: data.user.user_email,
        teacherId: data.user.teacher_id,
      })

      navigate({
        to:
          data.user.role === 'ADMIN'
            ? '/admin/dashboard'
            : '/teacher/dashboard',
      })
    },

    onError: (error: Error) => {
      console.error('[useLogin] falha na autenticação:', error.message)
      toast.error('E-mail ou senha inválidos')
    },
  })
}
