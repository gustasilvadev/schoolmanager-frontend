type UserStatus = 0 | 1 | 2
type UserRole = 'ADMIN' | 'TEACHER'

export interface User {
  user_id: number
  user_email: string
  user_status: UserStatus
  role: UserRole
  teacher_id?: number | null
  user_photo?: string | null
}

export interface ListUsersParams {
  page?: number
  limit?: number
  status?: UserStatus
  email?: string
  includeDeleted?: boolean
}

export type ListUsersResponse = User[]

export interface CreateUserPayload {
  email: string
  password: string
  role?: UserRole
  status?: UserStatus
  teacher_name?: string
  teacher_cpf?: string
}

export interface UpdateUserPayload {
  email?: string
  status?: UserStatus
}

export interface RestoreUserResponse {
  message: string
  user: User
}

export interface CreateUserTeacherPayload {
  email: string
  password: string
  role: 'TEACHER'
  teacher_name: string
  teacher_cpf: string
}

export interface CreatedUserResponse {
  user_id: number
  user_email: string
  user_status: number
  role: string | null
}
