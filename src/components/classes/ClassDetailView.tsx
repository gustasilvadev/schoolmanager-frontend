import { useState } from 'react'
import { ArrowLeft, BookOpen, GraduationCap, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ClassStudentsTab } from './ClassStudentsTab'
import { ClassTeachersTab } from './ClassTeachersTab'
import { ClassDisciplinesTab } from './ClassDisciplinesTab'
import type { ClassItem } from '@/types/classes'

type Tab = 'students' | 'teachers' | 'disciplines'

interface ClassDetailViewProps {
  cls: ClassItem
  canEdit: boolean
  onBack: () => void
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'students', label: 'Alunos', icon: <Users className="h-3.5 w-3.5" /> },
  {
    id: 'teachers',
    label: 'Professores',
    icon: <GraduationCap className="h-3.5 w-3.5" />,
  },
  {
    id: 'disciplines',
    label: 'Disciplinas',
    icon: <BookOpen className="h-3.5 w-3.5" />,
  },
]

export function ClassDetailView({
  cls,
  canEdit,
  onBack,
}: ClassDetailViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('students')

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <button
          onClick={onBack}
          className="mt-1 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-white">
              {cls.class_name}
            </h1>
            <StatusBadge status={cls.class_status} />
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Ano letivo: {cls.class_school_year}
          </p>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-900/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white',
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'students' && (
          <ClassStudentsTab classId={cls.class_id} canEdit={canEdit} />
        )}
        {activeTab === 'teachers' && (
          <ClassTeachersTab classId={cls.class_id} canEdit={canEdit} />
        )}
        {activeTab === 'disciplines' && (
          <ClassDisciplinesTab classId={cls.class_id} canEdit={canEdit} />
        )}
      </div>
    </div>
  )
}
