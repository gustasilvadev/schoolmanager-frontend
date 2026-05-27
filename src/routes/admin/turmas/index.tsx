import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ClassesLanding } from '@/components/classes/ClassesLanding'
import { ClassManagementView } from '@/components/classes/ClassManagementView'
import { ClassDetailView } from '@/components/classes/ClassDetailView'
import { DisciplineManagementView } from '@/components/classes/DisciplineManagementView'
import type { ClassItem } from '@/types/classes'

export const Route = createFileRoute('/admin/turmas/')({
  component: AdminTurmasPage,
})

type AdminView = 'landing' | 'classes' | 'disciplines'

function AdminTurmasPage() {
  const [view, setView] = useState<AdminView>('landing')
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null)

  if (selectedClass) {
    return (
      <ClassDetailView
        cls={selectedClass}
        canEdit
        onBack={() => setSelectedClass(null)}
      />
    )
  }

  if (view === 'classes') {
    return (
      <ClassManagementView
        canEdit
        onBack={() => setView('landing')}
        onSelectClass={setSelectedClass}
      />
    )
  }

  if (view === 'disciplines') {
    return <DisciplineManagementView onBack={() => setView('landing')} />
  }

  return <ClassesLanding onNavigate={setView} />
}
