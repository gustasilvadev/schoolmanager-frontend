export interface ClassItem {
  class_id: number
  class_name: string
  class_school_year: string
  class_status: number
}

export interface ClassStudent {
  class_student_id: number
  class_id: number
  student_id: number
  student_name?: string | null
  student_email?: string | null
  student_photo?: string | null
}

export interface ClassTeacher {
  class_teachers_id: number
  class_id: number
  teacher_id: number
  teacher_name?: string | null
  teacher_email?: string | null
}

export interface ClassDisciplineEntry {
  class_discipline_id: number
  class_id: number
  discipline_id: number
  disciplines?: Discipline
}

export interface Discipline {
  discipline_id: number
  discipline_name: string
  discipline_hour: number
  discipline_status: number
}

export interface ListClassesParams {
  page?: number
  limit?: number
  class_name?: string
  class_school_year?: string
  class_status?: number
  includeDeleted?: boolean
}

export interface ListClassesResponse {
  classes: ClassItem[]
  total: number
  page: number
  limit: number
}

export interface ListDisciplinesParams {
  page?: number
  limit?: number
  discipline_name?: string
  discipline_status?: number
  includeDeleted?: boolean
}

export interface ListDisciplinesResponse {
  disciplines: Discipline[]
  total: number
  page: number
  limit: number
}
