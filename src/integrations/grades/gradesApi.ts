import { create } from '@/lib/api'
import { STATUS } from '@/types/test'
import type { Grade, GradeWithTest, BulkCreateGradesDTO, BulkCreateGradesResponse, UpdateGradeDTO } from '@/types/grade'

const api = create('grades')

export async function listGradesByTest(testId: number): Promise<Grade[]> {
  const { data } = await api.get<Grade[]>(`/test/${testId}`)
  return data
}

export async function listGradesByStudent(studentId: string): Promise<GradeWithTest[]> {
  const { data } = await api.get<GradeWithTest[]>(`/student/${studentId}`)
  return data
}

export async function bulkCreateGrades(payload: BulkCreateGradesDTO): Promise<BulkCreateGradesResponse> {
  const enriched = {
    grades: payload.grades.map((g) => ({ ...g, grade_status: STATUS.ACTIVE })),
  }
  const { data } = await api.post<BulkCreateGradesResponse>('/bulkCreateGrades', enriched)
  return data
}

export async function updateGradeById(id: number, payload: UpdateGradeDTO): Promise<Grade> {
  const { data } = await api.put<Grade>(`/updateGradeById/${id}`, payload)
  return data
}
