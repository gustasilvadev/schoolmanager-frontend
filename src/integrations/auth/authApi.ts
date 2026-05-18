const API_URL = import.meta.env.VITE_API_URL

export interface LoginResponse {
  token: string
  user: {
    user_id: number
    user_email: string
    role: 'ADMIN' | 'TEACHER'
    teacher_id?: number
    user_status: number
  }
}

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data.error ?? 'Credenciais inválidas')

  return data
}
