import { createFileRoute, redirect } from '@tanstack/react-router'
import { getStoredSession } from '@/context/AuthContext'
import { TeacherLayout } from './teacher/-components/TeacherLayout'

export const Route = createFileRoute('/teacher')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return
    const session = getStoredSession()
    if (!session || session.role !== 'TEACHER') {
      throw redirect({ to: '/login' })
    }
  },
  component: TeacherLayout,
})
