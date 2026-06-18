import { STATUS } from '@/types/test'
import type { FinalAverage } from '@/types/finalAverage'

export const APPROVAL_THRESHOLD = 6

export function activeAverages(list: FinalAverage[]): FinalAverage[] {
  return list.filter((a) => a.final_average_status === STATUS.ACTIVE)
}

export function meanOf(values: number[]): number | null {
  if (values.length === 0) return null
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

export function meanOfAverages(list: FinalAverage[]): number | null {
  return meanOf(activeAverages(list).map((a) => a.final_average_value))
}

export function formatAverage(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return value.toFixed(1).replace('.', ',')
}

export function approvalStatus(
  value: number | null | undefined,
): 'APROVADO' | 'REPROVADO' | null {
  if (value === null || value === undefined) return null
  return value >= APPROVAL_THRESHOLD ? 'APROVADO' : 'REPROVADO'
}
