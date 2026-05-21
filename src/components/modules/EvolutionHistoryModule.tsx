'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import {
  TrendingUp, Brain, Activity, History, FileText,
  AlertTriangle, ArrowRight, Search, User, Shield, Eye,
  ChevronDown, ChevronUp, Loader2,
} from 'lucide-react'
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription,
  Badge, Button, Input, Separator, Skeleton, Progress, ScrollArea,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui'
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  AreaChart, Area, ReferenceLine,
} from 'recharts'
import {
  fetchStudents, fetchCognitiveProfiles, fetchRecords,
  fetchReports, fetchTeachingPlans,
} from '@/lib/api'
import type {
  Student, CognitiveProfile, Record, Report, TeachingPlan,
} from '@/lib/types'

// ─── CONECTA Colors ─────────────────────────────────────────
const C = {
  azulNoite:   '#0A1628',
  azulProf:    '#0D2045',
  azulVivo:    '#1E5EFF',
  laranja:     '#FF6B2B',
  verde:       '#00D4A0',
  creme:       '#F5F0E8',
  vermelho:    '#EF4444',
  amarelo:     '#F59E0B',
}

// ─── Dimension helpers ──────────────────────────────────────
const BEHAV_DIMS = ['atencao','foco','impulsividade','sociabilidade','autonomia','motivacao','adaptabilidade'] as const
const COGN_DIMS  = ['memoria','raciocinioLogico','compreensao','velocidadeProcessamento','resolucaoProblemas','criatividade','linguagem'] as const
const PEDAG_DIMS = ['leitura','escrita','calculo','interpretacao','producaoTextual'] as const

type DimKey = typeof BEHAV_DIMS[number] | typeof COGN_DIMS[number] | typeof PEDAG_DIMS[number]

const DIM_LABELS: Record<DimKey, string> = {
  atencao: 'Atenção', foco: 'Foco', impulsividade: 'Impulsividade',
  sociabilidade: 'Sociabilidade', autonomia: 'Autonomia', motivacao: 'Motivação',
  adaptabilidade: 'Adaptabilidade', memoria: 'Memória', raciocinioLogico: 'Raciocínio Lógico',
  compreensao: 'Compreensão', velocidadeProcessamento: 'Vel. Processamento',
  resolucaoProblemas: 'Resolução de Problemas', criatividade: 'Criatividade',
  linguagem: 'Linguagem', leitura: 'Leitura', escrita: 'Escrita',
  calculo: 'Cálculo', interpretacao: 'Interpretação', producaoTextual: 'Produção Textual',
}

function avg(dims: readonly DimKey[], p: CognitiveProfile): number {
  const vals = dims.map(d => p[d] ?? 0).filter(v => v > 0)
  return vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0
}

// ─── PDI areas for Comparative Table ────────────────────────
interface PDIArea {
  name: string
  dims: readonly DimKey[]
  icon: React.ReactNode
}

const PDI_AREAS: PDIArea[] = [
  { name: 'Foco Cognitivo',          dims: ['atencao','foco','memoria','velocidadeProcessamento'], icon: <Brain className="h-4 w-4" /> },
  { name: 'Expressão Motora',        dims: ['autonomia','adaptabilidade','criatividade','producaoTextual'], icon: <Activity className="h-4 w-4" /> },
  { name: 'Independência Funcional',  dims: ['autonomia','sociabilidade','motivacao','resolucaoProblemas'], icon: <Shield className="h-4 w-4" /> },
  { name: 'Regulação Sensorial',      dims: ['impulsividade','adaptabilidade','atencao','compreensao'], icon: <Eye className="h-4 w-4" /> },
]

