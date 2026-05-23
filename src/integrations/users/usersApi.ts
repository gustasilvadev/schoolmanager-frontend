import { createApi } from '@/lib/api'
import type { MeResponse } from '@/types/auth'

const api = createApi('users')

export async function getMeApi(): Promise<MeResponse> {
  const { data } = await api.get<MeResponse>('/me')
  return data
}

export async function changePasswordApi(
  oldPassword: string,
  newPassword: string,
): Promise<void> {
  await api.post('/changePassword', { oldPassword, newPassword })
}
