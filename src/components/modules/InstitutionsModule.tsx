'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  fetchInstitutions,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from '@/lib/api'
import type { Institution, InstitutionFormData } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  UF_LIST,
  TIPO_INSTITUICAO_OPTIONS,
  DEPENDENCIA_ADMIN_OPTIONS,
  REDE_OPTIONS,
  REGULAMENTACAO_OPTIONS,
  ETAPAS_ENSINO_OPTIONS,
  TURNO_OPTIONS,
  MODALIDADE_OPTIONS,
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
import { Checkbox } from '@/components/ui/checkbox'
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
  School,
  MapPin,
  Phone,
  Building2,
  Loader2,
  Users,
  GraduationCap,
} from 'lucide-react'
import { toast } from 'sonner'

// ---- Helpers ----

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function toJsonArray(arr: string[]): string | undefined {
  if (arr.length === 0) return undefined
  return JSON.stringify(arr)
}

function formatCnpj(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14)
  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  if (digits.length <= 12)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

// ---- Default Form State ----

interface FormState {
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  codigoInep: string
  tipo: string
  dependenciaAdmin: string
  rede: string
  regulamentacao: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  municipio: string
  uf: string
  telefone: string
  telefone2: string
  email: string
  site: string
  nomeDiretor: string
  telefoneDiretor: string
  emailDiretor: string
  modalidades: string[]
  etapas: string[]
  turnos: string[]
  totalSalas: string
  capacidadeAlunos: string
  laboratorioInformatica: boolean
  biblioteca: boolean
  quadraEsportiva: boolean
  salaRecursos: boolean
  acessibilidade: boolean
  internet: boolean
}

const EMPTY_FORM: FormState = {
  cnpj: '',
  razaoSocial: '',
  nomeFantasia: '',
  codigoInep: '',
  tipo: '',
  dependenciaAdmin: '',
  rede: '',
  regulamentacao: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  municipio: '',
  uf: '',
  telefone: '',
  telefone2: '',
  email: '',
  site: '',
  nomeDiretor: '',
  telefoneDiretor: '',
  emailDiretor: '',
  modalidades: [],
  etapas: [],
  turnos: [],
  totalSalas: '',
  capacidadeAlunos: '',
  laboratorioInformatica: false,
  biblioteca: false,
  quadraEsportiva: false,
  salaRecursos: false,
  acessibilidade: false,
  internet: false,
}

function institutionToForm(inst: Institution): FormState {
  return {
    cnpj: inst.cnpj || '',
    razaoSocial: inst.razaoSocial || '',
    nomeFantasia: inst.nomeFantasia || '',
    codigoInep: inst.codigoInep || '',
    tipo: inst.tipo || '',
    dependenciaAdmin: inst.dependenciaAdmin || '',
    rede: inst.rede || '',
    regulamentacao: inst.regulamentacao || '',
    cep: inst.cep || '',
    logradouro: inst.logradouro || '',
    numero: inst.numero || '',
    complemento: inst.complemento || '',
    bairro: inst.bairro || '',
    municipio: inst.municipio || '',
    uf: inst.uf || '',
    telefone: inst.telefone || '',
    telefone2: inst.telefone2 || '',
    email: inst.email || '',
    site: inst.site || '',
    nomeDiretor: inst.nomeDiretor || '',
    telefoneDiretor: inst.telefoneDiretor || '',
    emailDiretor: inst.emailDiretor || '',
    modalidades: parseJsonArray(inst.modalidades),
    etapas: parseJsonArray(inst.etapas),
    turnos: parseJsonArray(inst.turnos),
    totalSalas: inst.totalSalas != null ? String(inst.totalSalas) : '',
    capacidadeAlunos: inst.capacidadeAlunos != null ? String(inst.capacidadeAlunos) : '',
    laboratorioInformatica: inst.laboratorioInformatica ?? false,
    biblioteca: inst.biblioteca ?? false,
    quadraEsportiva: inst.quadraEsportiva ?? false,
    salaRecursos: inst.salaRecursos ?? false,
    acessibilidade: inst.acessibilidade ?? false,
    internet: inst.internet ?? false,
  }
}

