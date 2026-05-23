export interface AuthSession {
  token: string
  role: 'ADMIN' | 'TEACHER'
  userId: number
  userEmail: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginUserData {
  user_id: number
  user_email: string
  role: 'ADMIN' | 'TEACHER'
  teacher_id?: number
  user_status: number
}

export interface LoginResponse {
  token: string
  user: LoginUserData
}
