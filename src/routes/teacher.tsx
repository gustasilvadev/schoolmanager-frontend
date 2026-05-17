import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getStoredSession } from '../context/AuthContext'

export const Route = createFileRoute('/teacher')({
  beforeLoad: () => {
    const session = getStoredSession()
    if (!session || session.role !== 'TEACHER') {
      throw redirect({ to: '/login' })
    }
  },
  component: TeacherLayout,
})

function TeacherLayout() {
  return <Outlet />
}