function formToFormData(form: FormState): InstitutionFormData {
  return {
    cnpj: form.cnpj.replace(/\D/g, ''),
    razaoSocial: form.razaoSocial,
    nomeFantasia: form.nomeFantasia,
    codigoInep: form.codigoInep || undefined,
    tipo: form.tipo,
    dependenciaAdmin: form.dependenciaAdmin || undefined,
    rede: form.rede || undefined,
    regulamentacao: form.regulamentacao || undefined,
    cep: form.cep.replace(/\D/g, '') || undefined,
    logradouro: form.logradouro || undefined,
    numero: form.numero || undefined,
    complemento: form.complemento || undefined,
    bairro: form.bairro || undefined,
    municipio: form.municipio || undefined,
    uf: form.uf || undefined,
    telefone: form.telefone || undefined,
    telefone2: form.telefone2 || undefined,
    email: form.email || undefined,
    site: form.site || undefined,
    nomeDiretor: form.nomeDiretor || undefined,
    telefoneDiretor: form.telefoneDiretor || undefined,
    emailDiretor: form.emailDiretor || undefined,
    modalidades: toJsonArray(form.modalidades),
    etapas: toJsonArray(form.etapas),
    turnos: toJsonArray(form.turnos),
    totalSalas: form.totalSalas ? parseInt(form.totalSalas, 10) : undefined,
    capacidadeAlunos: form.capacidadeAlunos ? parseInt(form.capacidadeAlunos, 10) : undefined,
    laboratorioInformatica: form.laboratorioInformatica,
    biblioteca: form.biblioteca,
    quadraEsportiva: form.quadraEsportiva,
    salaRecursos: form.salaRecursos,
    acessibilidade: form.acessibilidade,
    internet: form.internet,
  }
}

// ---- Checkbox Group ----

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: readonly { value: string; label: string }[]
  selected: string[]
  onChange: (val: string[]) => void
}) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-accent/40 rounded-md px-2 py-1.5 transition-colors"
        >
          <Checkbox
            checked={selected.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
          />
          <span className="text-foreground/80">{opt.label}</span>
        </label>
      ))}
    </div>
  )
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

