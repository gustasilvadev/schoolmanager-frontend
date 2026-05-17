import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { loginApi } from '../integrations/auth/authApi'
import { useAuth } from './useAuth'

export function useLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),

    onSuccess: (data) => {
      console.log('[Login] Sucesso:', data.user.user_email, '| Role:', data.user.role)

      login({
        token: data.token,
        role: data.user.role,
        userId: data.user.user_id,
        userEmail: data.user.user_email,
      })

      navigate({
        to: data.user.role === 'ADMIN' ? '/admin/dashboard' : '/teacher/dashboard',
      })
    },

    onError: (error: Error) => {
      console.log('[Login] Falhou:', error.message)
    },
  })
}
