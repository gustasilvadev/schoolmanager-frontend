import { useQuery } from '@tanstack/react-query'
import { listNotices } from '@/integrations/notices/noticesApi'
import type { ListNoticesParams } from '@/types/notice'

export function useNotices(params?: ListNoticesParams) {
  return useQuery({
    queryKey: ['notices', params],
    queryFn: () => listNotices(params),
    staleTime: 3 * 60 * 1000,
    retry: false,
  })
}
