import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
} from '@/integrations/users/usersApi'
import type {
  ListUsersParams,
  UpdateUserPayload,
  CreateUserPayload,
} from '@/types/user'

export function useUsers(params?: ListUsersParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => listUsers(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useUser(id: number | undefined) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id!),
    enabled: id !== undefined,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      console.error('[useCreateUser]', error)
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', id] })
    },
    onError: (error) => {
      console.error('[useUpdateUser]', error)
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', id] })
    },
    onError: (error) => {
      console.error('[useDeleteUser]', error)
    },
  })
}

export function useRestoreUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => restoreUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', id] })
    },
    onError: (error) => {
      console.error('[useRestoreUser]', error)
    },
  })
}
