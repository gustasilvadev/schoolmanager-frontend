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
