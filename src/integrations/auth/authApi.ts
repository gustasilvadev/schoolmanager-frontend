import { createApi } from '../../lib/api'

const api = createApi('auth')
import type { LoginResponse } from '../../types/auth'

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password })
  return data
}
