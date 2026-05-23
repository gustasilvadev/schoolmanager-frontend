import { createApi } from '../../lib/api'
import type { LoginResponse } from '../../types/auth'

const api = createApi('auth')

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/login', { email, password })
  return data
}

export async function logout(): Promise<void> {
  await api.post('/logout')
}
