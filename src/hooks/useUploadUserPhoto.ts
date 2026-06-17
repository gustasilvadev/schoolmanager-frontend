import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { uploadUserPhoto } from '@/integrations/users/usersApi'
import { photoUploadErrorMessage } from '@/lib/photo'

/** ADMIN troca a foto de qualquer usuário (por id). */
export function useUploadUserPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      uploadUserPhoto(id, file),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', id] })
      toast.success('Foto do usuário atualizada')
    },
    onError: (error) => {
      toast.error(photoUploadErrorMessage(error))
    },
  })
}
