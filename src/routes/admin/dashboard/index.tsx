import { createFileRoute } from '@tanstack/react-router'
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  School,
  Users,
} from 'lucide-react'
import { DashboardStatCard } from '@/components/shared/DashboardStatCard'
import { useStudents } from '@/hooks/useStudents'
import { useTeachers } from '@/hooks/useTeachers'
import { useClasses } from '@/hooks/useClasses'
import { useDisciplines } from '@/hooks/useDisciplines'
import { ClassesByYearChart } from './-components/ClassesByYearChart'
import { TopTeachersCard } from './-components/TopTeachersCard'

export const Route = createFileRoute('/admin/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data: studentsData, isLoading: loadingStudents } = useStudents({
    limit: 1,
  })
  const { data: teachersData, isLoading: loadingTeachers } = useTeachers({
    limit: 1,
  })
  const { data: classesData, isLoading: loadingClasses } = useClasses({
    limit: 1,
  })
  const { data: disciplinesData, isLoading: loadingDisciplines } =
    useDisciplines({ limit: 1 })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10">
          <LayoutDashboard className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          <p className="text-xs text-slate-400">Visão geral do sistema</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          label="Total de Alunos"
          value={studentsData?.total ?? 0}
          icon={GraduationCap}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-600/10"
          isLoading={loadingStudents}
        />
        <DashboardStatCard
          label="Total de Professores"
          value={teachersData?.total ?? 0}
          icon={Users}
          iconColor="text-blue-400"
          iconBg="bg-blue-600/10"
          isLoading={loadingTeachers}
        />
        <DashboardStatCard
          label="Total de Turmas"
          value={classesData?.total ?? 0}
          icon={School}
          iconColor="text-violet-400"
          iconBg="bg-violet-600/10"
          isLoading={loadingClasses}
        />
        <DashboardStatCard
          label="Total de Disciplinas"
          value={disciplinesData?.total ?? 0}
          icon={BookOpen}
          iconColor="text-amber-400"
          iconBg="bg-amber-600/10"
          isLoading={loadingDisciplines}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ClassesByYearChart />
        <TopTeachersCard />
      </div>
    </div>
  )
}
