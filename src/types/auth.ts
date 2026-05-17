export interface AuthSession {
  token: string
  role: 'ADMIN' | 'TEACHER'
  userId: number
  userEmail: string
}
