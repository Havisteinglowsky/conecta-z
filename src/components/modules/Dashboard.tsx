'use client'

import { useEffect, useState } from 'react'
import {
  GraduationCap,
  BookOpen,
  Stethoscope,
  School,
  Users,
  Brain,
  Heart,
  AlertCircle,
  Activity,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts'

import { fetchDashboardStats } from '@/lib/api'
import type { DashboardStats, ActiveModule } from '@/lib/types'
import { useAppStore } from '@/lib/store'

// ---- Chart config ----
const situacaoChartConfig = {
  count: {
    label: 'Alunos',
    color: '#10b981',
  },
} satisfies ChartConfig

// ---- Stats card definitions ----
interface StatCardDef {
  key: keyof Pick<
    DashboardStats,
    | 'totalStudents'
    | 'totalTeachers'
    | 'totalPsychologists'
    | 'totalInstitutions'
    | 'totalClasses'
    | 'studentsWithSpecialNeeds'
  >
  label: string
  icon: React.ElementType
  accent: string
  bgAccent: string
  module: ActiveModule
}

const STAT_CARDS: StatCardDef[] = [
  {
    key: 'totalStudents',
    label: 'Total de Alunos',
    icon: GraduationCap,
    accent: 'text-emerald-600',
    bgAccent: 'bg-emerald-50 dark:bg-emerald-950/40',
    module: 'students',
  },
  {
    key: 'totalTeachers',
    label: 'Total de Professores',
    icon: BookOpen,
    accent: 'text-teal-600',
    bgAccent: 'bg-teal-50 dark:bg-teal-950/40',
    module: 'teachers',
  },
  {
    key: 'totalPsychologists',
    label: 'Total de Psicólogos',
    icon: Stethoscope,
    accent: 'text-amber-600',
    bgAccent: 'bg-amber-50 dark:bg-amber-950/40',
    module: 'psychologists',
  },
  {
    key: 'totalInstitutions',
    label: 'Total de Instituições',
    icon: School,
    accent: 'text-rose-600',
    bgAccent: 'bg-rose-50 dark:bg-rose-950/40',
    module: 'institutions',
  },
  {
    key: 'totalClasses',
    label: 'Total de Turmas',
    icon: Users,
    accent: 'text-violet-600',
    bgAccent: 'bg-violet-50 dark:bg-violet-950/40',
    module: 'classes',
  },
  {
    key: 'studentsWithSpecialNeeds',
    label: 'Alunos com NEE',
    icon: Heart,
    accent: 'text-pink-600',
    bgAccent: 'bg-pink-50 dark:bg-pink-950/40',
    module: 'students',
  },
]

// ---- Quick action definitions ----
interface QuickAction {
  label: string
  module: ActiveModule
  icon: React.ElementType
  description: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Alunos',
    module: 'students',
    icon: GraduationCap,
    description: 'Gerenciar cadastro de alunos',
  },
  {
    label: 'Professores',
    module: 'teachers',
    icon: BookOpen,
    description: 'Gerenciar cadastro de professores',
  },
  {
    label: 'Psicólogos',
    module: 'psychologists',
    icon: Stethoscope,
    description: 'Gerenciar equipe psicológica',
  },
  {
    label: 'Instituições',
    module: 'institutions',
    icon: School,
    description: 'Gerenciar instituições',
  },
  {
    label: 'Registros',
    module: 'records',
    icon: Activity,
    description: 'Acessar registros e observações',
  },
  {
    label: 'Perfis Cognitivos',
    module: 'cognitive-profiles',
    icon: Brain,
    description: 'Avaliações e perfis cognitivos',
  },
]

// ---- Priority badge helper ----
function getPriorityBadge(priority: string | null) {
  switch (priority) {
    case 'Urgente':
      return <Badge variant="destructive">Urgente</Badge>
    case 'Alta':
      return (
        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
          Alta
        </Badge>
      )
    case 'Média':
      return (
        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400">
          Média
        </Badge>
      )
    case 'Baixa':
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          Baixa
        </Badge>
      )
    default:
      return null
  }
}

