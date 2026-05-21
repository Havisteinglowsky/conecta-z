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
  FileText,
  Plus,
  Search,
  Filter,
  Save,
  Trash2,
  Edit,
  Clock,
  Eye,
  Download,
  Loader2,
  History,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  fetchStudents,
  fetchPsychologists,
  fetchReports,
  createReport,
  updateReport,
  deleteReport,
  generatePDFReport,
} from '@/lib/api'
import type { Student, Psychologist, Report, CognitiveProfile } from '@/lib/types'
import {
  TIPO_RELATORIO_OPTIONS,
  STATUS_RELATORIO_OPTIONS,
  TIPO_RELATORIO_PDF_OPTIONS,
} from '@/lib/constants'

// ─── Badge helpers ──────────────────────────────────────────────────────────────
const extendedTipoRelatorio = [
  ...TIPO_RELATORIO_OPTIONS,
  { value: 'Desempenho Escolar', label: 'Desempenho Escolar' },
  { value: 'Evolução de Aprendizado', label: 'Evolução de Aprendizado' },
]

function getReportStatusBadge(status: string | null) {
  if (!status) return <Badge variant="secondary">—</Badge>
  const map: Record<string, string> = {
    Rascunho: 'bg-gray-100 text-gray-700 border-gray-200',
    Revisão: 'bg-amber-100 text-amber-700 border-amber-200',
    Finalizado: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  }
  return <Badge className={map[status] || 'bg-gray-100 text-gray-700'}>{status}</Badge>
}

function getTipoRelatorioBadge(tipo: string) {
  const map: Record<string, string> = {
    Pedagógico: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Psicológico: 'bg-teal-100 text-teal-700 border-teal-200',
    Multidisciplinar: 'bg-orange-100 text-orange-700 border-orange-200',
    Governamental: 'bg-purple-100 text-purple-700 border-purple-200',
    Familiar: 'bg-pink-100 text-pink-700 border-pink-200',
    'Desempenho Escolar': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    'Evolução de Aprendizado': 'bg-lime-100 text-lime-700 border-lime-200',
  }
  return <Badge className={map[tipo] || 'bg-gray-100 text-gray-700'}>{tipo}</Badge>
}

// ─── Form data interface ────────────────────────────────────────────────────────
interface FormData {
  studentId: string
  psychologistId: string
  tipo: string
  titulo: string
  conteudo: string
  periodo: string
  dataEmissao: string
  geradoPor: string
  revisadoPor: string
  status: string
}

