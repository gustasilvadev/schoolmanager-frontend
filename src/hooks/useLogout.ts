import { useNavigate } from '@tanstack/react-router'
import { logout } from '../integrations/auth/authApi'
import { useAuth } from './useAuth'

export function useLogout() {
  const { clearAuth } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
    } catch (error) {
      console.error('[useLogout] erro ao notificar servidor:', error)
    } finally {
      clearAuth()
      navigate({ to: '/login' })
    }
  }

  return { handleLogout }
}
