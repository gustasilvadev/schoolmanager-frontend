import { create } from '@/lib/api'
import { STATUS } from '@/types/test'
import type { Test, TestListResponse, CreateTestDTO, UpdateTestDTO, StatusValue } from '@/types/test'

const api = create('tests')

export async function listTests(params?: {
  page?: number
  limit?: number
  class_discipline_id?: number
  test_status?: StatusValue
  includeDeleted?: boolean
}): Promise<TestListResponse> {
  const { data } = await api.get<TestListResponse>('/listTests', { params })
  return data
}

export async function listByClassDiscipline(classDisciplineId: number): Promise<Test[]> {
  const { data } = await api.get<Test[]>(`/classDiscipline/${classDisciplineId}`)
  return data
}

export async function getTestById(id: number): Promise<Test> {
  const { data } = await api.get<Test>(`/listTestById/${id}`)
  return data
}

export async function createTest(test: CreateTestDTO): Promise<Test> {
  const { data } = await api.post<Test>('/createTest', { ...test, test_status: STATUS.ACTIVE })
  return data
}

export async function updateTestById(id: number, test: UpdateTestDTO): Promise<Test> {
  const { data } = await api.put<Test>(`/updateTestById/${id}`, test)
  return data
}

export async function deleteTestById(id: number): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/deleteTestById/${id}`)
  return data
}

export async function restoreTestById(id: number): Promise<Test> {
  const { data } = await api.post<Test>(`/restoreTestById/${id}`)
  return data
}
