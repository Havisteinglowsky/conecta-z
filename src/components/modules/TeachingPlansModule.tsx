'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
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
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BookOpen,
  Plus,
  Search,
  Save,
  Trash2,
  Edit,
  Eye,
  Download,
  Loader2,
  AlertTriangle,
  Target,
  GraduationCap,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  fetchStudents,
  fetchTeachingPlans,
  createTeachingPlan,
  updateTeachingPlan,
  deleteTeachingPlan,
  generatePDFReport,
} from '@/lib/api'
import type { Student, TeachingPlan, TeachingPlanFormData } from '@/lib/types'
import { STATUS_PLANO_OPTIONS } from '@/lib/constants'

// ─── Status badge helper ────────────────────────────────────────────────────────
function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    'Em elaboração': 'bg-gray-100 text-gray-700 border-gray-200',
    'Em revisão': 'bg-amber-100 text-amber-700 border-amber-200',
    'Aprovado': 'bg-teal-100 text-teal-700 border-teal-200',
    'Em execução': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Concluído': 'bg-green-100 text-green-700 border-green-200',
  }
  return <Badge className={map[status] || 'bg-gray-100 text-gray-700'}>{status}</Badge>
}

// ─── Default form data ──────────────────────────────────────────────────────────
const emptyForm: TeachingPlanFormData = {
  studentId: '',
  titulo: '',
  periodo: '',
  anoLetivo: '',
  objetivoGeral: '',
  objetivosEspecificos: '',
  conteudos: '',
  metodologias: '',
  recursosDidaticos: '',
  adaptacaoMetodologia: '',
  adaptacaoAvaliacao: '',
  adaptacaoConteudo: '',
  adaptacaoTemporal: '',
  cronograma: '',
  criteriosAvaliacao: '',
  instrumentosAvaliacao: '',
  frequenciaEsperada: '',
  professorResponsavel: '',
  psicologoResponsavel: '',
  coordenadorResponsavel: '',
  parecerPedagogico: '',
  parecerPsicologico: '',
  parecerFamiliar: '',
  status: 'Em elaboração',
  dataInicio: '',
  dataTermino: '',
  dataRevisao: '',
  observacoes: '',
  ativo: true,
}

