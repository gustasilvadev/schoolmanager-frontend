export const MAX_PHOTO_SIZE_MB = 5
export const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024
export const ACCEPTED_PHOTO_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]
export const ACCEPTED_PHOTO_ACCEPT = '.jpg,.jpeg,.png,.webp'

/** Valida o arquivo no client ANTES de subir (UX). O backend revalida de qualquer forma. */
export function validatePhotoFile(file: File): string | null {
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
    return 'Formato inválido. Use JPEG, PNG ou WEBP.'
  }
  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return `A imagem excede o limite de ${MAX_PHOTO_SIZE_MB} MB.`
  }
  return null
}

/** Mapeia o status do backend (anexado em .status pelo interceptor) para mensagem amigável. */
export function photoUploadErrorMessage(error: unknown): string {
  const status = (error as { status?: number }).status
  switch (status) {
    case 413:
      return 'Imagem muito grande. O limite é 5 MB.'
    case 400:
      return 'Arquivo inválido. Envie uma imagem JPEG, PNG ou WEBP.'
    case 503:
      return 'Serviço de imagens indisponível no momento. Tente novamente.'
    case 404:
      return 'Registro não encontrado.'
    default:
      return 'Não foi possível enviar a imagem. Tente novamente.'
  }
}
