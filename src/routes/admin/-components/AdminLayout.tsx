import { Outlet } from '@tanstack/react-router'
import { AdminSidebar } from './sidebar/AdminSidebar'
import { AdminHeader } from './header/AdminHeader'

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-slate-950">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
