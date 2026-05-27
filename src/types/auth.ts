export interface AuthSession {
  role: 'ADMIN' | 'TEACHER'
  userId: number
  userEmail: string
}

export interface AuthContextValue {
  session: AuthSession | null
  setAuth: (session: AuthSession) => void
  clearAuth: () => void
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
  user: LoginUserData
}

export interface TeacherProfileData {
  teacher_id: number
  teacher_name: string
  teacher_cpf: string
  teacher_email: string
  teacher_status: number
  user_id: number
}

export interface MeResponse {
  user_id: number
  user_email: string
  role: 'ADMIN' | 'TEACHER'
  user_status: number
  teacher: TeacherProfileData | null
}
