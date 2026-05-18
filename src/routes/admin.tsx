import { createFileRoute, redirect } from '@tanstack/react-router'
import { getStoredSession } from '../context/AuthContext'
import { AdminLayout } from './admin/-components/AdminLayout'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    const session = getStoredSession()
    if (!session || session.role !== 'ADMIN') {
      throw redirect({ to: '/login' })
    }
  },
  component: AdminLayout,
})