// ─── Form Section helper ────────────────────────────────────────────────────────
function FormSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
        {icon}
        <span>{title}</span>
      </div>
      <Separator />
      <div className="space-y-4">{children}</div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function TeachingPlansModule() {
  const [plans, setPlans] = useState<TeachingPlan[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<TeachingPlanFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [viewingPlan, setViewingPlan] = useState<TeachingPlan | null>(null)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  // Filters
  const [filterStudentId, setFilterStudentId] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // ─── Load data ──────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [plansData, studentsData] = await Promise.all([
        fetchTeachingPlans(),
        fetchStudents(),
      ])
      setPlans(plansData)
      setStudents(studentsData)
    } catch {
      toast.error('Erro ao carregar planos de ensino')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // ─── Form handlers ──────────────────────────────────────────────────────────
  const updateField = <K extends keyof TeachingPlanFormData>(key: K, value: TeachingPlanFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function handleNew() {
    setFormData({ ...emptyForm })
    setEditingId(null)
    setShowForm(true)
  }

  function handleEdit(plan: TeachingPlan) {
    setFormData({
      studentId: plan.studentId,
      titulo: plan.titulo,
      periodo: plan.periodo || '',
      anoLetivo: plan.anoLetivo || '',
      objetivoGeral: plan.objetivoGeral || '',
      objetivosEspecificos: plan.objetivosEspecificos || '',
      conteudos: plan.conteudos || '',
      metodologias: plan.metodologias || '',
      recursosDidaticos: plan.recursosDidaticos || '',
      adaptacaoMetodologia: plan.adaptacaoMetodologia || '',
      adaptacaoAvaliacao: plan.adaptacaoAvaliacao || '',
      adaptacaoConteudo: plan.adaptacaoConteudo || '',
      adaptacaoTemporal: plan.adaptacaoTemporal || '',
      cronograma: plan.cronograma || '',
      criteriosAvaliacao: plan.criteriosAvaliacao || '',
      instrumentosAvaliacao: plan.instrumentosAvaliacao || '',
      frequenciaEsperada: plan.frequenciaEsperada || '',
      professorResponsavel: plan.professorResponsavel || '',
      psicologoResponsavel: plan.psicologoResponsavel || '',
      coordenadorResponsavel: plan.coordenadorResponsavel || '',
      parecerPedagogico: plan.parecerPedagogico || '',
      parecerPsicologico: plan.parecerPsicologico || '',
      parecerFamiliar: plan.parecerFamiliar || '',
      status: plan.status || 'Em elaboração',
      dataInicio: plan.dataInicio?.split('T')[0] || '',
      dataTermino: plan.dataTermino?.split('T')[0] || '',
      dataRevisao: plan.dataRevisao?.split('T')[0] || '',
      observacoes: plan.observacoes || '',
      ativo: plan.ativo,
    })
    setEditingId(plan.id)
    setShowForm(true)
  }

  async function handleSave() {
    if (!formData.titulo.trim()) {
      toast.error('Título é obrigatório')
      return
    }
    if (!formData.studentId) {
      toast.error('Selecione o aluno')
      return
    }
    setSaving(true)
    try {
      const payload = { ...formData }
      if (editingId) {
        await updateTeachingPlan(editingId, payload)
        toast.success('Plano de ensino atualizado com sucesso!')
      } else {
        await createTeachingPlan(payload)
        toast.success('Plano de ensino criado com sucesso!')
      }
      setShowForm(false)
      loadData()
    } catch {
      toast.error('Erro ao salvar plano de ensino')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deletingId) return
    try {
      await deleteTeachingPlan(deletingId)
      toast.success('Plano de ensino excluído com sucesso!')
      setShowDeleteDialog(false)
      setDeletingId(null)
      loadData()
    } catch {
      toast.error('Erro ao excluir plano de ensino')
    }
  }

  async function handleGeneratePDF(plan: TeachingPlan) {
    setGeneratingPdf(true)
    try {
      const result = await generatePDFReport({ studentId: plan.studentId, tipo: 'plano_ensino' })
      if (result.success && result.url) {
        window.open(result.url, '_blank')
        toast.success(`PDF "${result.filename}" gerado com sucesso!`)
      } else {
        toast.success('PDF gerado com sucesso!')
      }
    } catch {
      toast.error('Erro ao gerar PDF. Verifique se a API está disponível.')
    } finally {
      setGeneratingPdf(false)
    }
  }

  // ─── Client-side filters ────────────────────────────────────────────────────
  const filteredPlans = plans.filter((p) => {
    if (filterStudentId && p.studentId !== filterStudentId) return false
    if (filterStatus && p.status !== filterStatus) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        p.titulo.toLowerCase().includes(q) ||
        (p.student?.nomeCompleto || '').toLowerCase().includes(q) ||
        (p.objetivoGeral || '').toLowerCase().includes(q)
      )
    }
    return true
  })

  const getStudentName = (id: string) =>
    students.find((s) => s.id === id)?.nomeCompleto || '—'

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Planos de Ensino</h2>
            <p className="text-sm text-muted-foreground">
              Planos de ensino personalizados e adaptações curriculares
            </p>
          </div>
        </div>
        <Button
          onClick={handleNew}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Plano
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, aluno..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            <Select value={filterStudentId} onValueChange={setFilterStudentId}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Aluno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todos os alunos</SelectItem>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nomeCompleto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todos</SelectItem>
                {STATUS_PLANO_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Plans List */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Nenhum plano de ensino encontrado</p>
              <p className="text-sm mt-1">Clique em &quot;Novo Plano&quot; para criar o primeiro plano</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead className="hidden md:table-cell">Aluno</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Período</TableHead>
                    <TableHead className="hidden lg:table-cell">Responsável</TableHead>
                    <TableHead className="w-[130px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <p className="font-medium text-sm">{plan.titulo}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-48">
                          {plan.objetivoGeral?.substring(0, 80) || 'Sem objetivo definido'}
                        </p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {plan.student?.nomeCompleto || getStudentName(plan.studentId)}
                      </TableCell>
                      <TableCell>{getStatusBadge(plan.status)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {plan.periodo || '—'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {plan.professorResponsavel || '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setViewingPlan(plan)}
                            title="Visualizar"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-emerald-600"
                            onClick={() => handleGeneratePDF(plan)}
                            disabled={generatingPdf}
                            title="Gerar PDF"
                          >
                            {generatingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleEdit(plan)}
                            title="Editar"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-700"
                            onClick={() => {
                              setDeletingId(plan.id)
                              setShowDeleteDialog(true)
                            }}
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* View Plan Dialog */}
      <Dialog open={!!viewingPlan} onOpenChange={() => setViewingPlan(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              {viewingPlan?.titulo}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {viewingPlan?.status && getStatusBadge(viewingPlan.status)}
                <Badge variant="outline">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {viewingPlan?.student?.nomeCompleto || getStudentName(viewingPlan?.studentId || '')}
                </Badge>
                {viewingPlan?.periodo && <Badge variant="outline">{viewingPlan.periodo}</Badge>}
                {viewingPlan?.anoLetivo && <Badge variant="outline">{viewingPlan.anoLetivo}</Badge>}
              </div>
              <Separator />
              {/* Objectives */}
              {viewingPlan?.objetivoGeral && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Objetivo Geral</p>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{viewingPlan.objetivoGeral}</p>
                </div>
              )}
              {viewingPlan?.objetivosEspecificos && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Objetivos Específicos</p>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{viewingPlan.objetivosEspecificos}</p>
                </div>
              )}
              {/* Content & Methodology */}
              {viewingPlan?.conteudos && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Conteúdos</p>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{viewingPlan.conteudos}</p>
                </div>
              )}
              {viewingPlan?.metodologias && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Metodologias</p>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{viewingPlan.metodologias}</p>
                </div>
              )}
              {/* Adaptations */}
              {(viewingPlan?.adaptacaoMetodologia || viewingPlan?.adaptacaoAvaliacao || viewingPlan?.adaptacaoConteudo || viewingPlan?.adaptacaoTemporal) && (
                <>
                  <Separator />
                  <p className="text-xs font-semibold text-emerald-700 uppercase">Adaptações</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {viewingPlan?.adaptacaoMetodologia && (
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                        <p className="text-xs font-semibold text-emerald-700">Metodológica</p>
                        <p className="text-sm mt-1">{viewingPlan.adaptacaoMetodologia}</p>
                      </div>
                    )}
                    {viewingPlan?.adaptacaoAvaliacao && (
                      <div className="p-3 rounded-lg bg-teal-50 border border-teal-100">
                        <p className="text-xs font-semibold text-teal-700">Avaliativa</p>
                        <p className="text-sm mt-1">{viewingPlan.adaptacaoAvaliacao}</p>
                      </div>
                    )}
                    {viewingPlan?.adaptacaoConteudo && (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                        <p className="text-xs font-semibold text-amber-700">Conteúdo</p>
                        <p className="text-sm mt-1">{viewingPlan.adaptacaoConteudo}</p>
                      </div>
                    )}
                    {viewingPlan?.adaptacaoTemporal && (
                      <div className="p-3 rounded-lg bg-purple-50 border border-purple-100">
                        <p className="text-xs font-semibold text-purple-700">Temporal</p>
                        <p className="text-sm mt-1">{viewingPlan.adaptacaoTemporal}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
              {/* Evaluation */}
              {(viewingPlan?.criteriosAvaliacao || viewingPlan?.instrumentosAvaliacao || viewingPlan?.frequenciaEsperada) && (
                <>
                  <Separator />
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Avaliação</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {viewingPlan?.criteriosAvaliacao && (
                      <div>
                        <p className="text-xs font-medium">Critérios</p>
                        <p className="text-sm">{viewingPlan.criteriosAvaliacao}</p>
                      </div>
                    )}
                    {viewingPlan?.instrumentosAvaliacao && (
                      <div>
                        <p className="text-xs font-medium">Instrumentos</p>
                        <p className="text-sm">{viewingPlan.instrumentosAvaliacao}</p>
                      </div>
                    )}
                    {viewingPlan?.frequenciaEsperada && (
                      <div>
                        <p className="text-xs font-medium">Frequência Esperada</p>
                        <p className="text-sm">{viewingPlan.frequenciaEsperada}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
              {/* Responsible */}
              {(viewingPlan?.professorResponsavel || viewingPlan?.psicologoResponsavel || viewingPlan?.coordenadorResponsavel) && (
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {viewingPlan?.professorResponsavel && <span>Professor: {viewingPlan.professorResponsavel}</span>}
                  {viewingPlan?.psicologoResponsavel && <span>Psicólogo: {viewingPlan.psicologoResponsavel}</span>}
                  {viewingPlan?.coordenadorResponsavel && <span>Coordenador: {viewingPlan.coordenadorResponsavel}</span>}
                </div>
              )}
              {/* Dates */}
              {(viewingPlan?.dataInicio || viewingPlan?.dataTermino || viewingPlan?.dataRevisao) && (
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {viewingPlan?.dataInicio && <span>Início: {new Date(viewingPlan.dataInicio).toLocaleDateString('pt-BR')}</span>}
                  {viewingPlan?.dataTermino && <span>Término: {new Date(viewingPlan.dataTermino).toLocaleDateString('pt-BR')}</span>}
                  {viewingPlan?.dataRevisao && <span>Revisão: {new Date(viewingPlan.dataRevisao).toLocaleDateString('pt-BR')}</span>}
                </div>
              )}
              {viewingPlan?.observacoes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Observações</p>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{viewingPlan.observacoes}</p>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => viewingPlan && handleGeneratePDF(viewingPlan)}
              disabled={generatingPdf}
            >
              {generatingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Gerar PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              {editingId ? 'Editar Plano de Ensino' : 'Novo Plano de Ensino'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6 pb-4">
              {/* Dados Gerais */}
              <FormSection icon={<BookOpen className="w-4 h-4" />} title="Dados Gerais">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="space-y-1 md:col-span-1">
                    <Label className="text-xs">
                      Título <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.titulo}
                      onChange={(e) => updateField('titulo', e.target.value)}
                      placeholder="Título do plano"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">
                      Aluno <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.studentId} onValueChange={(v) => updateField('studentId', v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {students.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.nomeCompleto}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Período</Label>
                    <Input
                      value={formData.periodo || ''}
                      onChange={(e) => updateField('periodo', e.target.value)}
                      placeholder="Ex: 1º Bimestre"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Ano Letivo</Label>
                    <Input
                      value={formData.anoLetivo || ''}
                      onChange={(e) => updateField('anoLetivo', e.target.value)}
                      placeholder="2025"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Status</Label>
                    <Select value={formData.status || 'Em elaboração'} onValueChange={(v) => updateField('status', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUS_PLANO_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </FormSection>

              {/* Objetivos */}
              <FormSection icon={<Target className="w-4 h-4" />} title="Objetivos">
                <div className="space-y-1">
                  <Label className="text-xs">Objetivo Geral</Label>
                  <Textarea
                    value={formData.objetivoGeral || ''}
                    onChange={(e) => updateField('objetivoGeral', e.target.value)}
                    placeholder="Descreva o objetivo geral do plano de ensino..."
                    rows={3}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Objetivos Específicos (um por linha)</Label>
                  <Textarea
                    value={formData.objetivosEspecificos || ''}
                    onChange={(e) => updateField('objetivosEspecificos', e.target.value)}
                    placeholder="Liste os objetivos específicos, um por linha..."
                    rows={4}
                  />
                </div>
              </FormSection>

              {/* Conteúdos e Metodologias */}
              <FormSection icon={<FileText className="w-4 h-4" />} title="Conteúdos e Metodologias">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Conteúdos</Label>
                    <Textarea
                      value={formData.conteudos || ''}
                      onChange={(e) => updateField('conteudos', e.target.value)}
                      placeholder="Descreva os conteúdos programáticos..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Metodologias</Label>
                    <Textarea
                      value={formData.metodologias || ''}
                      onChange={(e) => updateField('metodologias', e.target.value)}
                      placeholder="Descreva as metodologias utilizadas..."
                      rows={4}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Recursos Didáticos</Label>
                  <Textarea
                    value={formData.recursosDidaticos || ''}
                    onChange={(e) => updateField('recursosDidaticos', e.target.value)}
                    placeholder="Liste os recursos didáticos necessários..."
                    rows={3}
                  />
                </div>
              </FormSection>

              {/* Adaptações */}
              <FormSection icon={<GraduationCap className="w-4 h-4" />} title="Adaptações">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Adaptação Metodológica</Label>
                    <Textarea
                      value={formData.adaptacaoMetodologia || ''}
                      onChange={(e) => updateField('adaptacaoMetodologia', e.target.value)}
                      placeholder="Descreva as adaptações metodológicas..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Adaptação Avaliativa</Label>
                    <Textarea
                      value={formData.adaptacaoAvaliacao || ''}
                      onChange={(e) => updateField('adaptacaoAvaliacao', e.target.value)}
                      placeholder="Descreva as adaptações avaliativas..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Adaptação de Conteúdo</Label>
                    <Textarea
                      value={formData.adaptacaoConteudo || ''}
                      onChange={(e) => updateField('adaptacaoConteudo', e.target.value)}
                      placeholder="Descreva as adaptações de conteúdo..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Adaptação Temporal</Label>
                    <Textarea
                      value={formData.adaptacaoTemporal || ''}
                      onChange={(e) => updateField('adaptacaoTemporal', e.target.value)}
                      placeholder="Descreva as adaptações de tempo..."
                      rows={3}
                    />
                  </div>
                </div>
              </FormSection>

              {/* Avaliação */}
              <FormSection icon={<FileText className="w-4 h-4" />} title="Avaliação">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Critérios de Avaliação</Label>
                    <Textarea
                      value={formData.criteriosAvaliacao || ''}
                      onChange={(e) => updateField('criteriosAvaliacao', e.target.value)}
                      placeholder="Descreva os critérios de avaliação..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Instrumentos de Avaliação</Label>
                    <Textarea
                      value={formData.instrumentosAvaliacao || ''}
                      onChange={(e) => updateField('instrumentosAvaliacao', e.target.value)}
                      placeholder="Liste os instrumentos de avaliação..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Frequência Esperada</Label>
                  <Input
                    value={formData.frequenciaEsperada || ''}
                    onChange={(e) => updateField('frequenciaEsperada', e.target.value)}
                    placeholder="Ex: 75%, 80%"
                  />
                </div>
              </FormSection>

              {/* Responsáveis */}
              <FormSection icon={<GraduationCap className="w-4 h-4" />} title="Responsáveis">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Professor Responsável</Label>
                    <Input
                      value={formData.professorResponsavel || ''}
                      onChange={(e) => updateField('professorResponsavel', e.target.value)}
                      placeholder="Nome do professor"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Psicólogo Responsável</Label>
                    <Input
                      value={formData.psicologoResponsavel || ''}
                      onChange={(e) => updateField('psicologoResponsavel', e.target.value)}
                      placeholder="Nome do psicólogo"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Coordenador Responsável</Label>
                    <Input
                      value={formData.coordenadorResponsavel || ''}
                      onChange={(e) => updateField('coordenadorResponsavel', e.target.value)}
                      placeholder="Nome do coordenador"
                    />
                  </div>
                </div>
              </FormSection>

              {/* Pareceres */}
              <FormSection icon={<FileText className="w-4 h-4" />} title="Pareceres">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Parecer Pedagógico</Label>
                    <Textarea
                      value={formData.parecerPedagogico || ''}
                      onChange={(e) => updateField('parecerPedagogico', e.target.value)}
                      placeholder="Parecer pedagógico..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Parecer Psicológico</Label>
                    <Textarea
                      value={formData.parecerPsicologico || ''}
                      onChange={(e) => updateField('parecerPsicologico', e.target.value)}
                      placeholder="Parecer psicológico..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Parecer Familiar</Label>
                    <Textarea
                      value={formData.parecerFamiliar || ''}
                      onChange={(e) => updateField('parecerFamiliar', e.target.value)}
                      placeholder="Parecer da família..."
                      rows={3}
                    />
                  </div>
                </div>
              </FormSection>

              {/* Datas */}
              <FormSection icon={<FileText className="w-4 h-4" />} title="Datas">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Data Início</Label>
                    <Input
                      type="date"
                      value={formData.dataInicio || ''}
                      onChange={(e) => updateField('dataInicio', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Data Término</Label>
                    <Input
                      type="date"
                      value={formData.dataTermino || ''}
                      onChange={(e) => updateField('dataTermino', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Data Revisão</Label>
                    <Input
                      type="date"
                      value={formData.dataRevisao || ''}
                      onChange={(e) => updateField('dataRevisao', e.target.value)}
                    />
                  </div>
                </div>
              </FormSection>

              {/* Observações */}
              <FormSection icon={<FileText className="w-4 h-4" />} title="Observações">
                <div className="space-y-1">
                  <Textarea
                    value={formData.observacoes || ''}
                    onChange={(e) => updateField('observacoes', e.target.value)}
                    placeholder="Observações adicionais sobre o plano de ensino..."
                    rows={4}
                  />
                </div>
              </FormSection>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editingId ? 'Atualizar' : 'Criar'} Plano
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Confirmar Exclusão
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir este plano de ensino? Esta ação não pode ser desfeita.
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
