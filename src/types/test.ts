export const STATUS = { INACTIVE: 0, ACTIVE: 1, DELETED: 2 } as const
export type StatusValue = typeof STATUS[keyof typeof STATUS]

export interface Test {
  test_id: number
  test_type: string
  test_description: string
  class_discipline_id: number
  test_status: StatusValue
}

export interface CreateTestDTO {
  test_type: string
  test_description: string
  class_discipline_id: number
}

export interface UpdateTestDTO {
  test_type?: string
  test_description?: string
  class_discipline_id?: number
  test_status?: StatusValue
}

export interface TestListResponse {
  tests: Test[]
  total: number
  page: number
  limit: number
}
