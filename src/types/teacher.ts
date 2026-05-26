export interface Teacher {
  teacher_id: number
  teacher_name: string
  teacher_cpf: string
  teacher_email: string
  teacher_status: number
  user_id: number
}

export interface TeacherDisciplinesResponse {
  discipline_ids: number[]
}

export interface ListTeachersParams {
  page?: number
  limit?: number
  name?: string
  cpf?: string
  email?: string
  status?: number
  includeDeleted?: boolean
}

export interface ListTeachersResponse {
  teachers: Teacher[]
  total: number
  page: number
  limit: number
}
