'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  fetchCompanions,
  fetchCompanion,
  createCompanion,
  updateCompanion,
  deleteCompanion,
  fetchStudentCompanions,
  deleteStudentCompanion,
} from '@/lib/api'
import type { Companion, CompanionFormData, StudentCompanion } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  SEXO_OPTIONS,
  VINCULO_ACOMPANHANTE_OPTIONS,
  FORMACAO_ACOMPANHANTE_OPTIONS,
  FUNCAO_ACOMPANHANTE_OPTIONS,
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
  Users,
  Phone,
  Mail,
  Loader2,
  Heart,
  GraduationCap,
  Briefcase,
  Clock,
  UserCheck,
  Link2,
} from 'lucide-react'
import { toast } from 'sonner'

// ---- Default Form State ----

interface FormState {
  nomeCompleto: string
  cpf: string
  rg: string
  dataNascimento: string
  sexo: string
  telefone: string
  celular: string
  email: string
  vinculo: string
  formacao: string
  registroProfissional: string
  funcao: string
  cargaHoraria: string
  periodo: string
  observacoes: string
}

const EMPTY_FORM: FormState = {
  nomeCompleto: '',
  cpf: '',
  rg: '',
  dataNascimento: '',
  sexo: '',
  telefone: '',
  celular: '',
  email: '',
  vinculo: '',
  formacao: '',
  registroProfissional: '',
  funcao: '',
  cargaHoraria: '',
  periodo: '',
  observacoes: '',
}

function companionToForm(c: Companion): FormState {
  return {
    nomeCompleto: c.nomeCompleto || '',
    cpf: c.cpf || '',
    rg: c.rg || '',
    dataNascimento: c.dataNascimento ? c.dataNascimento.split('T')[0] : '',
    sexo: c.sexo || '',
    telefone: c.telefone || '',
    celular: c.celular || '',
    email: c.email || '',
    vinculo: c.vinculo || '',
    formacao: c.formacao || '',
    registroProfissional: c.registroProfissional || '',
    funcao: c.funcao || '',
    cargaHoraria: c.cargaHoraria || '',
    periodo: c.periodo || '',
    observacoes: c.observacoes || '',
  }
}

