import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { uploadMyPhoto } from '@/integrations/users/usersApi'
import { photoUploadErrorMessage } from '@/lib/photo'
import { useAuth } from './useAuth'

/**
 * Upload da própria foto (usuário logado). Atualiza a sessão para o cabeçalho
 * refletir na hora (sem reload) e invalida o perfil (/me).
 */
export function useUploadMyPhoto() {
  const { session, setAuth } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => uploadMyPhoto(file),
    onSuccess: (user) => {
      if (session) {
        setAuth({ ...session, userPhoto: user.user_photo ?? null })
      }
      queryClient.invalidateQueries({ queryKey: ['me'] })
      toast.success('Foto atualizada com sucesso')
    },
    onError: (error) => {
      toast.error(photoUploadErrorMessage(error))
    },
  })
}
