import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ClassManagementView } from '@/components/classes/ClassManagementView'
import { ClassDetailView } from '@/components/classes/ClassDetailView'
import type { ClassItem } from '@/types/classes'

export const Route = createFileRoute('/teacher/turmas/')({
  component: TeacherTurmasPage,
})

function TeacherTurmasPage() {
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null)

  if (selectedClass) {
    return (
      <div className="p-6">
        <ClassDetailView
          cls={selectedClass}
          canEdit={false}
          onBack={() => setSelectedClass(null)}
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Turmas</h1>
        <p className="text-sm text-slate-400">
          Consulte as turmas, alunos, professores e disciplinas.
        </p>
      </div>

      <ClassManagementView canEdit={false} onSelectClass={setSelectedClass} />
    </div>
  )
}
