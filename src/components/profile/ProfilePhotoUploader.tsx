import { PhotoUpload } from '@/components/shared/PhotoUpload'
import { useUploadMyPhoto } from '@/hooks/useUploadMyPhoto'

interface ProfilePhotoUploaderProps {
  currentPhoto?: string | null
  name?: string | null
  fallbackClassName?: string
}

/** Avatar editável do próprio usuário logado. Atualiza a sessão (cabeçalho) no sucesso. */
export function ProfilePhotoUploader({
  currentPhoto,
  name,
  fallbackClassName,
}: ProfilePhotoUploaderProps) {
  const upload = useUploadMyPhoto()

  return (
    <PhotoUpload
      currentPhoto={currentPhoto}
      name={name}
      size="lg"
      isUploading={upload.isPending}
      onFileSelected={(file) => upload.mutate(file)}
      fallbackClassName={fallbackClassName}
    />
  )
}
