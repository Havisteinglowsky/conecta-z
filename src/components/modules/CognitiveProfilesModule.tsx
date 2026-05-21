'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import {
  Brain,
  Search,
  Plus,
  ChevronLeft,
  Activity,
  BookOpen,
  GraduationCap,
  Heart,
  TrendingUp,
  Clock,
  User,
  History,
  Save,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  fetchStudents,
  fetchCognitiveProfiles,
  createCognitiveProfile,
  updateCognitiveProfile,
  deleteCognitiveProfile,
} from '@/lib/api'
import type { Student, CognitiveProfile, CognitiveProfileFormData } from '@/lib/types'
import {
  ESTILOS_APRENDIZAGEM_OPTIONS,
  NIVEL_EVOLUCAO_OPTIONS,
  ESTADO_EMOCIONAL_OPTIONS,
} from '@/lib/constants'

// ---- Helpers ----
function getColorForValue(v: number): string {
  if (v <= 3) return 'bg-red-500'
  if (v <= 5) return 'bg-amber-500'
  if (v <= 7) return 'bg-teal-500'
  return 'bg-emerald-500'
}

function getProgressColor(v: number): string {
  if (v <= 3) return '[&>div]:bg-red-500'
  if (v <= 5) return '[&>div]:bg-amber-500'
  if (v <= 7) return '[&>div]:bg-teal-500'
  return '[&>div]:bg-emerald-500'
}

function getTextColor(v: number): string {
  if (v <= 3) return 'text-red-600'
  if (v <= 5) return 'text-amber-600'
  if (v <= 7) return 'text-teal-600'
  return 'text-emerald-600'
}

function getNivelEvolucaoBadge(nivel: string | null) {
  if (!nivel) return <Badge variant="secondary">N/A</Badge>
  const map: Record<string, string> = {
    Regressão: 'bg-red-100 text-red-700 border-red-200',
    Estável: 'bg-amber-100 text-amber-700 border-amber-200',
    'Evolução lenta': 'bg-teal-100 text-teal-700 border-teal-200',
    'Evolução satisfatória': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Evolução excelente': 'bg-emerald-200 text-emerald-800 border-emerald-300',
  }
  return (
    <Badge className={map[nivel] || 'bg-gray-100 text-gray-700'}>
      {nivel}
    </Badge>
  )
}

function getEstadoEmocionalBadge(estado: string | null) {
  if (!estado) return <Badge variant="secondary">N/A</Badge>
  const map: Record<string, string> = {
    Estável: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Instável: 'bg-red-100 text-red-700 border-red-200',
    'Em transição': 'bg-amber-100 text-amber-700 border-amber-200',
  }
  return (
    <Badge className={map[estado] || 'bg-gray-100 text-gray-700'}>
      {estado}
    </Badge>
  )
}

// Dimension groups
const BEHAVIORAL_DIMS = [
  { key: 'atencao', label: 'Atenção' },
  { key: 'foco', label: 'Foco' },
  { key: 'impulsividade', label: 'Impulsividade' },
  { key: 'sociabilidade', label: 'Sociabilidade' },
  { key: 'autonomia', label: 'Autonomia' },
  { key: 'motivacao', label: 'Motivação' },
  { key: 'adaptabilidade', label: 'Adaptabilidade' },
] as const

const COGNITIVE_DIMS = [
  { key: 'memoria', label: 'Memória' },
  { key: 'raciocinioLogico', label: 'Raciocínio Lógico' },
  { key: 'compreensao', label: 'Compreensão' },
  { key: 'velocidadeProcessamento', label: 'Velocidade Processamento' },
  { key: 'resolucaoProblemas', label: 'Resolução Problemas' },
  { key: 'criatividade', label: 'Criatividade' },
  { key: 'linguagem', label: 'Linguagem' },
] as const

