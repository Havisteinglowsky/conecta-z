'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  fetchPsychologists,
  createPsychologist,
  updatePsychologist,
  deletePsychologist,
  fetchInstitutions,
} from '@/lib/api'
import type { Psychologist, PsychologistFormData, Institution } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  UF_LIST,
  SEXO_OPTIONS,
  NACIONALIDADE_OPTIONS,
  ESCOLARIDADE_OPTIONS,
  REGIME_JURIDICO_OPTIONS,
  AREA_ESPECIALIZACAO_PSICOLOGO_OPTIONS,
  ABORDAGEM_TERAPEUTICA_OPTIONS,
  CARGO_PROFESSOR_OPTIONS,
  POS_GRADUACAO_OPTIONS,
} from '@/lib/constants'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
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
  Search,
  Plus,
  Pencil,
  Trash2,
  Stethoscope,
  Phone,
  Building2,
  Loader2,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Mail,
  Clock,
  ShieldCheck,
  Brain,
  Heart,
} from 'lucide-react'
import { toast } from 'sonner'

// ---- Default Form State ----

interface FormState {
  institutionId: string
  nomeCompleto: string
  cpf: string
  rg: string
  dataNascimento: string
  sexo: string
  nacionalidade: string
  telefone: string
  celular: string
  email: string
  crp: string
  crpUf: string
  escolaridade: string
  cursoGraduacao: string
  instituicaoGraduacao: string
  anoConclusao: string
  posGraduacao: string
  areaEspecializacao: string
  abordagemTerapeutica: string
  cargo: string
  regimeJuridico: string
  cargaHoraria: string
  dataAdmissao: string
  supervisorNome: string
  supervisorCrp: string
  horarioAtendimento: string
  experienciaInclusao: boolean
  experienciaNeurodiv: boolean
  capacitacaoLaee: boolean
}

const EMPTY_FORM: FormState = {
  institutionId: '',
  nomeCompleto: '',
  cpf: '',
  rg: '',
  dataNascimento: '',
  sexo: '',
  nacionalidade: 'Brasileira',
  telefone: '',
  celular: '',
  email: '',
  crp: '',
  crpUf: '',
  escolaridade: '',
  cursoGraduacao: '',
  instituicaoGraduacao: '',
  anoConclusao: '',
  posGraduacao: '',
  areaEspecializacao: '',
  abordagemTerapeutica: '',
  cargo: '',
  regimeJuridico: '',
  cargaHoraria: '',
  dataAdmissao: '',
  supervisorNome: '',
  supervisorCrp: '',
  horarioAtendimento: '',
  experienciaInclusao: false,
  experienciaNeurodiv: false,
  capacitacaoLaee: false,
}

function psychologistToForm(p: Psychologist): FormState {
  return {
    institutionId: p.institutionId || '',
    nomeCompleto: p.nomeCompleto || '',
    cpf: p.cpf || '',
    rg: p.rg || '',
    dataNascimento: p.dataNascimento ? p.dataNascimento.split('T')[0] : '',
    sexo: p.sexo || '',
    nacionalidade: p.nacionalidade || 'Brasileira',
    telefone: p.telefone || '',
    celular: p.celular || '',
    email: p.email || '',
    crp: p.crp || '',
    crpUf: p.crpUf || '',
    escolaridade: p.escolaridade || '',
    cursoGraduacao: p.cursoGraduacao || '',
    instituicaoGraduacao: p.instituicaoGraduacao || '',
    anoConclusao: p.anoConclusao || '',
    posGraduacao: p.posGraduacao || '',
    areaEspecializacao: p.areaEspecializacao || '',
    abordagemTerapeutica: p.abordagemTerapeutica || '',
    cargo: p.cargo || '',
    regimeJuridico: p.regimeJuridico || '',
    cargaHoraria: p.cargaHoraria || '',
    dataAdmissao: p.dataAdmissao ? p.dataAdmissao.split('T')[0] : '',
    supervisorNome: p.supervisorNome || '',
    supervisorCrp: p.supervisorCrp || '',
    horarioAtendimento: p.horarioAtendimento || '',
    experienciaInclusao: p.experienciaInclusao ?? false,
    experienciaNeurodiv: p.experienciaNeurodiv ?? false,
    capacitacaoLaee: p.capacitacaoLaee ?? false,
  }
}

