import { create } from '@/lib/api'
import type { MeResponse } from '@/types/auth'
import type {
  CreateUserTeacherPayload,
  CreatedUserResponse,
  CreateUserPayload,
  ListUsersParams,
  ListUsersResponse,
  UpdateUserPayload,
  RestoreUserResponse,
  User,
} from '@/types/user'

const api = create('users')

export async function getMe(): Promise<MeResponse> {
  const { data } = await api.get<MeResponse>('/me')
  return data
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
): Promise<void> {
  await api.post('/changePassword', { oldPassword, newPassword })
}

export async function createUser(
  payload: CreateUserTeacherPayload | CreateUserPayload,
): Promise<CreatedUserResponse> {
  const { data } = await api.post<CreatedUserResponse>('/createUser', payload)
  return data
}

export async function listUsers(params?: ListUsersParams): Promise<ListUsersResponse> {
  const { data } = await api.get<ListUsersResponse>('/listUsers', { params })
  return data
}

export async function getUserById(id: number): Promise<User> {
  const { data } = await api.get<User>(`/listUserById/${id}`)
  return data
}

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<User> {
  const { data } = await api.put<User>(`/updateUserById/${id}`, payload)
  return data
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/deleteUserById/${id}`)
}

export async function restoreUser(id: number): Promise<RestoreUserResponse> {
  const { data } = await api.post<RestoreUserResponse>(`/restoreUserById/${id}`)
  return data
}

// Override do Content-Type derruba o default JSON do client (axios v1 serializaria
// o FormData como JSON); o browser injeta o boundary correto automaticamente.
export async function uploadMyPhoto(file: File): Promise<User> {
  const formData = new FormData()
  formData.append('photo', file)
  const { data } = await api.post<User>('/uploadPhoto', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function uploadUserPhoto(id: number, file: File): Promise<User> {
  const formData = new FormData()
  formData.append('photo', file)
  const { data } = await api.post<User>(`/uploadPhotoById/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
