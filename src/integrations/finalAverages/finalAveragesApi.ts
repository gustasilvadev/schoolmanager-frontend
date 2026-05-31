import { create } from '@/lib/api'
import type { FinalAverage } from '@/types/finalAverage'

const api = create('finalAverages')

export async function listFinalAveragesByStudent(studentId: string): Promise<FinalAverage[]> {
  const { data } = await api.get<FinalAverage[]>(`/student/${studentId}`)
  return data
}

export async function calculateFinalAverage(
  studentId: string,
  classDisciplineId: string,
): Promise<FinalAverage> {
  const { data } = await api.post<FinalAverage>(`/calculate/${studentId}/${classDisciplineId}`)
  return data
}