const defaultFormData: FormData = {
  studentId: '',
  psychologistId: '',
  tipo: '',
  titulo: '',
  conteudo: '',
  periodo: '',
  dataEmissao: new Date().toISOString().split('T')[0],
  geradoPor: '',
  revisadoPor: '',
  status: 'Rascunho',
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ReportsModule() {
  const [reports, setReports] = useState<Report[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [psychologists, setPsychologists] = useState<Psychologist[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [viewingReport, setViewingReport] = useState<Report | null>(null)

  // Filters
  const [filterStudentId, setFilterStudentId] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // PDF generation
  const [showPdfDialog, setShowPdfDialog] = useState(false)
  const [pdfStudentId, setPdfStudentId] = useState('')
  const [pdfTipo, setPdfTipo] = useState('')
  const [generatingPdf, setGeneratingPdf] = useState(false)

  // History viewer
  const [showHistory, setShowHistory] = useState(false)
  const [historyStudentId, setHistoryStudentId] = useState('')
  const [historyReports, setHistoryReports] = useState<Report[]>([])
  const [historyProfiles, setHistoryProfiles] = useState<CognitiveProfile[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  // ─── Load data ──────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [reportsData, studentsData, psychologistsData] = await Promise.all([
        fetchReports({
          studentId: filterStudentId || undefined,
          tipo: filterTipo || undefined,
          status: filterStatus || undefined,
        }),
        fetchStudents(),
        fetchPsychologists(),
      ])
      setReports(reportsData)
      setStudents(studentsData)
      setPsychologists(psychologistsData)
    } catch {
      toast.error('Erro ao carregar relatórios')
    } finally {
      setLoading(false)
    }
  }, [filterStudentId, filterTipo, filterStatus])

  useEffect(() => {
    loadData()
  }, [loadData])

  // ─── Form handlers ──────────────────────────────────────────────────────────
  function handleNew() {
    setFormData({ ...defaultFormData, dataEmissao: new Date().toISOString().split('T')[0] })
    setEditingId(null)
    setShowForm(true)
  }

  function handleEdit(report: Report) {
    setFormData({
      studentId: report.studentId || '',
      psychologistId: report.psychologistId || '',
      tipo: report.tipo,
      titulo: report.titulo,
      conteudo: report.conteudo,
      periodo: report.periodo || '',
      dataEmissao: report.dataEmissao?.split('T')[0] || new Date().toISOString().split('T')[0],
      geradoPor: report.geradoPor || '',
      revisadoPor: report.revisadoPor || '',
      status: report.status || 'Rascunho',
    })
    setEditingId(report.id)
    setShowForm(true)
  }

  async function handleSave() {
    if (!formData.tipo) {
      toast.error('Selecione o tipo de relatório')
      return
    }
    if (!formData.titulo.trim()) {
      toast.error('Informe o título')
      return
    }
    if (!formData.conteudo.trim()) {
      toast.error('Informe o conteúdo')
      return
    }
    setSaving(true)
    try {
      const payload = {
        studentId: formData.studentId || undefined,
        psychologistId: formData.psychologistId || undefined,
        tipo: formData.tipo,
        titulo: formData.titulo,
        conteudo: formData.conteudo,
        periodo: formData.periodo || undefined,
        dataEmissao: formData.dataEmissao || undefined,
        geradoPor: formData.geradoPor || undefined,
        revisadoPor: formData.revisadoPor || undefined,
        status: formData.status || 'Rascunho',
      }
      if (editingId) {
        await updateReport(editingId, payload)
        toast.success('Relatório atualizado com sucesso!')
      } else {
        await createReport(payload)
        toast.success('Relatório criado com sucesso!')
      }
      setShowForm(false)
      loadData()
    } catch {
      toast.error('Erro ao salvar relatório')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deletingId) return
    try {
      await deleteReport(deletingId)
      toast.success('Relatório excluído com sucesso!')
      setShowDeleteDialog(false)
      setDeletingId(null)
      loadData()
    } catch {
      toast.error('Erro ao excluir relatório')
    }
  }

  // ─── PDF Generation ─────────────────────────────────────────────────────────
  async function handleGeneratePDF(studentId: string, tipo: string) {
    setGeneratingPdf(true)
    try {
      const result = await generatePDFReport({ studentId, tipo })
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

  async function handlePdfDialogGenerate() {
    if (!pdfStudentId || !pdfTipo) {
      toast.error('Selecione o aluno e o tipo de relatório')
      return
    }
    await handleGeneratePDF(pdfStudentId, pdfTipo)
    setShowPdfDialog(false)
    setPdfStudentId('')
    setPdfTipo('')
  }

  // ─── History Viewer ─────────────────────────────────────────────────────────
  async function handleViewHistory(studentId: string) {
    setHistoryStudentId(studentId)
    setShowHistory(true)
    setHistoryLoading(true)
    try {
      const [reportsData] = await Promise.all([
        fetchReports({ studentId }),
      ])
      setHistoryReports(reportsData)
      setHistoryProfiles([])
    } catch {
      toast.error('Erro ao carregar histórico')
    } finally {
      setHistoryLoading(false)
    }
  }

  // ─── Client-side search filter ──────────────────────────────────────────────
  const filteredReports = searchQuery
    ? reports.filter(
        (r) =>
          r.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.conteudo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.student?.nomeCompleto || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : reports

  // ─── Student name lookup ────────────────────────────────────────────────────
  const getStudentName = (id: string | null) =>
    students.find((s) => s.id === id)?.nomeCompleto || '—'

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Relatórios</h2>
            <p className="text-sm text-muted-foreground">
              Relatórios pedagógicos, psicológicos e multidisciplinares
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowPdfDialog(true)}
            variant="outline"
            className="gap-2 border-teal-200 text-teal-700 hover:bg-teal-50"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Gerar PDF Avançado</span>
            <span className="sm:hidden">PDF</span>
          </Button>
          <Button
            onClick={handleNew}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Relatório
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
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
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todos os tipos</SelectItem>
                {extendedTipoRelatorio.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
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
                {STATUS_RELATORIO_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Nenhum relatório encontrado</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead className="hidden md:table-cell">Aluno</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Data</TableHead>
                    <TableHead className="w-[140px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <p className="font-medium text-sm">{report.titulo}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-48">
                          {report.conteudo.substring(0, 80)}...
                        </p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {report.student?.nomeCompleto || '—'}
                      </TableCell>
                      <TableCell>{getTipoRelatorioBadge(report.tipo)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {getReportStatusBadge(report.status)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                        {report.dataEmissao
                          ? new Date(report.dataEmissao).toLocaleDateString('pt-BR')
                          : new Date(report.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setViewingReport(report)}
                            title="Visualizar"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          {report.studentId && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              onClick={() => handleGeneratePDF(report.studentId!, report.tipo)}
                              disabled={generatingPdf}
                              title="Gerar PDF"
                            >
                              {generatingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                            </Button>
                          )}
                          {report.studentId && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                              onClick={() => handleViewHistory(report.studentId!)}
                              title="Ver Histórico"
                            >
                              <History className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleEdit(report)}
                            title="Editar"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-700"
                            onClick={() => {
                              setDeletingId(report.id)
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

      {/* View Report Dialog */}
      <Dialog open={!!viewingReport} onOpenChange={() => setViewingReport(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              {viewingReport?.titulo}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {viewingReport?.tipo && getTipoRelatorioBadge(viewingReport.tipo)}
              {getReportStatusBadge(viewingReport?.status || null)}
              {viewingReport?.student?.nomeCompleto && (
                <Badge variant="outline">
                  Aluno: {viewingReport.student.nomeCompleto}
                </Badge>
              )}
              {viewingReport?.psychologist?.nomeCompleto && (
                <Badge variant="outline">
                  Psicólogo: {viewingReport.psychologist.nomeCompleto}
                </Badge>
              )}
            </div>
            <Separator />
            <ScrollArea className="max-h-[50vh]">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {viewingReport?.conteudo}
              </div>
            </ScrollArea>
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-muted-foreground">
              {viewingReport?.periodo && (
                <div>
                  <span className="font-medium">Período:</span> {viewingReport.periodo}
                </div>
              )}
              {viewingReport?.dataEmissao && (
                <div>
                  <span className="font-medium">Emissão:</span>{' '}
                  {new Date(viewingReport.dataEmissao).toLocaleDateString('pt-BR')}
                </div>
              )}
              {viewingReport?.geradoPor && (
                <div>
                  <span className="font-medium">Gerado por:</span> {viewingReport.geradoPor}
                </div>
              )}
              {viewingReport?.revisadoPor && (
                <div>
                  <span className="font-medium">Revisado por:</span> {viewingReport.revisadoPor}
                </div>
              )}
            </div>
            {viewingReport?.studentId && (
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleGeneratePDF(viewingReport.studentId!, viewingReport.tipo)}
                  disabled={generatingPdf}
                >
                  {generatingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Gerar PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => { handleViewHistory(viewingReport.studentId!); setViewingReport(null) }}
                >
                  <History className="w-4 h-4" />
                  Ver Histórico
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              {editingId ? 'Editar Relatório' : 'Novo Relatório'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-4 pb-4">
              {/* Student + Psychologist + Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Aluno</Label>
                  <Select
                    value={formData.studentId}
                    onValueChange={(v) => setFormData((p) => ({ ...p, studentId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.nomeCompleto}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Psicólogo</Label>
                  <Select
                    value={formData.psychologistId}
                    onValueChange={(v) => setFormData((p) => ({ ...p, psychologistId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {psychologists.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nomeCompleto} {p.crp ? `(${p.crp})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    Tipo <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(v) => setFormData((p) => ({ ...p, tipo: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {extendedTipoRelatorio.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <Label className="text-xs">
                  Título <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.titulo}
                  onChange={(e) => setFormData((p) => ({ ...p, titulo: e.target.value }))}
                  placeholder="Título do relatório"
                />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <Label className="text-xs">
                  Conteúdo <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={formData.conteudo}
                  onChange={(e) => setFormData((p) => ({ ...p, conteudo: e.target.value }))}
                  placeholder="Escreva o conteúdo completo do relatório..."
                  rows={10}
                />
              </div>

              <Separator />

              {/* Period + Date + Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Período</Label>
                  <Input
                    value={formData.periodo}
                    onChange={(e) => setFormData((p) => ({ ...p, periodo: e.target.value }))}
                    placeholder="Ex: 2025/Q1, Mar/2025"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Data Emissão
                  </Label>
                  <Input
                    type="date"
                    value={formData.dataEmissao}
                    onChange={(e) => setFormData((p) => ({ ...p, dataEmissao: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData((p) => ({ ...p, status: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_RELATORIO_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Generated By + Reviewed By */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Gerado Por</Label>
                  <Input
                    value={formData.geradoPor}
                    onChange={(e) => setFormData((p) => ({ ...p, geradoPor: e.target.value }))}
                    placeholder="Nome de quem gerou"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Revisado Por</Label>
                  <Input
                    value={formData.revisadoPor}
                    onChange={(e) => setFormData((p) => ({ ...p, revisadoPor: e.target.value }))}
                    placeholder="Nome de quem revisou"
                  />
                </div>
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {editingId ? 'Atualizar' : 'Criar'} Relatório
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Generation Dialog */}
      <Dialog open={showPdfDialog} onOpenChange={setShowPdfDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-600" />
              Gerar PDF Avançado
            </DialogTitle>
            <DialogDescription>
              Selecione o aluno e o tipo de relatório para gerar o PDF
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Aluno <span className="text-red-500">*</span>
              </Label>
              <Select value={pdfStudentId} onValueChange={setPdfStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o aluno" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nomeCompleto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Tipo de Relatório <span className="text-red-500">*</span>
              </Label>
              <Select value={pdfTipo} onValueChange={setPdfTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPO_RELATORIO_PDF_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPdfDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handlePdfDialogGenerate}
              disabled={generatingPdf || !pdfStudentId || !pdfTipo}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white gap-2"
            >
              {generatingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Gerar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Viewer Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-600" />
              Histórico — {getStudentName(historyStudentId)}
            </DialogTitle>
            <DialogDescription>
              Todos os relatórios e perfis cognitivos do aluno
            </DialogDescription>
          </DialogHeader>
          {historyLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 pb-4">
                {/* Reports Timeline */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Relatórios ({historyReports.length})
                  </h3>
                  {historyReports.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum relatório encontrado para este aluno
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {historyReports.map((report, idx) => (
                        <div key={report.id} className="relative pl-6 pb-3">
                          {/* Timeline line */}
                          {idx < historyReports.length - 1 && (
                            <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-emerald-200" />
                          )}
                          {/* Timeline dot */}
                          <div className="absolute left-0.5 top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                          <Card className="border-0 shadow-sm ml-2">
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {getTipoRelatorioBadge(report.tipo)}
                                    {getReportStatusBadge(report.status)}
                                  </div>
                                  <p className="font-medium text-sm">{report.titulo}</p>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                    {report.conteudo.substring(0, 150)}...
                                  </p>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => { setViewingReport(report); setShowHistory(false) }}
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </Button>
                                  {report.studentId && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-emerald-600"
                                      onClick={() => handleGeneratePDF(report.studentId!, report.tipo)}
                                      disabled={generatingPdf}
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-2">
                                {report.dataEmissao
                                  ? new Date(report.dataEmissao).toLocaleDateString('pt-BR')
                                  : new Date(report.createdAt).toLocaleDateString('pt-BR')}
                                {report.psychologist?.nomeCompleto && ` — ${report.psychologist.nomeCompleto}`}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cognitive Profiles Timeline */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Perfis Cognitivos ({historyProfiles.length})
                  </h3>
                  {historyProfiles.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum perfil cognitivo encontrado para este aluno
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {historyProfiles.map((profile) => (
                        <Card key={profile.id} className="border-0 shadow-sm">
                          <CardContent className="p-3 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">
                                {profile.nivelEvolucao || 'Sem nível definido'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {profile.dataAvaliacao
                                  ? new Date(profile.dataAvaliacao).toLocaleDateString('pt-BR')
                                  : 'Sem data'}
                                {profile.avaliador && ` — ${profile.avaliador}`}
                              </p>
                            </div>
                            <Badge variant="outline">{profile.estadoEmocional || '—'}</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
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
            Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.
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
