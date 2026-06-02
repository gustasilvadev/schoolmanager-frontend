export interface GradeSheetStudent {
  student_id: number
  student_name?: string
}

export interface StudentResponsible {
  responsibles: {
    responsible_id: number
    responsible_name: string
    responsible_email: string
    responsible_status: number
  }
}

export interface Student {
  student_id: number
  student_name: string
  student_cpf: string | null
  student_email: string
  student_birthday: string | null
  student_status: number
  student_responsibles?: StudentResponsible[]
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

export interface CreateResponsiblePayload {
  responsible_name: string
  responsible_email: string
}

export interface CreateStudentPayload {
  student_name: string
  student_cpf: string
  student_email: string
  student_birthday: string
  student_status?: number
  responsibles?: CreateResponsiblePayload[]
}

export interface UpdateStudentPayload {
  student_name?: string
  student_cpf?: string
  student_email?: string
  student_birthday?: string
  student_status?: number
  responsibles?: CreateResponsiblePayload[]
}

export interface RestoreStudent {
  message: string
  student: Student
}
