import { create } from '@/lib/api'
import type {
  Discipline,
  ListDisciplinesParams,
  ListDisciplinesResponse,
} from '@/types/classes'

const api = create('disciplines')

export async function listDisciplines(
  params?: ListDisciplinesParams,
): Promise<ListDisciplinesResponse> {
  const { data } = await api.get<ListDisciplinesResponse>('/listDisciplines', {
    params,
  })
  return data
}

export async function getDisciplineById(id: number): Promise<Discipline> {
  const { data } = await api.get<Discipline>(`/listDisciplineById/${id}`)
  return data
}

export async function createDiscipline(payload: {
  discipline_name: string
  discipline_hour: number
}): Promise<Discipline> {
  const { data } = await api.post<Discipline>('/createDiscipline', payload)
  return data
}

export async function updateDiscipline(
  id: number,
  payload: Partial<{
    discipline_name: string
    discipline_hour: number
    discipline_status: number
  }>,
): Promise<Discipline> {
  const { data } = await api.put<Discipline>(
    `/updateDisciplineById/${id}`,
    payload,
  )
  return data
}

export async function deleteDiscipline(id: number): Promise<void> {
  await api.delete(`/deleteDisciplineById/${id}`)
}

export async function restoreDiscipline(id: number): Promise<void> {
  await api.post(`/restoreDisciplineById/${id}`)
}
