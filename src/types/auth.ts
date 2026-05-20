export interface AuthSession {
  token: string
  role: 'ADMIN' | 'TEACHER'
  userId: number
  userEmail: string
}

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
