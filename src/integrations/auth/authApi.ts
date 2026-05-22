import { createApi } from '../../lib/api'
import type { LoginResponse } from '../../types/auth'

const api = createApi('auth')

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/login', { email, password })
  return data
}
