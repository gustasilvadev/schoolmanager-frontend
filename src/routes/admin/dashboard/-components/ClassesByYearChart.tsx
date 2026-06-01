import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { School } from 'lucide-react'
import { useClasses } from '@/hooks/useClasses'

export function ClassesByYearChart() {
  const { data, isLoading } = useClasses({ limit: 100, class_status: 1 })

  const chartData = Object.entries(
    (data?.classes ?? []).reduce<Record<string, number>>((acc, cls) => {
      const year = cls.class_school_year
      acc[year] = (acc[year] ?? 0) + 1
      return acc
    }, {}),
  )
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year.localeCompare(b.year))

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">
      <div className="mb-5 flex items-center gap-2">
        <School className="h-4 w-4 text-violet-400" />
        <h2 className="text-sm font-semibold text-white">Turmas por Ano Letivo</h2>
      </div>

      {isLoading ? (
        <div className="h-44 w-full animate-pulse rounded-lg bg-slate-700" />
      ) : chartData.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">
          Nenhuma turma ativa
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={176}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: 12,
              }}
              cursor={{ fill: '#334155' }}
              formatter={(value) => [value ?? 0, 'Turmas']}
            />
            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