const PEDAGOGICAL_DIMS = [
  { key: 'leitura', label: 'Leitura' },
  { key: 'escrita', label: 'Escrita' },
  { key: 'calculo', label: 'Cálculo' },
  { key: 'interpretacao', label: 'Interpretação' },
  { key: 'producaoTextual', label: 'Produção Textual' },
] as const

const ALL_DIMS = [...BEHAVIORAL_DIMS, ...COGNITIVE_DIMS, ...PEDAGOGICAL_DIMS]

type DimKey = (typeof ALL_DIMS)[number]['key']

function buildRadarData(profile: CognitiveProfile) {
  return ALL_DIMS.map((d) => ({
    dimension: d.label,
    value: (profile as unknown as Record<string, unknown>)[d.key] as number ?? 0,
  }))
}

const defaultFormData: CognitiveProfileFormData = {
  studentId: '',
  atencao: 5,
  foco: 5,
  impulsividade: 5,
  sociabilidade: 5,
  autonomia: 5,
  motivacao: 5,
  adaptabilidade: 5,
  memoria: 5,
  raciocinioLogico: 5,
  compreensao: 5,
  velocidadeProcessamento: 5,
  resolucaoProblemas: 5,
  criatividade: 5,
  linguagem: 5,
  leitura: 5,
  escrita: 5,
  calculo: 5,
  interpretacao: 5,
  producaoTextual: 5,
  dificuldades: '',
  habilidades: '',
  estilosAprendizagem: '',
  estrategiasRecomendadas: '',
  estadoEmocional: '',
  regressoes: '',
  observacoesEmocionais: '',
  nivelEvolucao: '',
  dataAvaliacao: new Date().toISOString().split('T')[0],
  avaliador: '',
  observacoes: '',
}

