'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  fetchTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  fetchInstitutions,
} from '@/lib/api'
import type { Teacher, TeacherFormData, Institution } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  UF_LIST,
  COR_RACA_OPTIONS,
  SEXO_OPTIONS,
  NACIONALIDADE_OPTIONS,
  ESCOLARIDADE_OPTIONS,
  REGIME_JURIDICO_OPTIONS,
  CARGO_PROFESSOR_OPTIONS,
  ESTADO_CIVIL_OPTIONS,
  POS_GRADUACAO_OPTIONS,
} from '@/lib/constants'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  MapPin,
  Phone,
  GraduationCap,
  Loader2,
  User,
  Briefcase,
  Heart,
  FileText,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'

// ---- Helpers ----

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

function displayCpf(value: string | null): string {
  if (!value) return '—'
  const d = value.replace(/\D/g, '')
  if (d.length !== 11) return value
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

// ---- Form State ----

interface FormState {
  institutionId: string
  matricula: string
  nomeCompleto: string
  cpf: string
  rg: string
  orgaoEmissor: string
  dataNascimento: string
  sexo: string
  corRaca: string
  nacionalidade: string
  estadoCivil: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  municipio: string
  uf: string
  telefone: string
  celular: string
  email: string
  escolaridade: string
  cursoGraduacao: string
  instituicaoGraduacao: string
  anoConclusaoGrad: string
  posGraduacao: string
  areaPosGraduacao: string
  instituicaoPosGrad: string
  anoConclusaoPos: string
  cargo: string
  nivel: string
  regimeJuridico: string
  cargaHoraria: string
  dataAdmissao: string
  lotacao: string
  disciplinas: string
  series: string
  especializacaoInclusao: boolean
  especializacaoEspecial: boolean
  cursosCapacitacao: string
}

const EMPTY_FORM: FormState = {
  institutionId: '',
  matricula: '',
  nomeCompleto: '',
  cpf: '',
  rg: '',
  orgaoEmissor: '',
  dataNascimento: '',
  sexo: '',
  corRaca: '',
  nacionalidade: 'Brasileira',
  estadoCivil: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  municipio: '',
  uf: '',
  telefone: '',
  celular: '',
  email: '',
  escolaridade: '',
  cursoGraduacao: '',
  instituicaoGraduacao: '',
  anoConclusaoGrad: '',
  posGraduacao: '',
  areaPosGraduacao: '',
  instituicaoPosGrad: '',
  anoConclusaoPos: '',
  cargo: '',
  nivel: '',
  regimeJuridico: '',
  cargaHoraria: '',
  dataAdmissao: '',
  lotacao: '',
  disciplinas: '',
  series: '',
  especializacaoInclusao: false,
  especializacaoEspecial: false,
  cursosCapacitacao: '',
}

function teacherToForm(t: Teacher): FormState {
  return {
    institutionId: t.institutionId || '',
    matricula: t.matricula || '',
    nomeCompleto: t.nomeCompleto || '',
    cpf: t.cpf || '',
    rg: t.rg || '',
    orgaoEmissor: t.orgaoEmissor || '',
    dataNascimento: t.dataNascimento ? t.dataNascimento.split('T')[0] : '',
    sexo: t.sexo || '',
    corRaca: t.corRaca || '',
    nacionalidade: t.nacionalidade || 'Brasileira',
    estadoCivil: t.estadoCivil || '',
    cep: t.cep || '',
    logradouro: t.logradouro || '',
    numero: t.numero || '',
    complemento: t.complemento || '',
    bairro: t.bairro || '',
    municipio: t.municipio || '',
    uf: t.uf || '',
    telefone: t.telefone || '',
    celular: t.celular || '',
    email: t.email || '',
    escolaridade: t.escolaridade || '',
    cursoGraduacao: t.cursoGraduacao || '',
    instituicaoGraduacao: t.instituicaoGraduacao || '',
    anoConclusaoGrad: t.anoConclusaoGrad || '',
    posGraduacao: t.posGraduacao || '',
    areaPosGraduacao: t.areaPosGraduacao || '',
    instituicaoPosGrad: t.instituicaoPosGrad || '',
    anoConclusaoPos: t.anoConclusaoPos || '',
    cargo: t.cargo || '',
    nivel: t.nivel || '',
    regimeJuridico: t.regimeJuridico || '',
    cargaHoraria: t.cargaHoraria || '',
    dataAdmissao: t.dataAdmissao ? t.dataAdmissao.split('T')[0] : '',
    lotacao: t.lotacao || '',
    disciplinas: t.disciplinas || '',
    series: t.series || '',
    especializacaoInclusao: t.especializacaoInclusao ?? false,
    especializacaoEspecial: t.especializacaoEspecial ?? false,
    cursosCapacitacao: t.cursosCapacitacao || '',
  }
}

function formToFormData(form: FormState): TeacherFormData {
  return {
    institutionId: form.institutionId,
    matricula: form.matricula || undefined,
    nomeCompleto: form.nomeCompleto,
    cpf: form.cpf.replace(/\D/g, '') || undefined,
    rg: form.rg || undefined,
    orgaoEmissor: form.orgaoEmissor || undefined,
    dataNascimento: form.dataNascimento || undefined,
    sexo: form.sexo || undefined,
    corRaca: form.corRaca || undefined,
    nacionalidade: form.nacionalidade || undefined,
    estadoCivil: form.estadoCivil || undefined,
    cep: form.cep.replace(/\D/g, '') || undefined,
    logradouro: form.logradouro || undefined,
    numero: form.numero || undefined,
    complemento: form.complemento || undefined,
    bairro: form.bairro || undefined,
    municipio: form.municipio || undefined,
    uf: form.uf || undefined,
    telefone: form.telefone || undefined,
    celular: form.celular || undefined,
    email: form.email || undefined,
    escolaridade: form.escolaridade || undefined,
    cursoGraduacao: form.cursoGraduacao || undefined,
    instituicaoGraduacao: form.instituicaoGraduacao || undefined,
    anoConclusaoGrad: form.anoConclusaoGrad || undefined,
    posGraduacao: form.posGraduacao || undefined,
    areaPosGraduacao: form.areaPosGraduacao || undefined,
    instituicaoPosGrad: form.instituicaoPosGrad || undefined,
    anoConclusaoPos: form.anoConclusaoPos || undefined,
    cargo: form.cargo || undefined,
    nivel: form.nivel || undefined,
    regimeJuridico: form.regimeJuridico || undefined,
    cargaHoraria: form.cargaHoraria || undefined,
    dataAdmissao: form.dataAdmissao || undefined,
    lotacao: form.lotacao || undefined,
    disciplinas: form.disciplinas || undefined,
    series: form.series || undefined,
    especializacaoInclusao: form.especializacaoInclusao,
    especializacaoEspecial: form.especializacaoEspecial,
    cursosCapacitacao: form.cursosCapacitacao || undefined,
  }
}

// ---- Toggle Row ----

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-foreground/80">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

// ---- Form Section Wrapper ----

function FormSection({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
        <Icon className="w-4 h-4" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <Separator className="bg-emerald-200/50 dark:bg-emerald-800/30" />
      <div className="space-y-4">{children}</div>
    </div>
  )
}

// ---- Field Helper ----

function FieldGroup({
  label,
  required,
  children,
  className,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  )
}

// ---- Main Component ----

export default function TeachersModule() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [institutionFilter, setInstitutionFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Fetch teachers
  const loadTeachers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchTeachers({
        search: search || undefined,
        institutionId: institutionFilter || undefined,
      })
      setTeachers(data)
    } catch {
      toast.error('Erro ao carregar professores')
    } finally {
      setLoading(false)
    }
  }, [search, institutionFilter])

  // Fetch institutions for filter and form
  const loadInstitutions = useCallback(async () => {
    try {
      const data = await fetchInstitutions()
      setInstitutions(data)
    } catch {
      // silent - not critical
    }
  }, [])

  useEffect(() => {
    loadInstitutions()
  }, [loadInstitutions])

  useEffect(() => {
    loadTeachers()
  }, [loadTeachers])

  // Form helpers
  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // Open dialog for new
  const handleNew = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setDialogOpen(true)
  }

  // Open dialog for edit
  const handleEdit = (teacher: Teacher) => {
    setForm(teacherToForm(teacher))
    setEditingId(teacher.id)
    setDialogOpen(true)
  }

  // Save (create or update)
  const handleSave = async () => {
    if (!form.nomeCompleto.trim()) {
      toast.error('Nome Completo é obrigatório')
      return
    }
    if (!form.institutionId) {
      toast.error('Instituição é obrigatória')
      return
    }

    setSaving(true)
    try {
      const data = formToFormData(form)
      if (editingId) {
        await updateTeacher(editingId, data)
        toast.success('Professor atualizado com sucesso!')
      } else {
        await createTeacher(data)
        toast.success('Professor cadastrado com sucesso!')
      }
      setDialogOpen(false)
      loadTeachers()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar professor'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await deleteTeacher(id)
      toast.success('Professor removido com sucesso!')
      setDeleteConfirm(null)
      loadTeachers()
    } catch {
      toast.error('Erro ao remover professor')
    }
  }

  // Parse disciplinas for display
  const getDisciplinasList = (disciplinas: string | null): string[] => {
    if (!disciplinas) return []
    try {
      const parsed = JSON.parse(disciplinas)
      if (Array.isArray(parsed)) return parsed
    } catch {
      // treat as newline-separated text
    }
    return disciplinas.split('\n').map((s) => s.trim()).filter(Boolean)
  }

  const getInstitutionName = (teacher: Teacher): string => {
    if (teacher.institution && typeof teacher.institution === 'object') {
      return teacher.institution.nomeFantasia || '—'
    }
    const inst = institutions.find((i) => i.id === teacher.institutionId)
    return inst?.nomeFantasia || '—'
  }

  // ---- Render ----

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Professores
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie o cadastro de professores e seus dados funcionais
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Professor
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF, matrícula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={institutionFilter}
          onValueChange={(v) => setInstitutionFilter(v === '__all__' ? '' : v)}
        >
          <SelectTrigger className="w-full sm:w-[260px]">
            <SelectValue placeholder="Todas as Instituições" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas as Instituições</SelectItem>
            {institutions.map((inst) => (
              <SelectItem key={inst.id} value={inst.id}>
                {inst.nomeFantasia}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="ml-3 text-muted-foreground">Carregando professores...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && teachers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Nenhum professor encontrado</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {search || institutionFilter
              ? 'Tente ajustar os filtros da busca.'
              : 'Comece cadastrando o primeiro professor.'}
          </p>
          {!search && !institutionFilter && (
            <Button
              onClick={handleNew}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Professor
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && teachers.length > 0 && (
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-xs font-semibold">Nome</TableHead>
                  <TableHead className="text-xs font-semibold">CPF</TableHead>
                  <TableHead className="text-xs font-semibold hidden md:table-cell">Cargo</TableHead>
                  <TableHead className="text-xs font-semibold hidden lg:table-cell">Escolaridade</TableHead>
                  <TableHead className="text-xs font-semibold hidden sm:table-cell">Instituição</TableHead>
                  <TableHead className="text-xs font-semibold hidden xl:table-cell">Disciplinas</TableHead>
                  <TableHead className="text-xs font-semibold text-right w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => {
                  const disciplinasList = getDisciplinasList(teacher.disciplinas)
                  return (
                    <TableRow
                      key={teacher.id}
                      className="hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 cursor-pointer"
                      onClick={() => handleEdit(teacher)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {teacher.nomeCompleto}
                            </p>
                            {teacher.matricula && (
                              <p className="text-[11px] text-muted-foreground">
                                Mat: {teacher.matricula}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {displayCpf(teacher.cpf)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {teacher.cargo ? (
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50"
                          >
                            {teacher.cargo}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {teacher.escolaridade || '—'}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground max-w-[180px] truncate">
                        {getInstitutionName(teacher)}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {disciplinasList.length > 0 ? (
                            disciplinasList.slice(0, 3).map((d, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-[9px] px-1.5 py-0 h-4"
                              >
                                {d}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                          {disciplinasList.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-[9px] px-1.5 py-0 h-4 text-emerald-600"
                            >
                              +{disciplinasList.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-emerald-600"
                            onClick={() => handleEdit(teacher)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-red-600"
                            onClick={() => setDeleteConfirm(teacher.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este professor? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Remover
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              {editingId ? 'Editar Professor' : 'Novo Professor'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Atualize os dados do professor.'
                : 'Preencha os dados para cadastrar um novo professor.'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-8rem)]">
            <div className="px-6 py-4 space-y-8">
              {/* Section 1: Dados Pessoais */}
              <FormSection title="Dados Pessoais" icon={User}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FieldGroup label="Nome Completo" required className="sm:col-span-2">
                    <Input
                      placeholder="Nome completo do professor"
                      value={form.nomeCompleto}
                      onChange={(e) => updateField('nomeCompleto', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Instituição" required className="sm:col-span-2 lg:col-span-1">
                    <Select
                      value={form.institutionId}
                      onValueChange={(v) => updateField('institutionId', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a instituição" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions.map((inst) => (
                          <SelectItem key={inst.id} value={inst.id}>
                            {inst.nomeFantasia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                  <FieldGroup label="CPF">
                    <Input
                      placeholder="000.000.000-00"
                      value={form.cpf}
                      onChange={(e) => updateField('cpf', formatCpf(e.target.value))}
                    />
                  </FieldGroup>
                  <FieldGroup label="RG">
                    <Input
                      placeholder="Número do RG"
                      value={form.rg}
                      onChange={(e) => updateField('rg', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Órgão Emissor">
                    <Input
                      placeholder="Ex: SSP"
                      value={form.orgaoEmissor}
                      onChange={(e) => updateField('orgaoEmissor', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Data de Nascimento">
                    <Input
                      type="date"
                      value={form.dataNascimento}
                      onChange={(e) => updateField('dataNascimento', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Sexo">
                    <Select
                      value={form.sexo}
                      onValueChange={(v) => updateField('sexo', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEXO_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                  <FieldGroup label="Cor/Raça">
                    <Select
                      value={form.corRaca}
                      onValueChange={(v) => updateField('corRaca', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {COR_RACA_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                  <FieldGroup label="Nacionalidade">
                    <Select
                      value={form.nacionalidade}
                      onValueChange={(v) => updateField('nacionalidade', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {NACIONALIDADE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                  <FieldGroup label="Estado Civil">
                    <Select
                      value={form.estadoCivil}
                      onValueChange={(v) => updateField('estadoCivil', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTADO_CIVIL_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                </div>
              </FormSection>

              {/* Section 2: Endereço */}
              <FormSection title="Endereço" icon={MapPin}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FieldGroup label="CEP">
                    <Input
                      placeholder="00000-000"
                      value={form.cep}
                      onChange={(e) => updateField('cep', formatCep(e.target.value))}
                    />
                  </FieldGroup>
                  <FieldGroup label="Logradouro" className="sm:col-span-2">
                    <Input
                      placeholder="Rua, Avenida..."
                      value={form.logradouro}
                      onChange={(e) => updateField('logradouro', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Número">
                    <Input
                      placeholder="Nº"
                      value={form.numero}
                      onChange={(e) => updateField('numero', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Complemento">
                    <Input
                      placeholder="Complemento"
                      value={form.complemento}
                      onChange={(e) => updateField('complemento', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Bairro">
                    <Input
                      placeholder="Bairro"
                      value={form.bairro}
                      onChange={(e) => updateField('bairro', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Município" className="sm:col-span-2">
                    <Input
                      placeholder="Cidade"
                      value={form.municipio}
                      onChange={(e) => updateField('municipio', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="UF">
                    <Select
                      value={form.uf}
                      onValueChange={(v) => updateField('uf', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        {UF_LIST.map((uf) => (
                          <SelectItem key={uf.value} value={uf.value}>
                            {uf.value} - {uf.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                </div>
              </FormSection>

              {/* Section 3: Contato */}
              <FormSection title="Contato" icon={Phone}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup label="Telefone">
                    <Input
                      placeholder="(00) 0000-0000"
                      value={form.telefone}
                      onChange={(e) => updateField('telefone', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Celular">
                    <Input
                      placeholder="(00) 00000-0000"
                      value={form.celular}
                      onChange={(e) => updateField('celular', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Email" className="sm:col-span-2">
                    <Input
                      type="email"
                      placeholder="email@exemplo.com"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                    />
                  </FieldGroup>
                </div>
              </FormSection>

              {/* Section 4: Formação Acadêmica */}
              <FormSection title="Formação Acadêmica" icon={GraduationCap}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FieldGroup label="Escolaridade">
                    <Select
                      value={form.escolaridade}
                      onValueChange={(v) => updateField('escolaridade', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {ESCOLARIDADE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                  <FieldGroup label="Curso de Graduação" className="sm:col-span-2 lg:col-span-1">
                    <Input
                      placeholder="Ex: Pedagogia, Matemática..."
                      value={form.cursoGraduacao}
                      onChange={(e) => updateField('cursoGraduacao', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Instituição" className="sm:col-span-2 lg:col-span-1">
                    <Input
                      placeholder="Instituição de graduação"
                      value={form.instituicaoGraduacao}
                      onChange={(e) => updateField('instituicaoGraduacao', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Ano Conclusão">
                    <Input
                      placeholder="Ex: 2015"
                      value={form.anoConclusaoGrad}
                      onChange={(e) => updateField('anoConclusaoGrad', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Pós-Graduação">
                    <Select
                      value={form.posGraduacao}
                      onValueChange={(v) => updateField('posGraduacao', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {POS_GRADUACAO_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                  <FieldGroup label="Área da Pós-Graduação">
                    <Input
                      placeholder="Área de especialização"
                      value={form.areaPosGraduacao}
                      onChange={(e) => updateField('areaPosGraduacao', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Instituição Pós">
                    <Input
                      placeholder="Instituição da pós-graduação"
                      value={form.instituicaoPosGrad}
                      onChange={(e) => updateField('instituicaoPosGrad', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Ano Conclusão Pós">
                    <Input
                      placeholder="Ex: 2018"
                      value={form.anoConclusaoPos}
                      onChange={(e) => updateField('anoConclusaoPos', e.target.value)}
                    />
                  </FieldGroup>
                </div>
              </FormSection>

              {/* Section 5: Dados Funcionais */}
              <FormSection title="Dados Funcionais" icon={Briefcase}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FieldGroup label="Cargo">
                    <Select
                      value={form.cargo}
                      onValueChange={(v) => updateField('cargo', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {CARGO_PROFESSOR_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                  <FieldGroup label="Nível">
                    <Input
                      placeholder="Ex: I, II, III"
                      value={form.nivel}
                      onChange={(e) => updateField('nivel', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Regime Jurídico">
                    <Select
                      value={form.regimeJuridico}
                      onValueChange={(v) => updateField('regimeJuridico', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIME_JURIDICO_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                  <FieldGroup label="Carga Horária">
                    <Input
                      placeholder="Ex: 40h, 20h"
                      value={form.cargaHoraria}
                      onChange={(e) => updateField('cargaHoraria', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Data de Admissão">
                    <Input
                      type="date"
                      value={form.dataAdmissao}
                      onChange={(e) => updateField('dataAdmissao', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Lotação">
                    <Input
                      placeholder="Local de lotação"
                      value={form.lotacao}
                      onChange={(e) => updateField('lotacao', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Matrícula">
                    <Input
                      placeholder="Número de matrícula"
                      value={form.matricula}
                      onChange={(e) => updateField('matricula', e.target.value)}
                    />
                  </FieldGroup>
                </div>
              </FormSection>

              {/* Section 6: Disciplinas & Especialização */}
              <FormSection title="Disciplinas & Especialização" icon={FileText}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup label="Disciplinas" className="sm:col-span-2">
                    <Textarea
                      placeholder="Uma disciplina por linha. Ex:&#10;Matemática&#10;Português&#10;Ciências"
                      value={form.disciplinas}
                      onChange={(e) => updateField('disciplinas', e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-[11px] text-muted-foreground">Informe uma disciplina por linha</p>
                  </FieldGroup>
                  <FieldGroup label="Séries" className="sm:col-span-2">
                    <Textarea
                      placeholder="Uma série por linha. Ex:&#10;1º ano&#10;2º ano&#10;3º ano"
                      value={form.series}
                      onChange={(e) => updateField('series', e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-[11px] text-muted-foreground">Informe uma série por linha</p>
                  </FieldGroup>
                </div>

                <div className="space-y-1 mt-4 p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                  <ToggleRow
                    label="Especialização em Inclusão Escolar"
                    checked={form.especializacaoInclusao}
                    onChange={(v) => updateField('especializacaoInclusao', v)}
                  />
                  <ToggleRow
                    label="Especialização em Educação Especial"
                    checked={form.especializacaoEspecial}
                    onChange={(v) => updateField('especializacaoEspecial', v)}
                  />
                </div>

                <div className="mt-4">
                  <FieldGroup label="Cursos de Capacitação">
                    <Textarea
                      placeholder="Um curso por linha. Ex:&#10;Formação em Educação Inclusiva - 2022&#10;Curso de Libras - 2023"
                      value={form.cursosCapacitacao}
                      onChange={(e) => updateField('cursosCapacitacao', e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-[11px] text-muted-foreground">Informe um curso por linha</p>
                  </FieldGroup>
                </div>
              </FormSection>
            </div>
          </ScrollArea>

          {/* Dialog Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingId ? 'Salvar Alterações' : 'Cadastrar Professor'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