function formToFormData(form: FormState): CompanionFormData {
  return {
    nomeCompleto: form.nomeCompleto,
    cpf: form.cpf || undefined,
    rg: form.rg || undefined,
    dataNascimento: form.dataNascimento || undefined,
    sexo: form.sexo || undefined,
    telefone: form.telefone || undefined,
    celular: form.celular || undefined,
    email: form.email || undefined,
    vinculo: form.vinculo || undefined,
    formacao: form.formacao || undefined,
    registroProfissional: form.registroProfissional || undefined,
    funcao: form.funcao || undefined,
    cargaHoraria: form.cargaHoraria || undefined,
    periodo: form.periodo || undefined,
    observacoes: form.observacoes || undefined,
  }
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

export default function CompanionsModule() {
  const [companions, setCompanions] = useState<Companion[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Detail state - linked students
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null)
  const [studentLinks, setStudentLinks] = useState<StudentCompanion[]>([])
  const [loadingLinks, setLoadingLinks] = useState(false)
  const [unlinkConfirm, setUnlinkConfirm] = useState<string | null>(null)

  // Fetch companions
  const loadCompanions = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchCompanions(search || undefined)
      setCompanions(data)
    } catch {
      toast.error('Erro ao carregar acompanhantes')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    loadCompanions()
  }, [loadCompanions])

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
  const handleEdit = (companion: Companion) => {
    setForm(companionToForm(companion))
    setEditingId(companion.id)
    setDialogOpen(true)
  }

  // Open detail view
  const handleViewDetail = async (companion: Companion) => {
    setSelectedCompanion(companion)
    setDetailOpen(true)
    setLoadingLinks(true)
    try {
      const detail = await fetchCompanion(companion.id)
      setStudentLinks(detail.studentLinks || [])
    } catch {
      toast.error('Erro ao carregar vínculos')
    } finally {
      setLoadingLinks(false)
    }
  }

  // Save (create or update)
  const handleSave = async () => {
    if (!form.nomeCompleto.trim()) {
      toast.error('Nome Completo é obrigatório')
      return
    }

    setSaving(true)
    try {
      const data = formToFormData(form)
      if (editingId) {
        await updateCompanion(editingId, data)
        toast.success('Acompanhante atualizado com sucesso!')
      } else {
        await createCompanion(data)
        toast.success('Acompanhante cadastrado com sucesso!')
      }
      setDialogOpen(false)
      loadCompanions()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar acompanhante'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  // Delete companion
  const handleDelete = async (id: string) => {
    try {
      await deleteCompanion(id)
      toast.success('Acompanhante removido com sucesso!')
      setDeleteConfirm(null)
      loadCompanions()
    } catch {
      toast.error('Erro ao remover acompanhante')
    }
  }

  // Unlink student
  const handleUnlink = async (linkId: string) => {
    try {
      await deleteStudentCompanion(linkId)
      toast.success('Vínculo removido com sucesso!')
      setUnlinkConfirm(null)
      // Reload links
      if (selectedCompanion) {
        const detail = await fetchCompanion(selectedCompanion.id)
        setStudentLinks(detail.studentLinks || [])
      }
      loadCompanions()
    } catch {
      toast.error('Erro ao remover vínculo')
    }
  }

  // Filtered companions (client-side additional filter)
  const filteredCompanions = companions.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.nomeCompleto.toLowerCase().includes(q) ||
      (c.cpf && c.cpf.includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.vinculo && c.vinculo.toLowerCase().includes(q)) ||
      (c.funcao && c.funcao.toLowerCase().includes(q))
    )
  })

  // ---- Render ----

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-600" />
            Acompanhantes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie o cadastro de acompanhantes e seus vínculos com alunos
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Acompanhante
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, CPF, email..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="ml-3 text-muted-foreground">Carregando acompanhantes...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCompanions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Nenhum acompanhante encontrado</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {search
              ? 'Tente ajustar os termos da busca.'
              : 'Comece cadastrando o primeiro acompanhante.'}
          </p>
          {!search && (
            <Button
              onClick={handleNew}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Acompanhante
            </Button>
          )}
        </div>
      )}

      {/* Cards Grid */}
      {!loading && filteredCompanions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCompanions.map((companion) => (
            <Card
              key={companion.id}
              className="group hover:shadow-md transition-all duration-200 border-border/50 hover:border-emerald-200 dark:hover:border-emerald-800/50 cursor-pointer"
              onClick={() => handleViewDetail(companion)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold truncate text-foreground">
                      {companion.nomeCompleto}
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5 truncate">
                      {companion.email || companion.celular || 'Sem contato'}
                    </CardDescription>
                  </div>
                  {companion.vinculo && (
                    <Badge
                      variant="secondary"
                      className="shrink-0 text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50"
                    >
                      {companion.vinculo}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* CPF */}
                {companion.cpf && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <UserCheck className="w-3 h-3 text-emerald-500/70 shrink-0" />
                    <span>CPF: {companion.cpf}</span>
                  </div>
                )}

                {/* Phone */}
                {(companion.telefone || companion.celular) && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Phone className="w-3 h-3 text-emerald-500/70 shrink-0" />
                    <span>{companion.celular || companion.telefone}</span>
                  </div>
                )}

                {/* Email */}
                {companion.email && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3 text-emerald-500/70 shrink-0" />
                    <span className="truncate">{companion.email}</span>
                  </div>
                )}

                {/* Stats Row */}
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  {companion.funcao && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Briefcase className="w-3 h-3 text-emerald-500/60" />
                      <span>{companion.funcao}</span>
                    </div>
                  )}
                  {companion.formacao && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <GraduationCap className="w-3 h-3 text-emerald-500/60" />
                      <span>{companion.formacao}</span>
                    </div>
                  )}
                  <div className="ml-auto flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-emerald-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(companion)
                      }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirm(companion.id)
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Student count badge */}
                {(companion.studentLinks?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1.5 py-0 h-4 border-emerald-200 text-emerald-700 dark:border-emerald-800/50 dark:text-emerald-400"
                    >
                      <Users className="w-2.5 h-2.5 mr-1" />
                      {companion.studentLinks!.length} aluno{companion.studentLinks!.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                )}
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
              Tem certeza que deseja remover este acompanhante? Esta ação não pode ser desfeita.
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

      {/* Detail Dialog - Linked Students */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-emerald-600" />
              {selectedCompanion?.nomeCompleto}
            </DialogTitle>
            <DialogDescription>
              Alunos vinculados a este acompanhante
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(85vh-8rem)]">
            <div className="px-6 py-4 space-y-4">
              {/* Companion Info Summary */}
              {selectedCompanion && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedCompanion.vinculo && (
                    <div className="flex items-center gap-2 text-xs">
                      <Link2 className="w-3 h-3 text-emerald-500" />
                      <span className="text-muted-foreground">Vínculo:</span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                      >
                        {selectedCompanion.vinculo}
                      </Badge>
                    </div>
                  )}
                  {selectedCompanion.funcao && (
                    <div className="flex items-center gap-2 text-xs">
                      <Briefcase className="w-3 h-3 text-emerald-500" />
                      <span className="text-muted-foreground">Função:</span>
                      <span className="text-foreground">{selectedCompanion.funcao}</span>
                    </div>
                  )}
                  {selectedCompanion.formacao && (
                    <div className="flex items-center gap-2 text-xs">
                      <GraduationCap className="w-3 h-3 text-emerald-500" />
                      <span className="text-muted-foreground">Formação:</span>
                      <span className="text-foreground">{selectedCompanion.formacao}</span>
                    </div>
                  )}
                  {selectedCompanion.cargaHoraria && (
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3 h-3 text-emerald-500" />
                      <span className="text-muted-foreground">Carga Horária:</span>
                      <span className="text-foreground">{selectedCompanion.cargaHoraria}</span>
                    </div>
                  )}
                  {selectedCompanion.celular && (
                    <div className="flex items-center gap-2 text-xs">
                      <Phone className="w-3 h-3 text-emerald-500" />
                      <span className="text-muted-foreground">Celular:</span>
                      <span className="text-foreground">{selectedCompanion.celular}</span>
                    </div>
                  )}
                  {selectedCompanion.email && (
                    <div className="flex items-center gap-2 text-xs">
                      <Mail className="w-3 h-3 text-emerald-500" />
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-foreground truncate">{selectedCompanion.email}</span>
                    </div>
                  )}
                </div>
              )}

              <Separator className="bg-emerald-200/50 dark:bg-emerald-800/30" />

              {/* Linked Students Table */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Users className="w-4 h-4" />
                  Alunos Vinculados
                </h4>

                {loadingLinks ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                    <span className="ml-2 text-sm text-muted-foreground">Carregando...</span>
                  </div>
                ) : studentLinks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Nenhum aluno vinculado a este acompanhante.
                  </div>
                ) : (
                  <div className="rounded-md border border-border/50 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="text-xs">Aluno</TableHead>
                          <TableHead className="text-xs">Matrícula</TableHead>
                          <TableHead className="text-xs">Início</TableHead>
                          <TableHead className="text-xs">Status</TableHead>
                          <TableHead className="text-xs w-16">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentLinks.map((link) => (
                          <TableRow key={link.id}>
                            <TableCell className="text-xs font-medium">
                              {link.student?.nomeCompleto || '—'}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {link.student?.matricula || '—'}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {link.inicio ? new Date(link.inicio).toLocaleDateString('pt-BR') : '—'}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  'text-[9px] px-1.5 py-0 h-4',
                                  link.ativo
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                )}
                              >
                                {link.ativo ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-red-600"
                                onClick={() => setUnlinkConfirm(link.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Unlink Confirmation Dialog */}
      <Dialog open={unlinkConfirm !== null} onOpenChange={() => setUnlinkConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remover Vínculo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover o vínculo deste acompanhante com o aluno?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setUnlinkConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => unlinkConfirm && handleUnlink(unlinkConfirm)}
            >
              Remover Vínculo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-emerald-600" />
              {editingId ? 'Editar Acompanhante' : 'Novo Acompanhante'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Atualize os dados do acompanhante.'
                : 'Preencha os dados para cadastrar um novo acompanhante.'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-8rem)]">
            <div className="px-6 py-4 space-y-8">
              {/* Section 1: Dados Pessoais */}
              <FormSection title="Dados Pessoais" icon={UserCheck}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup label="Nome Completo" required className="sm:col-span-2">
                    <Input
                      placeholder="Nome completo do acompanhante"
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
                      placeholder="RG"
                      value={form.rg}
                      onChange={(e) => updateField('rg', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Data Nascimento">
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

              {/* Section 3: Vínculo e Formação */}
              <FormSection title="Vínculo e Formação" icon={GraduationCap}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup label="Vínculo">
                    <Select
                      value={form.vinculo}
                      onValueChange={(v) => updateField('vinculo', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o vínculo" />
                      </SelectTrigger>
                      <SelectContent>
                        {VINCULO_ACOMPANHANTE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                  <FieldGroup label="Formação">
                    <Select
                      value={form.formacao}
                      onValueChange={(v) => updateField('formacao', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a formação" />
                      </SelectTrigger>
                      <SelectContent>
                        {FORMACAO_ACOMPANHANTE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                  <FieldGroup label="Registro Profissional">
                    <Input
                      placeholder="Número do registro profissional"
                      value={form.registroProfissional}
                      onChange={(e) => updateField('registroProfissional', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Função">
                    <Select
                      value={form.funcao}
                      onValueChange={(v) => updateField('funcao', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                      <SelectContent>
                        {FUNCAO_ACOMPANHANTE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                </div>
              </FormSection>

              {/* Section 4: Expediente */}
              <FormSection title="Expediente" icon={Clock}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup label="Carga Horária">
                    <Input
                      placeholder="Ex: 40h semanais"
                      value={form.cargaHoraria}
                      onChange={(e) => updateField('cargaHoraria', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Período">
                    <Input
                      placeholder="Ex: Matutino / Integral"
                      value={form.periodo}
                      onChange={(e) => updateField('periodo', e.target.value)}
                    />
                  </FieldGroup>
                </div>
              </FormSection>

              {/* Section 5: Observações */}
              <FormSection title="Observações" icon={Briefcase}>
                <FieldGroup label="Observações">
                  <Textarea
                    placeholder="Observações adicionais sobre o acompanhante..."
                    value={form.observacoes}
                    onChange={(e) => updateField('observacoes', e.target.value)}
                    rows={4}
                  />
                </FieldGroup>
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
              {editingId ? 'Salvar Alterações' : 'Cadastrar Acompanhante'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