export default function CognitiveProfilesModule() {
  const [students, setStudents] = useState<Student[]>([])
  const [studentsLoading, setStudentsLoading] = useState(true)
  const [studentSearch, setStudentSearch] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const [profiles, setProfiles] = useState<CognitiveProfile[]>([])
  const [profilesLoading, setProfilesLoading] = useState(false)
  const [activeProfile, setActiveProfile] = useState<CognitiveProfile | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<CognitiveProfileFormData>(defaultFormData)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Load students
  useEffect(() => {
    async function load() {
      setStudentsLoading(true)
      try {
        const data = await fetchStudents({ search: studentSearch || undefined })
        setStudents(data)
      } catch {
        toast.error('Erro ao carregar alunos')
      } finally {
        setStudentsLoading(false)
      }
    }
    load()
  }, [studentSearch])

  // Load profiles when student selected
  const loadProfiles = useCallback(async () => {
    if (!selectedStudentId) return
    setProfilesLoading(true)
    try {
      const data = await fetchCognitiveProfiles(selectedStudentId)
      setProfiles(data)
      if (data.length > 0) {
        setActiveProfile(data[0])
      } else {
        setActiveProfile(null)
      }
    } catch {
      toast.error('Erro ao carregar perfis cognitivos')
    } finally {
      setProfilesLoading(false)
    }
  }, [selectedStudentId])

  useEffect(() => {
    loadProfiles()
  }, [loadProfiles])

  // Set selected student object
  useEffect(() => {
    const s = students.find((st) => st.id === selectedStudentId)
    setSelectedStudent(s || null)
  }, [selectedStudentId, students])

  function handleNewProfile() {
    setFormData({
      ...defaultFormData,
      studentId: selectedStudentId || '',
      dataAvaliacao: new Date().toISOString().split('T')[0],
    })
    setEditingId(null)
    setShowForm(true)
  }

  function handleEditProfile(profile: CognitiveProfile) {
    setFormData({
      studentId: profile.studentId,
      atencao: profile.atencao ?? 5,
      foco: profile.foco ?? 5,
      impulsividade: profile.impulsividade ?? 5,
      sociabilidade: profile.sociabilidade ?? 5,
      autonomia: profile.autonomia ?? 5,
      motivacao: profile.motivacao ?? 5,
      adaptabilidade: profile.adaptabilidade ?? 5,
      memoria: profile.memoria ?? 5,
      raciocinioLogico: profile.raciocinioLogico ?? 5,
      compreensao: profile.compreensao ?? 5,
      velocidadeProcessamento: profile.velocidadeProcessamento ?? 5,
      resolucaoProblemas: profile.resolucaoProblemas ?? 5,
      criatividade: profile.criatividade ?? 5,
      linguagem: profile.linguagem ?? 5,
      leitura: profile.leitura ?? 5,
      escrita: profile.escrita ?? 5,
      calculo: profile.calculo ?? 5,
      interpretacao: profile.interpretacao ?? 5,
      producaoTextual: profile.producaoTextual ?? 5,
      dificuldades: profile.dificuldades || '',
      habilidades: profile.habilidades || '',
      estilosAprendizagem: profile.estilosAprendizagem || '',
      estrategiasRecomendadas: profile.estrategiasRecomendadas || '',
      estadoEmocional: profile.estadoEmocional || '',
      regressoes: profile.regressoes || '',
      observacoesEmocionais: profile.observacoesEmocionais || '',
      nivelEvolucao: profile.nivelEvolucao || '',
      dataAvaliacao: profile.dataAvaliacao?.split('T')[0] || new Date().toISOString().split('T')[0],
      avaliador: profile.avaliador || '',
      observacoes: profile.observacoes || '',
    })
    setEditingId(profile.id)
    setShowForm(true)
  }

  async function handleSave() {
    if (!formData.studentId) {
      toast.error('Selecione um aluno')
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        await updateCognitiveProfile(editingId, formData)
        toast.success('Perfil atualizado com sucesso!')
      } else {
        await createCognitiveProfile(formData)
        toast.success('Perfil criado com sucesso!')
      }
      setShowForm(false)
      loadProfiles()
    } catch {
      toast.error('Erro ao salvar perfil')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deletingId) return
    try {
      await deleteCognitiveProfile(deletingId)
      toast.success('Perfil excluído com sucesso!')
      setShowDeleteDialog(false)
      setDeletingId(null)
      loadProfiles()
    } catch {
      toast.error('Erro ao excluir perfil')
    }
  }

  function updateDim(key: DimKey, value: number) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  // ---- STUDENT SELECTOR VIEW ----
  if (!selectedStudentId) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Brain className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Perfil Cognitivo Evolutivo (PCE)</h2>
            <p className="text-sm text-muted-foreground">
              Selecione um aluno para visualizar ou criar o perfil cognitivo
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-600" />
              Buscar Aluno
            </CardTitle>
            <CardDescription>
              Digite o nome ou matrícula para encontrar o aluno
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou matrícula..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {studentsLoading ? (
              <div className="mt-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : students.length === 0 ? (
              <div className="mt-6 text-center text-muted-foreground py-8">
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Nenhum aluno encontrado</p>
              </div>
            ) : (
              <ScrollArea className="mt-4 max-h-96">
                <div className="space-y-2">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-emerald-50 hover:border-emerald-200 transition-colors text-left"
                    >
                      <div>
                        <p className="font-medium">{student.nomeCompleto}</p>
                        <p className="text-sm text-muted-foreground">
                          Matrícula: {student.matricula}
                          {student.serieAno && ` • ${student.serieAno}`}
                          {student.turno && ` • ${student.turno}`}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          student.situacao === 'Ativo'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : student.situacao === 'Transferido'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                        }
                      >
                        {student.situacao}
                      </Badge>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // ---- PROFILE VIEW ----
  const radarData = activeProfile ? buildRadarData(activeProfile) : []
  const avgBehavioral = activeProfile
    ? BEHAVIORAL_DIMS.reduce(
        (sum, d) => sum + ((activeProfile as unknown as Record<string, unknown>)[d.key] as number ?? 0),
        0
      ) / BEHAVIORAL_DIMS.length
    : 0
  const avgCognitive = activeProfile
    ? COGNITIVE_DIMS.reduce(
        (sum, d) => sum + ((activeProfile as unknown as Record<string, unknown>)[d.key] as number ?? 0),
        0
      ) / COGNITIVE_DIMS.length
    : 0
  const avgPedagogical = activeProfile
    ? PEDAGOGICAL_DIMS.reduce(
        (sum, d) => sum + ((activeProfile as unknown as Record<string, unknown>)[d.key] as number ?? 0),
        0
      ) / PEDAGOGICAL_DIMS.length
    : 0

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedStudentId(null)
              setActiveProfile(null)
              setProfiles([])
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Brain className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {selectedStudent?.nomeCompleto || 'Perfil Cognitivo'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Matrícula: {selectedStudent?.matricula}
            </p>
          </div>
        </div>
        <Button
          onClick={handleNewProfile}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Avaliação
        </Button>
      </div>

      {profilesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : !activeProfile ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center text-muted-foreground">
            <Brain className="w-16 h-16 mx-auto mb-4 opacity-15" />
            <p className="text-lg font-medium mb-2">
              Nenhum perfil cognitivo registrado
            </p>
            <p className="mb-4">
              Clique em &quot;Nova Avaliação&quot; para criar o primeiro perfil
              cognitivo deste aluno.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Radar Chart + Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Radar Chart */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Visão Geral do Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis
                        dataKey="dimension"
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 10]}
                        tick={{ fontSize: 9 }}
                      />
                      <Radar
                        name="Perfil"
                        dataKey="value"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          fontSize: '12px',
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Summary Averages */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Médias por Dimensão
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                {/* Behavioral */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="font-medium text-sm">Comportamental</span>
                    </div>
                    <span className={`text-lg font-bold ${getTextColor(avgBehavioral)}`}>
                      {avgBehavioral.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={avgBehavioral * 10} className={`h-2.5 ${getProgressColor(avgBehavioral)}`} />
                </div>
                {/* Cognitive */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-teal-600" />
                      </div>
                      <span className="font-medium text-sm">Cognitivo</span>
                    </div>
                    <span className={`text-lg font-bold ${getTextColor(avgCognitive)}`}>
                      {avgCognitive.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={avgCognitive * 10} className={`h-2.5 ${getProgressColor(avgCognitive)}`} />
                </div>
                {/* Pedagogical */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="font-medium text-sm">Pedagógico</span>
                    </div>
                    <span className={`text-lg font-bold ${getTextColor(avgPedagogical)}`}>
                      {avgPedagogical.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={avgPedagogical * 10} className={`h-2.5 ${getProgressColor(avgPedagogical)}`} />
                </div>

                <Separator />

                {/* Evolution + Emotional */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Nível Evolução
                    </p>
                    {getNivelEvolucaoBadge(activeProfile.nivelEvolucao)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Heart className="w-3 h-3" /> Estado Emocional
                    </p>
                    {getEstadoEmocionalBadge(activeProfile.estadoEmocional)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Data Avaliação
                    </p>
                    <p className="text-sm font-medium">
                      {activeProfile.dataAvaliacao
                        ? new Date(activeProfile.dataAvaliacao).toLocaleDateString('pt-BR')
                        : '—'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="w-3 h-3" /> Avaliador
                    </p>
                    <p className="text-sm font-medium">{activeProfile.avaliador || '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dimension Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Behavioral */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center">
                    <Heart className="w-3 h-3 text-orange-600" />
                  </div>
                  Perfil Comportamental
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {BEHAVIORAL_DIMS.map((d) => {
                  const val = (activeProfile as unknown as Record<string, unknown>)[d.key] as number ?? 0
                  return (
                    <div key={d.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{d.label}</span>
                        <span className={`text-xs font-bold ${getTextColor(val)}`}>{val}/10</span>
                      </div>
                      <Progress value={val * 10} className={`h-2 ${getProgressColor(val)}`} />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Cognitive */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-teal-100 flex items-center justify-center">
                    <Brain className="w-3 h-3 text-teal-600" />
                  </div>
                  Perfil Cognitivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {COGNITIVE_DIMS.map((d) => {
                  const val = (activeProfile as unknown as Record<string, unknown>)[d.key] as number ?? 0
                  return (
                    <div key={d.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{d.label}</span>
                        <span className={`text-xs font-bold ${getTextColor(val)}`}>{val}/10</span>
                      </div>
                      <Progress value={val * 10} className={`h-2 ${getProgressColor(val)}`} />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Pedagogical */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center">
                    <GraduationCap className="w-3 h-3 text-emerald-600" />
                  </div>
                  Perfil Pedagógico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {PEDAGOGICAL_DIMS.map((d) => {
                  const val = (activeProfile as unknown as Record<string, unknown>)[d.key] as number ?? 0
                  return (
                    <div key={d.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{d.label}</span>
                        <span className={`text-xs font-bold ${getTextColor(val)}`}>{val}/10</span>
                      </div>
                      <Progress value={val * 10} className={`h-2 ${getProgressColor(val)}`} />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Diagnosis + Emotional + Evolution Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Diagnosis */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Diagnóstico Pedagógico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Dificuldades</p>
                  <p className="text-sm">{activeProfile.dificuldades || '—'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Habilidades</p>
                  <p className="text-sm">{activeProfile.habilidades || '—'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Estilos de Aprendizagem</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeProfile.estilosAprendizagem
                      ? activeProfile.estilosAprendizagem
                          .split(',')
                          .map((s, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                              {s.trim()}
                            </Badge>
                          ))
                      : <span className="text-sm text-muted-foreground">—</span>}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Estratégias Recomendadas</p>
                  <p className="text-sm">{activeProfile.estrategiasRecomendadas || '—'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Emotional History */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  Histórico Emocional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Estado Emocional</p>
                  {getEstadoEmocionalBadge(activeProfile.estadoEmocional)}
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Regressões</p>
                  <p className="text-sm">{activeProfile.regressoes || '—'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Observações Emocionais</p>
                  <p className="text-sm">{activeProfile.observacoesEmocionais || '—'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Observações Gerais</p>
                  <p className="text-sm">{activeProfile.observacoes || '—'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History */}
          {profiles.length > 1 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-600" />
                  Histórico de Avaliações ({profiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-72">
                  <div className="space-y-2">
                    {profiles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setActiveProfile(p)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left ${
                          p.id === activeProfile.id
                            ? 'bg-emerald-50 border-emerald-300'
                            : 'hover:bg-gray-50 border-gray-100'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {p.dataAvaliacao
                              ? new Date(p.dataAvaliacao).toLocaleDateString('pt-BR')
                              : 'Sem data'}
                            {p.avaliador && ` — ${p.avaliador}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Nível: {p.nivelEvolucao || 'N/A'} • Emocional:{' '}
                            {p.estadoEmocional || 'N/A'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getNivelEvolucaoBadge(p.nivelEvolucao)}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditProfile(p)
                            }}
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeletingId(p.id)
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-emerald-600" />
              {editingId ? 'Editar Perfil Cognitivo' : 'Nova Avaliação Cognitiva'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6 pb-4">
              {/* Behavioral Sliders */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center">
                    <Heart className="w-3 h-3 text-orange-600" />
                  </div>
                  Perfil Comportamental
                </h4>
                {BEHAVIORAL_DIMS.map((d) => (
                  <div key={d.key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">{d.label}</Label>
                      <span className={`text-xs font-bold ${getTextColor(formData[d.key as DimKey] ?? 5)}`}>
                        {formData[d.key as DimKey] ?? 5}
                      </span>
                    </div>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[formData[d.key as DimKey] ?? 5]}
                      onValueChange={([v]) => updateDim(d.key, v)}
                    />
                  </div>
                ))}
              </div>

              <Separator />

              {/* Cognitive Sliders */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-teal-100 flex items-center justify-center">
                    <Brain className="w-3 h-3 text-teal-600" />
                  </div>
                  Perfil Cognitivo
                </h4>
                {COGNITIVE_DIMS.map((d) => (
                  <div key={d.key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">{d.label}</Label>
                      <span className={`text-xs font-bold ${getTextColor(formData[d.key as DimKey] ?? 5)}`}>
                        {formData[d.key as DimKey] ?? 5}
                      </span>
                    </div>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[formData[d.key as DimKey] ?? 5]}
                      onValueChange={([v]) => updateDim(d.key, v)}
                    />
                  </div>
                ))}
              </div>

              <Separator />

              {/* Pedagogical Sliders */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center">
                    <GraduationCap className="w-3 h-3 text-emerald-600" />
                  </div>
                  Perfil Pedagógico
                </h4>
                {PEDAGOGICAL_DIMS.map((d) => (
                  <div key={d.key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">{d.label}</Label>
                      <span className={`text-xs font-bold ${getTextColor(formData[d.key as DimKey] ?? 5)}`}>
                        {formData[d.key as DimKey] ?? 5}
                      </span>
                    </div>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[formData[d.key as DimKey] ?? 5]}
                      onValueChange={([v]) => updateDim(d.key, v)}
                    />
                  </div>
                ))}
              </div>

              <Separator />

              {/* Diagnosis */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Diagnóstico Pedagógico
                </h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Dificuldades</Label>
                    <Textarea
                      value={formData.dificuldades || ''}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, dificuldades: e.target.value }))
                      }
                      placeholder="Descreva as dificuldades identificadas..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Habilidades</Label>
                    <Textarea
                      value={formData.habilidades || ''}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, habilidades: e.target.value }))
                      }
                      placeholder="Descreva as habilidades identificadas..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Estilos de Aprendizagem</Label>
                    <Select
                      value={formData.estilosAprendizagem || ''}
                      onValueChange={(v) =>
                        setFormData((p) => ({ ...p, estilosAprendizagem: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTILOS_APRENDIZAGEM_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Estratégias Recomendadas</Label>
                    <Textarea
                      value={formData.estrategiasRecomendadas || ''}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          estrategiasRecomendadas: e.target.value,
                        }))
                      }
                      placeholder="Descreva as estratégias recomendadas..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Emotional History */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  Histórico Emocional
                </h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Estado Emocional</Label>
                    <Select
                      value={formData.estadoEmocional || ''}
                      onValueChange={(v) =>
                        setFormData((p) => ({ ...p, estadoEmocional: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTADO_EMOCIONAL_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Regressões</Label>
                    <Textarea
                      value={formData.regressoes || ''}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, regressoes: e.target.value }))
                      }
                      placeholder="Descreva regressões observadas..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Observações Emocionais</Label>
                    <Textarea
                      value={formData.observacoesEmocionais || ''}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          observacoesEmocionais: e.target.value,
                        }))
                      }
                      placeholder="Observações sobre o estado emocional..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Evolution */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Evolução
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Nível de Evolução</Label>
                    <Select
                      value={formData.nivelEvolucao || ''}
                      onValueChange={(v) =>
                        setFormData((p) => ({ ...p, nivelEvolucao: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {NIVEL_EVOLUCAO_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Data Avaliação</Label>
                    <Input
                      type="date"
                      value={formData.dataAvaliacao || ''}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, dataAvaliacao: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Avaliador</Label>
                    <Input
                      value={formData.avaliador || ''}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, avaliador: e.target.value }))
                      }
                      placeholder="Nome do avaliador"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Observações */}
              <div>
                <Label className="text-xs">Observações Gerais</Label>
                <Textarea
                  value={formData.observacoes || ''}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, observacoes: e.target.value }))
                  }
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {saving ? (
                <span className="animate-pulse">Salvando...</span>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Atualizar' : 'Criar'} Perfil
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir este perfil cognitivo? Esta ação não pode
            ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
