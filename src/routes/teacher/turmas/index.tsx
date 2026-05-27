import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { TeacherClassesLanding } from '@/components/classes/TeacherClassesLanding'
import { ClassManagementView } from '@/components/classes/ClassManagementView'
import { ClassDetailView } from '@/components/classes/ClassDetailView'
import type { ClassItem } from '@/types/classes'

export const Route = createFileRoute('/teacher/turmas/')({
  component: TeacherTurmasPage,
})

type TeacherView = 'landing' | 'classes'

function TeacherTurmasPage() {
  const [view, setView] = useState<TeacherView>('landing')
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null)

  if (selectedClass) {
    return (
      <ClassDetailView
        cls={selectedClass}
        canEdit={false}
        onBack={() => setSelectedClass(null)}
      />
    )
  }

  if (view === 'classes') {
    return (
      <ClassManagementView
        canEdit={false}
        onBack={() => setView('landing')}
        onSelectClass={setSelectedClass}
      />
    )
  }

  return <TeacherClassesLanding onNavigate={() => setView('classes')} />
}
