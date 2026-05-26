import {
  BookOpen,
  GraduationCap,
  ChevronRight,
  Users,
  ClipboardList,
} from 'lucide-react'

type AdminView = 'classes' | 'disciplines'

interface ClassesLandingProps {
  onNavigate: (view: AdminView) => void
}

interface FeatureCard {
  id: AdminView
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
  accent: string
}

const cards: FeatureCard[] = [
  {
    id: 'classes',
    icon: <BookOpen className="h-6 w-6" />,
    title: 'Turmas',
    description:
      'Gerencie turmas, alunos matriculados, professores e disciplinas por turma.',
    features: [
      'Criar e editar turmas',
      'Matricular e remover alunos',
      'Associar professores',
      'Gerenciar disciplinas por turma',
    ],
    accent: 'blue',
  },
  {
    id: 'disciplines',
    icon: <ClipboardList className="h-6 w-6" />,
    title: 'Disciplinas',
    description:
      'Gerencie o catálogo de disciplinas disponíveis para as turmas.',
    features: [
      'Criar e editar disciplinas',
      'Definir carga horária',
      'Ativar e desativar disciplinas',
      'Restaurar disciplinas excluídas',
    ],
    accent: 'violet',
  },
]

const accentMap = {
  blue: {
    bg: 'bg-blue-600/10',
    icon: 'text-blue-400',
    border: 'border-blue-600/20',
    hover: 'hover:border-blue-500/40',
    badge: 'bg-blue-600/10 text-blue-300',
  },
  violet: {
    bg: 'bg-violet-600/10',
    icon: 'text-violet-400',
    border: 'border-violet-600/20',
    hover: 'hover:border-violet-500/40',
    badge: 'bg-violet-600/10 text-violet-300',
  },
} as const

export function ClassesLanding({ onNavigate }: ClassesLandingProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10">
          <BookOpen className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">
            Turmas & Disciplinas
          </h1>
          <p className="text-xs text-slate-400">
            Selecione uma área para gerenciar
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const a = accentMap[card.accent as keyof typeof accentMap]
          return (
            <button
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className={`group flex flex-col gap-4 rounded-xl border ${a.border} ${a.hover} bg-slate-900/60 p-6 text-left transition-all duration-200 hover:bg-slate-900`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg ${a.bg} ${a.icon}`}
                >
                  {card.icon}
                </div>
                <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-slate-400" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-white">
                  {card.title}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {card.description}
                </p>
              </div>

              <ul className="space-y-1.5">
                {card.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-xs text-slate-500"
                  >
                    <span
                      className={`h-1 w-1 rounded-full ${a.icon.replace('text-', 'bg-')}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Users className="h-4 w-4" />
          <GraduationCap className="h-4 w-4" />
          <p className="text-xs">
            As turmas integram alunos (MS2), professores (MS3), disciplinas e
            avaliações (MS5) do SchoolManager.
          </p>
        </div>
      </div>
    </div>
  )
}