function formToFormData(form: FormState): PsychologistFormData {
  return {
    institutionId: form.institutionId,
    nomeCompleto: form.nomeCompleto,
    cpf: form.cpf || undefined,
    rg: form.rg || undefined,
    dataNascimento: form.dataNascimento || undefined,
    sexo: form.sexo || undefined,
    nacionalidade: form.nacionalidade || undefined,
    telefone: form.telefone || undefined,
    celular: form.celular || undefined,
    email: form.email || undefined,
    crp: form.crp || undefined,
    crpUf: form.crpUf || undefined,
    escolaridade: form.escolaridade || undefined,
    cursoGraduacao: form.cursoGraduacao || undefined,
    instituicaoGraduacao: form.instituicaoGraduacao || undefined,
    anoConclusao: form.anoConclusao || undefined,
    posGraduacao: form.posGraduacao || undefined,
    areaEspecializacao: form.areaEspecializacao || undefined,
    abordagemTerapeutica: form.abordagemTerapeutica || undefined,
    cargo: form.cargo || undefined,
    regimeJuridico: form.regimeJuridico || undefined,
    cargaHoraria: form.cargaHoraria || undefined,
    dataAdmissao: form.dataAdmissao || undefined,
    supervisorNome: form.supervisorNome || undefined,
    supervisorCrp: form.supervisorCrp || undefined,
    horarioAtendimento: form.horarioAtendimento || undefined,
    experienciaInclusao: form.experienciaInclusao,
    experienciaNeurodiv: form.experienciaNeurodiv,
    capacitacaoLaee: form.capacitacaoLaee,
  }
}

// ---- Toggle Row ----

function ToggleRow({
  label,
  icon: Icon,
  checked,
  onChange,
}: {
  label: string
  icon: React.ElementType
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between py-3 px-4 rounded-lg transition-colors',
        checked
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50'
          : 'bg-muted/30 border border-transparent'
      )}
    >
      <div className="flex items-center gap-2.5">
        <Icon
          className={cn(
            'w-4 h-4',
            checked ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
          )}
        />
        <span
          className={cn(
            'text-sm',
            checked ? 'text-emerald-700 dark:text-emerald-300 font-medium' : 'text-foreground/80'
          )}
        >
          {label}
        </span>
      </div>
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

