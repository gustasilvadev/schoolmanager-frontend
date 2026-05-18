import { Outlet } from '@tanstack/react-router'
import { TeacherSidebar } from './sidebar/TeacherSidebar'
import { TeacherHeader } from './header/TeacherHeader'

export function TeacherLayout() {
  return (
    <div className="flex h-screen bg-slate-950">
      <TeacherSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TeacherHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
