import { useState } from 'react'
import type { ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ClassManagementView } from '@/components/classes/ClassManagementView'
import { ClassDetailView } from '@/components/classes/ClassDetailView'
import { DisciplineManagementView } from '@/components/classes/DisciplineManagementView'
import type { ClassItem } from '@/types/classes'

export const Route = createFileRoute('/admin/turmas/')({
  component: AdminTurmasPage,
})

type AdminTab = 'classes' | 'disciplines'

const tabs: { id: AdminTab; label: string; icon: ReactNode }[] = [
  { id: 'classes', label: 'Turmas', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'disciplines', label: 'Disciplinas', icon: <ClipboardList className="h-4 w-4" /> },
]

function AdminTurmasPage() {
  const [tab, setTab] = useState<AdminTab>('classes')
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null)

  if (selectedClass) {
    return (
      <div className="p-6">
        <ClassDetailView
          cls={selectedClass}
          canEdit
          canManageGrades
          onBack={() => setSelectedClass(null)}
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Turmas &amp; Disciplinas</h1>
        <p className="text-sm text-slate-400">
          Gerencie turmas, associações e o catálogo de disciplinas.
        </p>
      </div>

      <div className="flex gap-1 rounded-xl border border-slate-800 bg-slate-900/50 p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              tab === t.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60',
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'classes' ? (
        <ClassManagementView canEdit onSelectClass={setSelectedClass} />
      ) : (
        <DisciplineManagementView />
      )}
    </div>
  )
}
