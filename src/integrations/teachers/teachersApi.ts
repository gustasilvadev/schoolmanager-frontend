import { create } from '@/lib/api'
import type {
  ListTeachersParams,
  ListTeachersResponse,
  TeacherDisciplinesResponse,
} from '@/types/teacher'

const api = create('teachers')

export async function listTeachers(
  params?: ListTeachersParams,
): Promise<ListTeachersResponse> {
  const { data } = await api.get<ListTeachersResponse>('/listTeachers', {
    params,
  })
  return data
}

export async function getTeacherDisciplines(
  teacherId: number,
): Promise<TeacherDisciplinesResponse> {
  const { data } = await api.get<TeacherDisciplinesResponse>(
    `/disciplines/${teacherId}`,
  )
  return data
}

export async function associateDiscipline(
  teacherId: number,
  disciplineId: number,
): Promise<void> {
  await api.post(`/linkDiscipline/${teacherId}`, { discipline_id: disciplineId })
}

export async function removeDisciplineAssociation(
  teacherId: number,
  disciplineId: number,
): Promise<void> {
  await api.delete(`/unlinkDiscipline/${teacherId}/${disciplineId}`)
}
