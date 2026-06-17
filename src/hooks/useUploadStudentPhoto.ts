import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { uploadStudentPhoto } from '@/integrations/students/studentsApi'
import { photoUploadErrorMessage } from '@/lib/photo'

/** ADMIN ou TEACHER troca a foto de um aluno (por id). */
export function useUploadStudentPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      uploadStudentPhoto(id, file),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['student', id] })
      toast.success('Foto do aluno atualizada')
    },
    onError: (error) => {
      toast.error(photoUploadErrorMessage(error))
    },
  })
}
