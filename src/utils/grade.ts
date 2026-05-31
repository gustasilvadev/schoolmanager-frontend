/**
 * Converte um valor de nota (string) para número (float).
 * Substitui vírgula por ponto para garantir compatibilidade com o backend.
 */
export const parseGradeValue = (raw: string): number => {
  if (!raw) return NaN
  return parseFloat(raw.replace(',', '.'))
}

/**
 * Formata um valor numérico para exibição com vírgula.
 */
export const formatGradeDisplay = (value: number | undefined): string => {
  if (value === undefined || isNaN(value)) return ''
  return value.toString().replace('.', ',')
}
