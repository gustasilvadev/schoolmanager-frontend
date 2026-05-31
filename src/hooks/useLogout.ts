import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { logout } from '@/integrations/auth/authApi'
import { useAuth } from './useAuth'

export function useLogout() {
  const { clearAuth } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  async function handleLogout() {
    try {
      await logout()
    } catch (error) {
      console.error('[useLogout] erro ao notificar servidor:', error)
    } finally {
      clearAuth()
      queryClient.clear()
      navigate({ to: '/login' })
    }
  }

  return { handleLogout }
}
