import { useQuery } from '@tanstack/react-query'
import { getMeApi } from '@/integrations/users/usersApi'

export function useProfile() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMeApi,
    staleTime: 5 * 60 * 1000,
  })
}