export default function InstitutionsModule() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Fetch institutions
  const loadInstitutions = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchInstitutions(search || undefined)
      setInstitutions(data)
    } catch {
      toast.error('Erro ao carregar instituições')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    loadInstitutions()
  }, [loadInstitutions])

  // Search debounce
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (searchTimeout) clearTimeout(searchTimeout)
    const timeout = setTimeout(() => {
      // Search will trigger refetch via useEffect
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
  const handleEdit = (inst: Institution) => {
    setForm(institutionToForm(inst))
    setEditingId(inst.id)
    setDialogOpen(true)
  }

  // Save (create or update)
  const handleSave = async () => {
    if (!form.cnpj.replace(/\D/g, '')) {
      toast.error('CNPJ é obrigatório')
      return
    }
    if (!form.razaoSocial.trim()) {
      toast.error('Razão Social é obrigatória')
      return
    }
    if (!form.nomeFantasia.trim()) {
      toast.error('Nome Fantasia é obrigatório')
      return
    }
    if (!form.tipo) {
      toast.error('Tipo de instituição é obrigatório')
      return
    }

    setSaving(true)
    try {
      const data = formToFormData(form)
      if (editingId) {
        await updateInstitution(editingId, data)
        toast.success('Instituição atualizada com sucesso!')
      } else {
        await createInstitution(data)
        toast.success('Instituição criada com sucesso!')
      }
      setDialogOpen(false)
      loadInstitutions()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar instituição'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await deleteInstitution(id)
      toast.success('Instituição removida com sucesso!')
      setDeleteConfirm(null)
      loadInstitutions()
    } catch {
      toast.error('Erro ao remover instituição')
    }
  }

  // Filtered institutions (client-side additional filter)
  const filteredInstitutions = institutions.filter((inst) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      inst.nomeFantasia.toLowerCase().includes(q) ||
      inst.razaoSocial.toLowerCase().includes(q) ||
      inst.cnpj.includes(q) ||
      (inst.municipio && inst.municipio.toLowerCase().includes(q)) ||
      (inst.uf && inst.uf.toLowerCase().includes(q))
    )
  })

  // ---- Render ----

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <School className="w-5 h-5 text-emerald-600" />
            Instituições de Ensino
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie o cadastro de instituições e escolas
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Instituição
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, CNPJ, município..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="ml-3 text-muted-foreground">Carregando instituições...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredInstitutions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-4">
            <School className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Nenhuma instituição encontrada</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {search
              ? 'Tente ajustar os termos da busca.'
              : 'Comece cadastrando a primeira instituição de ensino.'}
          </p>
          {!search && (
            <Button
              onClick={handleNew}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Instituição
            </Button>
          )}
        </div>
      )}

      {/* Cards Grid */}
      {!loading && filteredInstitutions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredInstitutions.map((inst) => (
            <Card
              key={inst.id}
              className="group hover:shadow-md transition-all duration-200 border-border/50 hover:border-emerald-200 dark:hover:border-emerald-800/50"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold truncate text-foreground">
                      {inst.nomeFantasia}
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5 truncate">
                      {inst.razaoSocial}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="shrink-0 text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50"
                  >
                    {inst.tipo}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* CNPJ & INEP */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 text-emerald-500/70" />
                    {formatCnpj(inst.cnpj)}
                  </span>
                  {inst.codigoInep && (
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3 h-3 text-emerald-500/70" />
                      INEP: {inst.codigoInep}
                    </span>
                  )}
                </div>

                {/* Location */}
                {(inst.municipio || inst.uf) && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 text-emerald-500/70 shrink-0" />
                    <span className="truncate">
                      {inst.municipio}{inst.uf ? `/${inst.uf}` : ''}
                    </span>
                  </div>
                )}

                {/* Phone */}
                {inst.telefone && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="w-3 h-3 text-emerald-500/70 shrink-0" />
                    <span>{inst.telefone}</span>
                  </div>
                )}

                {/* Stats Row */}
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  {inst.totalSalas != null && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building2 className="w-3 h-3 text-emerald-500/60" />
                      <span>{inst.totalSalas} salas</span>
                    </div>
                  )}
                  {inst.capacidadeAlunos != null && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="w-3 h-3 text-emerald-500/60" />
                      <span>{inst.capacidadeAlunos} alunos</span>
                    </div>
                  )}
                  <div className="ml-auto flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-emerald-600"
                      onClick={() => handleEdit(inst)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-red-600"
                      onClick={() => setDeleteConfirm(inst.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Infra badges */}
                <div className="flex flex-wrap gap-1">
                  {inst.laboratorioInformatica && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                      Lab. Informática
                    </Badge>
                  )}
                  {inst.biblioteca && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                      Biblioteca
                    </Badge>
                  )}
                  {inst.quadraEsportiva && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                      Quadra
                    </Badge>
                  )}
                  {inst.acessibilidade && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                      Acessível
                    </Badge>
                  )}
                  {inst.internet && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                      Internet
                    </Badge>
                  )}
                  {inst.salaRecursos && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                      Sala Recursos
                    </Badge>
                  )}
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
              Tem certeza que deseja remover esta instituição? Esta ação não pode ser desfeita.
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
              <School className="w-5 h-5 text-emerald-600" />
              {editingId ? 'Editar Instituição' : 'Nova Instituição'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Atualize os dados da instituição de ensino.'
                : 'Preencha os dados para cadastrar uma nova instituição de ensino.'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-8rem)]">
            <div className="px-6 py-4 space-y-8">
              {/* Section 1: Dados da Instituição */}
              <FormSection title="Dados da Instituição" icon={Building2}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup label="CNPJ" required>
                    <Input
                      placeholder="00.000.000/0000-00"
                      value={form.cnpj}
                      onChange={(e) => updateField('cnpj', formatCnpj(e.target.value))}
                    />
                  </FieldGroup>
                  <FieldGroup label="Código INEP">
                    <Input
                      placeholder="Código INEP"
                      value={form.codigoInep}
                      onChange={(e) => updateField('codigoInep', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Razão Social" required className="sm:col-span-2">
                    <Input
                      placeholder="Razão Social completa"
                      value={form.razaoSocial}
                      onChange={(e) => updateField('razaoSocial', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Nome Fantasia" required className="sm:col-span-2">
                    <Input
                      placeholder="Nome fantasia da instituição"
                      value={form.nomeFantasia}
                      onChange={(e) => updateField('nomeFantasia', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Tipo" required>
                    <Select
                      value={form.tipo}
                      onValueChange={(v) => updateField('tipo', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPO_INSTITUICAO_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                  <FieldGroup label="Dependência Administrativa">
                    <Select
                      value={form.dependenciaAdmin}
                      onValueChange={(v) => updateField('dependenciaAdmin', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPENDENCIA_ADMIN_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                  <FieldGroup label="Rede">
                    <Select
                      value={form.rede}
                      onValueChange={(v) => updateField('rede', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {REDE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                  <FieldGroup label="Regulamentação">
                    <Select
                      value={form.regulamentacao}
                      onValueChange={(v) => updateField('regulamentacao', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGULAMENTACAO_OPTIONS.map((opt) => (
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
                  <FieldGroup label="Telefone 2">
                    <Input
                      placeholder="(00) 00000-0000"
                      value={form.telefone2}
                      onChange={(e) => updateField('telefone2', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Email">
                    <Input
                      type="email"
                      placeholder="email@instituicao.edu.br"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Site">
                    <Input
                      placeholder="www.instituicao.edu.br"
                      value={form.site}
                      onChange={(e) => updateField('site', e.target.value)}
                    />
                  </FieldGroup>
                </div>
              </FormSection>

              {/* Section 4: Direção */}
              <FormSection title="Direção" icon={Users}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FieldGroup label="Nome do Diretor(a)" className="sm:col-span-3">
                    <Input
                      placeholder="Nome completo"
                      value={form.nomeDiretor}
                      onChange={(e) => updateField('nomeDiretor', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Telefone">
                    <Input
                      placeholder="(00) 00000-0000"
                      value={form.telefoneDiretor}
                      onChange={(e) => updateField('telefoneDiretor', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Email" className="sm:col-span-2">
                    <Input
                      type="email"
                      placeholder="diretor@instituicao.edu.br"
                      value={form.emailDiretor}
                      onChange={(e) => updateField('emailDiretor', e.target.value)}
                    />
                  </FieldGroup>
                </div>
              </FormSection>

              {/* Section 5: Ensino */}
              <FormSection title="Ensino" icon={GraduationCap}>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Modalidades</Label>
                    <CheckboxGroup
                      options={MODALIDADE_OPTIONS}
                      selected={form.modalidades}
                      onChange={(v) => updateField('modalidades', v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Etapas de Ensino</Label>
                    <CheckboxGroup
                      options={ETAPAS_ENSINO_OPTIONS}
                      selected={form.etapas}
                      onChange={(v) => updateField('etapas', v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Turnos</Label>
                    <CheckboxGroup
                      options={TURNO_OPTIONS}
                      selected={form.turnos}
                      onChange={(v) => updateField('turnos', v)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FieldGroup label="Total de Salas">
                      <Input
                        type="number"
                        placeholder="0"
                        value={form.totalSalas}
                        onChange={(e) => updateField('totalSalas', e.target.value)}
                      />
                    </FieldGroup>
                    <FieldGroup label="Capacidade de Alunos">
                      <Input
                        type="number"
                        placeholder="0"
                        value={form.capacidadeAlunos}
                        onChange={(e) => updateField('capacidadeAlunos', e.target.value)}
                      />
                    </FieldGroup>
                  </div>
                </div>
              </FormSection>

              {/* Section 6: Infraestrutura */}
              <FormSection title="Infraestrutura" icon={Building2}>
                <div className="space-y-1">
                  <ToggleRow
                    label="Laboratório de Informática"
                    checked={form.laboratorioInformatica}
                    onChange={(v) => updateField('laboratorioInformatica', v)}
                  />
                  <ToggleRow
                    label="Biblioteca"
                    checked={form.biblioteca}
                    onChange={(v) => updateField('biblioteca', v)}
                  />
                  <ToggleRow
                    label="Quadra Esportiva"
                    checked={form.quadraEsportiva}
                    onChange={(v) => updateField('quadraEsportiva', v)}
                  />
                  <ToggleRow
                    label="Sala de Recursos"
                    checked={form.salaRecursos}
                    onChange={(v) => updateField('salaRecursos', v)}
                  />
                  <ToggleRow
                    label="Acessibilidade"
                    checked={form.acessibilidade}
                    onChange={(v) => updateField('acessibilidade', v)}
                  />
                  <ToggleRow
                    label="Internet"
                    checked={form.internet}
                    onChange={(v) => updateField('internet', v)}
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
              {editingId ? 'Salvar Alterações' : 'Cadastrar Instituição'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
