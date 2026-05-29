import type { Test, StatusValue } from './test'

export interface Grade {
  grade_id: number
  grade_value: number
  test_id: number
  student_id: number
  grade_status: StatusValue
}

export interface GradeWithTest extends Grade {
  tests: Test
}

export interface BulkCreateGradesDTO {
  grades: Array<{
    student_id: number
    test_id: number
    grade_value: number
  }>
}

export interface BulkCreateGradesResponse {
  message: string
  count: number
}

export interface UpdateGradeDTO {
  grade_value?: number
}