// ---- Status badge helper ----
function getStatusBadge(status: string) {
  switch (status) {
    case 'Aberto':
      return (
        <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400">
          Aberto
        </Badge>
      )
    case 'Em andamento':
      return (
        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
          Em andamento
        </Badge>
      )
    case 'Concluído':
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          Concluído
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

// ---- Format relative date ----
function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Agora mesmo'
  if (diffMins < 60) return `${diffMins}min atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays < 7) return `${diffDays}d atrás`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

// ========================================
// Dashboard Component
// ========================================

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setActiveModule } = useAppStore()

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchDashboardStats()
        if (!cancelled) {
          setStats(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Prepare chart data from studentsBySituacao
  const chartData = stats
    ? Object.entries(stats.studentsBySituacao).map(([situacao, count]) => ({
        situacao,
        count,
      }))
    : []

  return (
    <div className="space-y-6">
      {/* ---- Welcome Banner ---- */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <CardContent className="relative px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm sm:size-14">
                <Brain className="size-7 text-white sm:size-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  NeuroLynx
                </h1>
                <p className="mt-1 text-sm text-emerald-100 sm:text-base">
                  Plataforma de Gestão Educacional Inclusiva &amp; Neurodiversidade
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-emerald-200">
              <Sparkles className="size-4" />
              <span className="text-sm font-medium">
                Painel de Controle
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---- Stats Cards Grid ---- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon
          const value = stats ? stats[card.key] : null

          return (
            <Card
              key={card.key}
              className="group cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setActiveModule(card.module)}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${card.bgAccent}`}
                >
                  <Icon className={`size-6 ${card.accent}`} />
                </div>
                <div className="min-w-0 flex-1">
                  {loading ? (
                    <>
                      <Skeleton className="mb-1.5 h-7 w-16" />
                      <Skeleton className="h-4 w-28" />
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold tracking-tight">
                        {value !== null ? value.toLocaleString('pt-BR') : '—'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {card.label}
                      </p>
                    </>
                  )}
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ---- Middle Row: Chart + Quick Actions ---- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* ---- Students by Situation Chart ---- */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="size-4 text-emerald-600" />
              Alunos por Situação
            </CardTitle>
            <CardDescription>
              Distribuição dos alunos conforme situação cadastral
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[260px] items-center justify-center">
                <Skeleton className="h-[220px] w-full" />
              </div>
            ) : chartData.length > 0 ? (
              <ChartContainer
                config={situacaoChartConfig}
                className="h-[260px] w-full"
              >
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="situacao"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    fontSize={12}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--color-count)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={56}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[260px] flex-col items-center justify-center text-muted-foreground">
                <AlertCircle className="mb-2 size-8" />
                <p className="text-sm">Nenhum dado disponível</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ---- Quick Actions ---- */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-emerald-600" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Navegue rapidamente para os módulos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.module}
                  variant="ghost"
                  className="w-full justify-start gap-3 px-3 py-5 text-left"
                  onClick={() => setActiveModule(action.module)}
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                    <Icon className="size-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                </Button>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* ---- Recent Activity ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="size-4 text-emerald-600" />
            Atividade Recente
          </CardTitle>
          <CardDescription>
            Últimos registros e observações cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : stats?.recentRecords && stats.recentRecords.length > 0 ? (
            <div className="max-h-96 space-y-0 overflow-y-auto">
              {stats.recentRecords.map((record, idx) => (
                <div key={record.id}>
                  <div
                    className="flex cursor-pointer items-start gap-3 py-3 transition-colors hover:bg-muted/50"
                    onClick={() => {
                      setActiveModule('records')
                    }}
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                      <Activity className="size-4 text-emerald-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">
                          {record.titulo}
                        </p>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {record.tipo}
                        {record.authorName ? ` · ${record.authorName}` : ''}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      {getPriorityBadge(record.prioridade)}
                      {getStatusBadge(record.status)}
                    </div>
                  </div>
                  {idx < stats.recentRecords.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <AlertCircle className="mb-2 size-8" />
              <p className="text-sm">Nenhuma atividade recente</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ---- Error state ---- */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="size-5 text-destructive" />
            <p className="text-sm text-destructive">
              Erro ao carregar dados: {error}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