function progressStatus(current: number, previous: number): {
  label: string; color: string; bg: string; icon: React.ReactNode
} {
  const diff = current - previous
  if (diff >= 1)  return { label: 'Avanço Consolidado',           color: C.verde,   bg: '#00D4A020', icon: <TrendingUp className="h-3.5 w-3.5" /> }
  if (diff >= 0)  return { label: 'Avanço Parcial',               color: C.laranja,  bg: '#FF6B2B20', icon: <Activity className="h-3.5 w-3.5" /> }
  return              { label: 'Regressão / Platô de Estagnação', color: C.vermelho, bg: '#EF444420', icon: <AlertTriangle className="h-3.5 w-3.5" /> }
}

// ─── Chart configs ──────────────────────────────────────────
const evolutionChartConfig: ChartConfig = {
  comportamental: { label: 'Comportamental', color: C.laranja },
  cognitivo:      { label: 'Cognitivo',      color: C.azulVivo },
  pedagogico:     { label: 'Pedagógico',     color: C.verde },
}

const sensoryChartConfig: ChartConfig = {
  tolerancia: { label: 'Tolerância Sensorial', color: C.azulVivo },
}

// ─── Main Component ─────────────────────────────────────────
export default function EvolutionHistoryModule() {
  // --- State ---
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [profiles, setProfiles] = useState<CognitiveProfile[]>([])
  const [records, setRecords] = useState<Record[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [plans, setPlans] = useState<TeachingPlan[]>([])

  const [loading, setLoading] = useState(false)
  const [expandedReport, setExpandedReport] = useState<string | null>(null)
  const fetchIdRef = useRef(0)

  // --- Derived selected student ---
  const selectedStudent = useMemo(() =>
    selectedId ? students.find(s => s.id === selectedId) ?? null : null
  , [selectedId, students])

  // --- Load students ---
  useEffect(() => {
    fetchStudents().then(setStudents).catch(() => {})
  }, [])

  // --- Fetch student detail data ---
  const loadStudentData = useCallback(async (studentId: string) => {
    const fetchId = ++fetchIdRef.current
    setLoading(true)
    try {
      const [p, r, rp, pl] = await Promise.all([
        fetchCognitiveProfiles(studentId),
        fetchRecords({ studentId }),
        fetchReports({ studentId }),
        fetchTeachingPlans({ studentId }),
      ])
      if (fetchId !== fetchIdRef.current) return
      setProfiles(p.sort((a, b) =>
        new Date(a.dataAvaliacao ?? a.createdAt).getTime() - new Date(b.dataAvaliacao ?? b.createdAt).getTime()
      ))
      setRecords(r)
      setReports(rp)
      setPlans(pl)
    } catch {
      // silently handle
    } finally {
      if (fetchId === fetchIdRef.current) setLoading(false)
    }
  }, [])

  // --- Trigger fetch when selectedId changes ---
  useEffect(() => {
    if (selectedId) {
      loadStudentData(selectedId)
    }
  }, [selectedId, loadStudentData])

  // --- Filtered students ---
  const filtered = useMemo(() => {
    if (!search) return students
    const q = search.toLowerCase()
    return students.filter(s =>
      s.nomeCompleto.toLowerCase().includes(q) || s.matricula.toLowerCase().includes(q)
    )
  }, [students, search])

  // --- Evolution chart data ---
  const evolutionData = useMemo(() =>
    profiles.map(p => ({
      date: p.dataAvaliacao ? new Date(p.dataAvaliacao).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }) : '—',
      comportamental: avg(BEHAV_DIMS, p),
      cognitivo: avg(COGN_DIMS, p),
      pedagogico: avg(PEDAG_DIMS, p),
    }))
  , [profiles])

  // --- Sensory curve data ---
  const sensoryData = useMemo(() => {
    if (profiles.length < 2) return []
    return profiles.map((p, i) => {
      const tolBase = avg(['impulsividade','adaptabilidade','atencao'], p)
      const noise = (Math.sin(i * 1.3) * 0.6 + (p.estadoEmocional === 'Instável' ? -2 : p.estadoEmocional === 'Em transição' ? -1 : 0.5))
      return {
        date: p.dataAvaliacao ? new Date(p.dataAvaliacao).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }) : '—',
        tolerancia: +Math.max(1, Math.min(10, tolBase + noise)).toFixed(1),
      }
    })
  }, [profiles])

  // --- PDI comparative data ---
  const pdiData = useMemo(() => {
    if (profiles.length < 2) return []
    const current = profiles[profiles.length - 1]
    const previous = profiles[profiles.length - 2]
    return PDI_AREAS.map(area => ({
      area,
      currentAvg: avg(area.dims, current),
      previousAvg: avg(area.dims, previous),
    }))
  }, [profiles])

  // --- Clinical impact data ---
  const clinicalImpact = useMemo(() => {
    const recs = records.filter(r =>
      r.tipo === 'Evolução' || r.tipo === 'Comportamental' || r.tipo === 'Psicológica'
    )
    return recs.slice(0, 5).map(r => ({
      id: r.id,
      tipo: r.tipo,
      titulo: r.titulo,
      impacto: r.descricao,
      data: r.dataRegistro ?? r.createdAt,
      autor: r.authorName ?? '—',
      cargo: r.authorRole ?? '—',
    }))
  }, [records])

  // --- Methodological adaptations ---
  const adaptations = useMemo(() => {
    const items: { titulo: string; descricao: string; icone: React.ReactNode }[] = []
    for (const plan of plans.slice(0, 3)) {
      const metodo = plan.adaptacaoMetodologia || plan.metodologias || 'Adaptação metodológica conforme necessidade do aluno'
      const aval   = plan.adaptacaoAvaliacao   || plan.criteriosAvaliacao || 'Avaliação adaptada com critérios diferenciados'
      const conteudo = plan.adaptacaoConteudo   || plan.conteudos || 'Conteúdo adaptado ao ritmo e perfil do aluno'
      items.push(
        { titulo: `Metodologia — ${plan.titulo}`, descricao: metodo, icone: <Brain className="h-5 w-5" style={{ color: C.laranja }} /> },
        { titulo: `Avaliação — ${plan.titulo}`, descricao: aval, icone: <Shield className="h-5 w-5" style={{ color: C.azulVivo }} /> },
        { titulo: `Conteúdo — ${plan.titulo}`, descricao: conteudo, icone: <FileText className="h-5 w-5" style={{ color: C.verde }} /> },
      )
    }
    return items.slice(0, 3)
  }, [plans])

  // ──────────────── Empty State ──────────────────────────────
  if (!selectedId) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#0D2045' }}>
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: C.azulNoite }}>Histórico de Evolução</h2>
            <p className="text-sm text-muted-foreground">Acompanhe a trajetória cognitiva e comportamental do aluno</p>
          </div>
        </div>

        {/* Student selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Selecione um Aluno</CardTitle>
            <CardDescription>Pesquise por nome ou matrícula para visualizar o histórico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar aluno por nome ou matrícula..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <ScrollArea className="max-h-96">
              <div className="space-y-2">
                {filtered.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhum aluno encontrado</p>
                ) : (
                  filtered.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border hover:border-[#1E5EFF]/40 hover:bg-[#1E5EFF]/5 transition-colors text-left"
                    >
                      <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#0D2045' }}>
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{s.nomeCompleto}</p>
                        <p className="text-xs text-muted-foreground">Matrícula: {s.matricula}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        {s.necessidadeEspecial && (
                          <Badge className="text-[10px] px-1.5" style={{ backgroundColor: '#FF6B2B20', color: C.laranja, borderColor: C.laranja + '40' }} variant="outline">NEE</Badge>
                        )}
                        <Badge className="text-[10px] px-1.5" variant="outline">{s.situacao}</Badge>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ──────────────── Loading ──────────────────────────────────
  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="space-y-2"><Skeleton className="h-5 w-48" /><Skeleton className="h-3 w-72" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  // ──────────────── Main View ────────────────────────────────
  const latestProfile = profiles[profiles.length - 1]
  const previousProfile = profiles.length >= 2 ? profiles[profiles.length - 2] : null

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* ── Header + Student Info ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#0D2045' }}>
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: C.azulNoite }}>Histórico de Evolução</h2>
            <p className="text-sm text-muted-foreground">Acompanhe a trajetória cognitiva e comportamental</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setSelectedId(null); setSearch('') }}>
          Trocar Aluno
        </Button>
      </div>

      {/* Student info card */}
      {selectedStudent && (
        <Card style={{ borderLeft: `4px solid ${C.azulVivo}` }}>
          <CardContent className="p-4 flex flex-wrap items-center gap-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#0D2045' }}>
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base" style={{ color: C.azulNoite }}>{selectedStudent.nomeCompleto}</p>
              <p className="text-xs text-muted-foreground">Matrícula: {selectedStudent.matricula}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedStudent.cid && (
                <Badge style={{ backgroundColor: '#1E5EFF15', color: C.azulVivo, borderColor: C.azulVivo + '30' }} variant="outline">CID: {selectedStudent.cid}</Badge>
              )}
              {selectedStudent.tipoDeficiencia && (
                <Badge style={{ backgroundColor: '#FF6B2B15', color: C.laranja, borderColor: C.laranja + '30' }} variant="outline">{selectedStudent.tipoDeficiencia}</Badge>
              )}
              {selectedStudent.necessidadeEspecial && (
                <Badge style={{ backgroundColor: '#00D4A015', color: C.verde, borderColor: C.verde + '30' }} variant="outline">NEE</Badge>
              )}
              <Badge variant="outline">{selectedStudent.situacao}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 1. Evolution Comparative Table ───────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" style={{ color: C.azulVivo }} />
            <CardTitle className="text-base">Tabela Comparativa de Evolução (PDI)</CardTitle>
          </div>
          <CardDescription>Comparação entre períodos de avaliação por área do PDI</CardDescription>
        </CardHeader>
        <CardContent>
          {pdiData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">São necessárias pelo menos 2 avaliações para comparação</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Área PDI</TableHead>
                    <TableHead className="text-center">Período Anterior</TableHead>
                    <TableHead className="text-center">Período Atual</TableHead>
                    <TableHead className="text-center">Status de Evolução</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pdiData.map(row => {
                    const st = progressStatus(row.currentAvg, row.previousAvg)
                    return (
                      <TableRow key={row.area.name}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span style={{ color: C.azulVivo }}>{row.area.icon}</span>
                            <span className="font-medium text-sm">{row.area.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-mono text-sm">{row.previousAvg}</TableCell>
                        <TableCell className="text-center font-mono text-sm font-semibold">{row.currentAvg}</TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: st.bg, color: st.color }}>
                            {st.icon} {st.label}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 2. Sensory Tolerance Curve ───────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" style={{ color: C.laranja }} />
            <CardTitle className="text-base">Curva de Tolerância Sensorial</CardTitle>
          </div>
          <CardDescription>Projeção do nível de estabilização vs eventos de desregulação neurológica</CardDescription>
        </CardHeader>
        <CardContent>
          {sensoryData.length < 2 ? (
            <p className="text-sm text-muted-foreground text-center py-6">São necessárias pelo menos 2 avaliações para projetar a curva</p>
          ) : (
            <div className="space-y-3">
              {/* Zone legend */}
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: C.verde }} /> Zona de Regulação</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: C.laranja }} /> Zona de Alerta</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: C.vermelho }} /> Zona de Crise</span>
              </div>
              <ChartContainer config={sensoryChartConfig} className="h-[260px] w-full">
                <AreaChart data={sensoryData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sensGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.azulVivo} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={C.azulVivo} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {/* Zone backgrounds */}
                  <ReferenceLine y={8} stroke={C.verde} strokeDasharray="6 3" strokeWidth={1} label={{ value: 'Regulação', position: 'right', fill: C.verde, fontSize: 10 }} />
                  <ReferenceLine y={5} stroke={C.laranja} strokeDasharray="6 3" strokeWidth={1} label={{ value: 'Alerta', position: 'right', fill: C.laranja, fontSize: 10 }} />
                  <ReferenceLine y={3} stroke={C.vermelho} strokeDasharray="6 3" strokeWidth={1} label={{ value: 'Crise', position: 'right', fill: C.vermelho, fontSize: 10 }} />
                  <Area type="monotone" dataKey="tolerancia" stroke={C.azulVivo} strokeWidth={2} fill="url(#sensGrad)" />
                </AreaChart>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 3. Learning Evolution Chart ──────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" style={{ color: C.verde }} />
            <CardTitle className="text-base">Evolução da Aprendizagem</CardTitle>
          </div>
          <CardDescription>Média comportamental, cognitiva e pedagógica ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          {evolutionData.length < 2 ? (
            <p className="text-sm text-muted-foreground text-center py-6">São necessárias pelo menos 2 avaliações para exibir a evolução</p>
          ) : (
            <ChartContainer config={evolutionChartConfig} className="h-[280px] w-full">
              <LineChart data={evolutionData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="comportamental" stroke={C.laranja}  strokeWidth={2} dot={{ r: 4, fill: C.laranja }} />
                <Line type="monotone" dataKey="cognitivo"      stroke={C.azulVivo}  strokeWidth={2} dot={{ r: 4, fill: C.azulVivo }} />
                <Line type="monotone" dataKey="pedagogico"     stroke={C.verde}     strokeWidth={2} dot={{ r: 4, fill: C.verde }} />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* ── 4 + 5 side by side on md+ ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── 4. Clinical Impact Analysis ───────────────── */}
        <Card style={{ borderTop: `3px solid ${C.laranja}` }}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" style={{ color: C.laranja }} />
              <CardTitle className="text-base">Análise de Impacto Clínico Recursal</CardTitle>
            </div>
            <CardDescription>Como o suporte interdisciplinar interferiu no ritmo de aprendizagem</CardDescription>
          </CardHeader>
          <CardContent>
            {clinicalImpact.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Nenhum registro de impacto clínico encontrado</p>
            ) : (
              <ScrollArea className="max-h-72">
                <div className="space-y-3">
                  {clinicalImpact.map(item => (
                    <div key={item.id} className="p-3 rounded-lg border" style={{ borderLeft: `3px solid ${C.laranja}` }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge className="text-[10px] px-1.5" style={{ backgroundColor: '#FF6B2B15', color: C.laranja, borderColor: C.laranja + '30' }} variant="outline">{item.tipo}</Badge>
                        <span className="text-[10px] text-muted-foreground">{new Date(item.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <p className="text-sm font-medium" style={{ color: C.azulNoite }}>{item.titulo}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{item.impacto}</p>
                      <p className="text-[10px] text-muted-foreground mt-1.5">Por: {item.autor} ({item.cargo})</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* ── 5. Future Methodological Adaptations ──────── */}
        <Card style={{ borderTop: `3px solid ${C.verde}` }}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" style={{ color: C.verde }} />
              <CardTitle className="text-base">Adaptações Metodológicas Futuras</CardTitle>
            </div>
            <CardDescription>3 diretrizes pragmáticas para o próximo período de planejamento</CardDescription>
          </CardHeader>
          <CardContent>
            {adaptations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Nenhum plano de ensino encontrado para este aluno</p>
            ) : (
              <div className="space-y-3">
                {adaptations.map((a, i) => (
                  <div key={i} className="p-3 rounded-lg border hover:border-[#00D4A0]/40 transition-colors" style={{ borderLeft: `3px solid ${i === 0 ? C.laranja : i === 1 ? C.azulVivo : C.verde}` }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      {a.icone}
                      <span className="text-sm font-semibold" style={{ color: C.azulNoite }}>{a.titulo}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{a.descricao}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── 6. Current Profile Summary (if available) ──── */}
      {latestProfile && (
        <Card style={{ borderLeft: `4px solid ${C.azulVivo}` }}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" style={{ color: C.azulVivo }} />
              <CardTitle className="text-base">Resumo do Perfil Cognitivo Atual</CardTitle>
            </div>
            <CardDescription>
              Última avaliação: {latestProfile.dataAvaliacao ? new Date(latestProfile.dataAvaliacao).toLocaleDateString('pt-BR') : '—'}
              {latestProfile.avaliador && ` — Avaliador: ${latestProfile.avaliador}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                { label: 'Comportamental', avg: avg(BEHAV_DIMS, latestProfile), color: C.laranja, prevAvg: previousProfile ? avg(BEHAV_DIMS, previousProfile) : null },
                { label: 'Cognitivo',      avg: avg(COGN_DIMS, latestProfile),  color: C.azulVivo, prevAvg: previousProfile ? avg(COGN_DIMS, previousProfile) : null },
                { label: 'Pedagógico',     avg: avg(PEDAG_DIMS, latestProfile), color: C.verde, prevAvg: previousProfile ? avg(PEDAG_DIMS, previousProfile) : null },
              ] as const).map(cat => (
                <div key={cat.label} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{cat.label}</span>
                    {cat.prevAvg !== null && (
                      <span className="text-xs font-medium" style={{ color: cat.avg >= cat.prevAvg ? C.verde : C.vermelho }}>
                        {cat.avg >= cat.prevAvg ? '+' : ''}{(cat.avg - cat.prevAvg).toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold" style={{ color: cat.color }}>{cat.avg}</div>
                  <Progress value={cat.avg * 10} className="h-2 mt-2" />
                  <div className="flex items-center gap-1 mt-2">
                    {latestProfile.nivelEvolucao && (
                      <Badge className="text-[10px] px-1.5" style={{
                        backgroundColor: latestProfile.nivelEvolucao === 'Evolução excelente' || latestProfile.nivelEvolucao === 'Evolução satisfatória'
                          ? '#00D4A015' : latestProfile.nivelEvolucao === 'Regressão' ? '#EF444415' : '#FF6B2B15',
                        color: latestProfile.nivelEvolucao === 'Evolução excelente' || latestProfile.nivelEvolucao === 'Evolução satisfatória'
                          ? C.verde : latestProfile.nivelEvolucao === 'Regressão' ? C.vermelho : C.laranja,
                        borderColor: 'transparent',
                      }}>{latestProfile.nivelEvolucao}</Badge>
                    )}
                    {latestProfile.estadoEmocional && (
                      <Badge className="text-[10px] px-1.5" variant="outline">{latestProfile.estadoEmocional}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Dimension details */}
            <Separator className="my-4" />
            <div className="space-y-4">
              {([
                { title: 'Perfil Comportamental', dims: BEHAV_DIMS },
                { title: 'Perfil Cognitivo', dims: COGN_DIMS },
                { title: 'Perfil Pedagógico', dims: PEDAG_DIMS },
              ] as const).map(group => (
                <div key={group.title}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{group.title}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {group.dims.map(d => {
                      const val = latestProfile[d] ?? 0
                      const color = val <= 3 ? C.vermelho : val <= 5 ? C.amarelo : val <= 7 ? C.azulVivo : C.verde
                      const prevVal = previousProfile?.[d] ?? null
                      return (
                        <div key={d} className="p-2 rounded-md border text-center">
                          <p className="text-[10px] text-muted-foreground truncate">{DIM_LABELS[d]}</p>
                          <p className="text-lg font-bold" style={{ color }}>{val}</p>
                          {prevVal !== null && (
                            <p className="text-[10px] font-medium" style={{ color: val >= prevVal ? C.verde : C.vermelho }}>
                              {val >= prevVal ? '↑' : '↓'} {Math.abs(val - prevVal).toFixed(0)}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 7. Report History Timeline ──────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" style={{ color: C.azulVivo }} />
            <CardTitle className="text-base">Histórico de Relatórios</CardTitle>
          </div>
          <CardDescription>Linha do tempo com todos os relatórios emitidos para o aluno</CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhum relatório encontrado para este aluno</p>
          ) : (
            <ScrollArea className="max-h-96">
              <div className="relative pl-6">
                {/* Timeline line */}
                <div className="absolute left-2 top-2 bottom-2 w-0.5" style={{ backgroundColor: '#e5e7eb' }} />

                <div className="space-y-4">
                  {reports
                    .sort((a, b) => new Date(b.dataEmissao ?? b.createdAt).getTime() - new Date(a.dataEmissao ?? a.createdAt).getTime())
                    .map(r => {
                      const isExpanded = expandedReport === r.id
                      const date = r.dataEmissao ? new Date(r.dataEmissao).toLocaleDateString('pt-BR') : new Date(r.createdAt).toLocaleDateString('pt-BR')
                      const tipoColors: Record<string, string> = {
                        'Pedagógico': C.azulVivo,
                        'Psicológico': C.laranja,
                        'Multidisciplinar': C.verde,
                        'Governamental': '#8B5CF6',
                        'Familiar': '#EC4899',
                      }
                      const tc = tipoColors[r.tipo] || C.azulVivo
                      const statusColors: Record<string, { bg: string; fg: string }> = {
                        'Rascunho': { bg: '#F59E0B15', fg: C.amarelo },
                        'Revisão': { bg: '#1E5EFF15', fg: C.azulVivo },
                        'Finalizado': { bg: '#00D4A015', fg: C.verde },
                      }
                      const sc = statusColors[r.status] || { bg: '#e5e7eb', fg: '#6b7280' }

                      return (
                        <div key={r.id} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-4 top-2 h-3 w-3 rounded-full border-2" style={{ borderColor: tc, backgroundColor: '#fff' }} />

                          <div className="p-3 rounded-lg border hover:border-[#1E5EFF]/30 transition-colors">
                            <div className="flex items-start justify-between gap-2 cursor-pointer" onClick={() => setExpandedReport(isExpanded ? null : r.id)}>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <Badge className="text-[10px] px-1.5" style={{ backgroundColor: tc + '15', color: tc, borderColor: tc + '30' }} variant="outline">{r.tipo}</Badge>
                                  <Badge className="text-[10px] px-1.5" style={{ backgroundColor: sc.bg, color: sc.fg, borderColor: 'transparent' }}>{r.status}</Badge>
                                  <span className="text-[10px] text-muted-foreground">{date}</span>
                                </div>
                                <p className="text-sm font-medium truncate" style={{ color: C.azulNoite }}>{r.titulo}</p>
                                {!isExpanded && r.conteudo && (
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{r.conteudo}</p>
                                )}
                              </div>
                              {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                            </div>

                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t">
                                {r.conteudo && (
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{r.conteudo}</p>
                                )}
                                <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-muted-foreground">
                                  {r.periodo && <span>Período: {r.periodo}</span>}
                                  {r.geradoPor && <span>Gerado por: {r.geradoPor}</span>}
                                  {r.revisadoPor && <span>Revisado por: {r.revisadoPor}</span>}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* ── No profiles state ────────────────────────────── */}
      {profiles.length === 0 && !loading && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Brain className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium text-muted-foreground">Nenhum perfil cognitivo registrado</p>
            <p className="text-sm text-muted-foreground mt-1">Registre avaliações cognitivas para este aluno para visualizar o histórico de evolução.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