export default function PsychologistsModule() {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterInstitutionId, setFilterInstitutionId] = useState<string>('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Fetch psychologists
  const loadPsychologists = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchPsychologists({
        search: search || undefined,
        institutionId: filterInstitutionId || undefined,
      })
      setPsychologists(data)
    } catch {
      toast.error('Erro ao carregar psicólogos')
    } finally {
      setLoading(false)
    }
  }, [search, filterInstitutionId])

  // Fetch institutions for filter and form
  const loadInstitutions = useCallback(async () => {
    try {
      const data = await fetchInstitutions()
      setInstitutions(data)
    } catch {
      // silent fail for institutions dropdown
    }
  }, [])

  useEffect(() => {
    loadPsychologists()
  }, [loadPsychologists])

  useEffect(() => {
    loadInstitutions()
  }, [loadInstitutions])

  // Search debounce
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const handleSearchChange = (value: string) => {
    if (searchTimeout) clearTimeout(searchTimeout)
    const timeout = setTimeout(() => {
      setSearch(value)
    }, 300)
    setSearchTimeout(timeout)
  }

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
  const handleEdit = (p: Psychologist) => {
    setForm(psychologistToForm(p))
    setEditingId(p.id)
    setDialogOpen(true)
  }

  // Save (create or update)
  const handleSave = async () => {
    if (!form.institutionId) {
      toast.error('Instituição é obrigatória')
      return
    }
    if (!form.nomeCompleto.trim()) {
      toast.error('Nome Completo é obrigatório')
      return
    }

    setSaving(true)
    try {
      const data = formToFormData(form)
      if (editingId) {
        await updatePsychologist(editingId, data)
        toast.success('Psicólogo atualizado com sucesso!')
      } else {
        await createPsychologist(data)
        toast.success('Psicólogo cadastrado com sucesso!')
      }
      setDialogOpen(false)
      loadPsychologists()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar psicólogo'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await deletePsychologist(id)
      toast.success('Psicólogo removido com sucesso!')
      setDeleteConfirm(null)
      loadPsychologists()
    } catch {
      toast.error('Erro ao remover psicólogo')
    }
  }

  // Get institution name
  const getInstitutionName = (institutionId: string | null) => {
    if (!institutionId) return '—'
    const inst = institutions.find((i) => i.id === institutionId)
    return inst?.nomeFantasia || inst?.razaoSocial || '—'
  }

  // Get label from options
  const getLabel = (
    options: readonly { value: string; label: string }[],
    value: string | null
  ) => {
    if (!value) return null
    const opt = options.find((o) => o.value === value)
    return opt?.label || value
  }

  // ---- Render ----

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-emerald-600" />
            Psicólogos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie o cadastro de psicólogos e profissionais de saúde mental
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Psicólogo
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CRP, especialização..."
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={filterInstitutionId}
          onValueChange={(v) => setFilterInstitutionId(v === '__all__' ? '' : v)}
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
          <span className="ml-3 text-muted-foreground">Carregando psicólogos...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && psychologists.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-4">
            <Stethoscope className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Nenhum psicólogo encontrado</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {search || filterInstitutionId
              ? 'Tente ajustar os termos da busca ou o filtro de instituição.'
              : 'Comece cadastrando o primeiro psicólogo.'}
          </p>
          {!search && !filterInstitutionId && (
            <Button
              onClick={handleNew}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Psicólogo
            </Button>
          )}
        </div>
      )}

      {/* Cards Grid */}
      {!loading && psychologists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {psychologists.map((p) => (
            <Card
              key={p.id}
              className="group hover:shadow-md transition-all duration-200 border-border/50 hover:border-emerald-200 dark:hover:border-emerald-800/50"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold truncate text-foreground">
                      {p.nomeCompleto}
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      {p.crp && (
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-500/70" />
                          CRP {p.crp}{p.crpUf ? `/${p.crpUf}` : ''}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-emerald-600"
                      onClick={() => handleEdit(p)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-red-600"
                      onClick={() => setDeleteConfirm(p.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Especialização & Abordagem */}
                <div className="flex flex-wrap gap-1.5">
                  {p.areaEspecializacao && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50"
                    >
                      {getLabel(AREA_ESPECIALIZACAO_PSICOLOGO_OPTIONS, p.areaEspecializacao)}
                    </Badge>
                  )}
                  {p.abordagemTerapeutica && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-400 dark:border-teal-800/50"
                    >
                      {getLabel(ABORDAGEM_TERAPEUTICA_OPTIONS, p.abordagemTerapeutica)}
                    </Badge>
                  )}
                </div>

                {/* Institution */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 className="w-3 h-3 text-emerald-500/70 shrink-0" />
                  <span className="truncate">{getInstitutionName(p.institutionId)}</span>
                </div>

                {/* Contact */}
                {(p.telefone || p.celular || p.email) && (
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {(p.telefone || p.celular) && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-500/70" />
                        {p.celular || p.telefone}
                      </span>
                    )}
                    {p.email && (
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 text-emerald-500/70 shrink-0" />
                        <span className="truncate">{p.email}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Competências & Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <div className="flex flex-wrap gap-1 flex-1">
                    {p.experienciaInclusao && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800/50">
                        Inclusão
                      </Badge>
                    )}
                    {p.experienciaNeurodiv && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 text-teal-600 border-teal-200 dark:text-teal-400 dark:border-teal-800/50">
                        Neurodiv
                      </Badge>
                    )}
                    {p.capacitacaoLaee && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 text-amber-600 border-amber-200 dark:text-amber-400 dark:border-amber-800/50">
                        LAEE
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este psicólogo? Esta ação não pode ser desfeita.
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
              <Stethoscope className="w-5 h-5 text-emerald-600" />
              {editingId ? 'Editar Psicólogo' : 'Novo Psicólogo'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Atualize os dados do psicólogo.'
                : 'Preencha os dados para cadastrar um novo psicólogo.'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-8rem)]">
            <div className="px-6 py-4 space-y-8">
              {/* Section 1: Dados Pessoais */}
              <FormSection title="Dados Pessoais" icon={User}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup label="Instituição" required className="sm:col-span-2">
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
                  <FieldGroup label="Nome Completo" required className="sm:col-span-2">
                    <Input
                      placeholder="Nome completo do psicólogo"
                      value={form.nomeCompleto}
                      onChange={(e) => updateField('nomeCompleto', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="CPF">
                    <Input
                      placeholder="000.000.000-00"
                      value={form.cpf}
                      onChange={(e) => updateField('cpf', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="RG">
                    <Input
                      placeholder="Número do RG"
                      value={form.rg}
                      onChange={(e) => updateField('rg', e.target.value)}
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
                  <FieldGroup label="Nacionalidade" className="sm:col-span-2">
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
                </div>
              </FormSection>

              {/* Section 2: Contato */}
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

              {/* Section 3: Registro Profissional */}
              <FormSection title="Registro Profissional" icon={ShieldCheck}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup label="CRP">
                    <Input
                      placeholder="Número do CRP"
                      value={form.crp}
                      onChange={(e) => updateField('crp', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="CRP UF">
                    <Select
                      value={form.crpUf}
                      onValueChange={(v) => updateField('crpUf', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="UF do CRP" />
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

              {/* Section 4: Formação */}
              <FormSection title="Formação" icon={GraduationCap}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <FieldGroup label="Curso de Graduação">
                    <Input
                      placeholder="Ex: Psicologia"
                      value={form.cursoGraduacao}
                      onChange={(e) => updateField('cursoGraduacao', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Instituição de Graduação">
                    <Input
                      placeholder="Nome da instituição"
                      value={form.instituicaoGraduacao}
                      onChange={(e) => updateField('instituicaoGraduacao', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Ano de Conclusão">
                    <Input
                      placeholder="Ex: 2020"
                      value={form.anoConclusao}
                      onChange={(e) => updateField('anoConclusao', e.target.value)}
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
                  <FieldGroup label="Área de Especialização">
                    <Select
                      value={form.areaEspecializacao}
                      onValueChange={(v) => updateField('areaEspecializacao', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {AREA_ESPECIALIZACAO_PSICOLOGO_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                  <FieldGroup label="Abordagem Terapêutica" className="sm:col-span-2">
                    <Select
                      value={form.abordagemTerapeutica}
                      onValueChange={(v) => updateField('abordagemTerapeutica', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {ABORDAGEM_TERAPEUTICA_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                </div>
              </FormSection>

              {/* Section 5: Atuação */}
              <FormSection title="Atuação" icon={Briefcase}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      placeholder="Ex: 40h semanais"
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
                  <FieldGroup label="Nome do Supervisor">
                    <Input
                      placeholder="Nome completo do supervisor"
                      value={form.supervisorNome}
                      onChange={(e) => updateField('supervisorNome', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="CRP do Supervisor">
                    <Input
                      placeholder="CRP do supervisor"
                      value={form.supervisorCrp}
                      onChange={(e) => updateField('supervisorCrp', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Horário de Atendimento" className="sm:col-span-2">
                    <Input
                      placeholder="Ex: Seg a Sex, 8h às 17h"
                      value={form.horarioAtendimento}
                      onChange={(e) => updateField('horarioAtendimento', e.target.value)}
                    />
                  </FieldGroup>
                </div>
              </FormSection>

              {/* Section 6: Competências */}
              <FormSection title="Competências" icon={Award}>
                <div className="space-y-2">
                  <ToggleRow
                    label="Experiência em Inclusão Escolar"
                    icon={Heart}
                    checked={form.experienciaInclusao}
                    onChange={(v) => updateField('experienciaInclusao', v)}
                  />
                  <ToggleRow
                    label="Experiência com Neurodivergência"
                    icon={Brain}
                    checked={form.experienciaNeurodiv}
                    onChange={(v) => updateField('experienciaNeurodiv', v)}
                  />
                  <ToggleRow
                    label="Capacitação LAEE"
                    icon={ShieldCheck}
                    checked={form.capacitacaoLaee}
                    onChange={(v) => updateField('capacitacaoLaee', v)}
                  />
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
              {editingId ? 'Salvar Alterações' : 'Cadastrar Psicólogo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
