import { create } from '@/lib/api'
import type { MeResponse } from '@/types/auth'

const api = create('users')

export async function getMe(): Promise<MeResponse> {
  const { data } = await api.get<MeResponse>('/me')
  return data
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
): Promise<void> {
  await api.post('/changePassword', { oldPassword, newPassword })
}
