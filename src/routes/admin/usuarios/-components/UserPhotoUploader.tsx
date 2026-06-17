import { useState } from 'react'
import { PhotoUpload } from '@/components/shared/PhotoUpload'
import { useUploadUserPhoto } from '@/hooks/useUploadUserPhoto'

interface UserPhotoUploaderProps {
  userId: number
  initialPhoto?: string | null
  name?: string | null
  disabled?: boolean
}

/** Avatar editável de um usuário pelo ADMIN. Renderize com key={userId}. */
export function UserPhotoUploader({
  userId,
  initialPhoto,
  name,
  disabled,
}: UserPhotoUploaderProps) {
  const [photo, setPhoto] = useState<string | null>(initialPhoto ?? null)
  const upload = useUploadUserPhoto()

  return (
    <PhotoUpload
      currentPhoto={photo}
      name={name}
      size="lg"
      disabled={disabled}
      isUploading={upload.isPending}
      onFileSelected={(file) =>
        upload.mutate(
          { id: userId, file },
          { onSuccess: (user) => setPhoto(user.user_photo ?? null) },
        )
      }
    />
  )
}
