import { useState } from 'react'
import { PhotoUpload } from '@/components/shared/PhotoUpload'
import { useUploadStudentPhoto } from '@/hooks/useUploadStudentPhoto'

interface StudentPhotoUploaderProps {
  studentId: number
  initialPhoto?: string | null
  name?: string | null
  disabled?: boolean
}

/** Avatar editável de um aluno (ADMIN/TEACHER). Renderize com key={studentId}. */
export function StudentPhotoUploader({
  studentId,
  initialPhoto,
  name,
  disabled,
}: StudentPhotoUploaderProps) {
  const [photo, setPhoto] = useState<string | null>(initialPhoto ?? null)
  const upload = useUploadStudentPhoto()

  return (
    <PhotoUpload
      currentPhoto={photo}
      name={name}
      size="lg"
      disabled={disabled}
      isUploading={upload.isPending}
      onFileSelected={(file) =>
        upload.mutate(
          { id: studentId, file },
          { onSuccess: (student) => setPhoto(student.student_photo ?? null) },
        )
      }
    />
  )
}
