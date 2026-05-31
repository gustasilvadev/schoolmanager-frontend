import type { StatusValue } from './test'

export interface FinalAverage {
  final_average_id: number
  final_average_value: number
  student_id: number
  class_discipline_id: number
  final_average_status: StatusValue
}
