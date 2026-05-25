import { useQuery } from '@tanstack/react-query'
import { getMe } from '@/integrations/users/usersApi'

export function useProfile() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  })
}
