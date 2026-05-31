export interface GradeSheetStudent {
  student_id: number
  student_name?: string
}

export interface Student {
  student_id: number
  student_name: string
  student_cpf: string | null
  student_email: string
  student_birthday: string | null
  student_status: number
}

export interface ListStudentsParams {
  page?: number
  limit?: number
  name?: string
  cpf?: string
  email?: string
  status?: number
  includeDeleted?: boolean
}

export interface ListStudentsResponse {
  students: Student[]
  total: number
  page: number
  limit: number
}
