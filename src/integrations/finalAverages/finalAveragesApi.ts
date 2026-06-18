import { create } from '@/lib/api'
import type { FinalAverage, UpdateFinalAverageDTO } from '@/types/finalAverage'

const api = create('finalAverages')

export async function listFinalAverages(): Promise<FinalAverage[]> {
  const { data } = await api.get<FinalAverage[]>('/listFinalAverages')
  return data
}

export async function getFinalAverageById(id: number): Promise<FinalAverage> {
  const { data } = await api.get<FinalAverage>(`/listFinalAverageById/${id}`)
  return data
}

export async function listFinalAveragesByStudent(studentId: string): Promise<FinalAverage[]> {
  const { data } = await api.get<FinalAverage[]>(`/student/${studentId}`)
  return data
}

export async function listFinalAveragesByClassDiscipline(
  classDisciplineId: number,
): Promise<FinalAverage[]> {
  const { data } = await api.get<FinalAverage[]>(`/classDiscipline/${classDisciplineId}`)
  return data
}

export async function calculateFinalAverage(
  studentId: string,
  classDisciplineId: string,
): Promise<FinalAverage> {
  const { data } = await api.post<FinalAverage>(`/calculate/${studentId}/${classDisciplineId}`)
  return data
}

export async function updateFinalAverageById(
  id: number,
  payload: UpdateFinalAverageDTO,
): Promise<FinalAverage> {
  const { data } = await api.put<FinalAverage>(`/updateFinalAverageById/${id}`, payload)
  return data
}

export async function deleteFinalAverageById(id: number): Promise<void> {
  await api.delete(`/deleteFinalAverageById/${id}`)
}

export async function restoreFinalAverageById(id: number): Promise<void> {
  await api.post(`/restoreFinalAverageById/${id}`)
}
