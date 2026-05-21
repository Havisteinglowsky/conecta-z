'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  fetchClasses,
  fetchClass,
  createClass,
  updateClass,
  deleteClass,
  fetchInstitutions,
  fetchTeachers,
} from '@/lib/api'
import type { Class, ClassFormData, Institution, Teacher } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  NIVEL_TURMA_OPTIONS,
  TURNO_OPTIONS,
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
  GraduationCap,
  Users,
  School,
  Clock,
  Loader2,
  BookOpen,
  Building2,
  UserCheck,
} from 'lucide-react'
import { toast } from 'sonner'

// ---- Default Form State ----

interface FormState {
  nome: string
  institutionId: string
  serieAno: string
  nivel: string
  turno: string
  sala: string
  anoLetivo: string
  maxAlunos: string
  teacherId: string
}

const EMPTY_FORM: FormState = {
  nome: '',
  institutionId: '',
  serieAno: '',
  nivel: '',
  turno: '',
  sala: '',
  anoLetivo: new Date().getFullYear().toString(),
  maxAlunos: '',
  teacherId: '',
}

function classToForm(cls: Class): FormState {
  return {
    nome: cls.nome || '',
    institutionId: cls.institutionId || '',
    serieAno: cls.serieAno || '',
    nivel: cls.nivel || '',
    turno: cls.turno || '',
    sala: cls.sala || '',
    anoLetivo: cls.anoLetivo || '',
    maxAlunos: cls.maxAlunos != null ? String(cls.maxAlunos) : '',
    teacherId: cls.teacherId || '',
  }
}

function formToFormData(form: FormState): ClassFormData {
  return {
    institutionId: form.institutionId,
    nome: form.nome,
    serieAno: form.serieAno || undefined,
    nivel: form.nivel || undefined,
    turno: form.turno || undefined,
    sala: form.sala || undefined,
    anoLetivo: form.anoLetivo || undefined,
    maxAlunos: form.maxAlunos ? parseInt(form.maxAlunos, 10) : undefined,
    teacherId: form.teacherId || undefined,
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

export default function ClassesModule() {
  const [classes, setClasses] = useState<Class[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterInstitution, setFilterInstitution] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Fetch institutions for filter and form
  useEffect(() => {
    async function loadInstitutions() {
      try {
        const data = await fetchInstitutions()
        setInstitutions(data)
      } catch {
        // silently fail
      }
    }
    loadInstitutions()
  }, [])

  // Fetch classes
  const loadClasses = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchClasses({
        search: search || undefined,
        institutionId: filterInstitution || undefined,
      })
      setClasses(data)
    } catch {
      toast.error('Erro ao carregar turmas')
    } finally {
      setLoading(false)
    }
  }, [search, filterInstitution])

  useEffect(() => {
    loadClasses()
  }, [loadClasses])

  // Load teachers when institution changes in form
  useEffect(() => {
    async function loadTeachers() {
      if (form.institutionId) {
        try {
          const data = await fetchTeachers({ institutionId: form.institutionId })
          setTeachers(data)
        } catch {
          // silently fail
        }
      } else {
        setTeachers([])
      }
    }
    loadTeachers()
  }, [form.institutionId])

  // Search debounce
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (searchTimeout) clearTimeout(searchTimeout)
    const timeout = setTimeout(() => {}, 300)
    setSearchTimeout(timeout)
  }

  // Form helpers
  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value }
      // Reset teacher when institution changes
      if (key === 'institutionId') {
        updated.teacherId = ''
      }
      return updated
    })
  }

  // Open dialog for new
  const handleNew = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setDialogOpen(true)
  }

  // Open dialog for edit
  const handleEdit = async (cls: Class) => {
    // Fetch full detail with teacher info
    try {
      const detail = await fetchClass(cls.id)
      setForm(classToForm(detail))
      // Load teachers for this institution
      if (detail.institutionId) {
        const data = await fetchTeachers({ institutionId: detail.institutionId })
        setTeachers(data)
      }
    } catch {
      setForm(classToForm(cls))
    }
    setEditingId(cls.id)
    setDialogOpen(true)
  }

  // Save (create or update)
  const handleSave = async () => {
    if (!form.nome.trim()) {
      toast.error('Nome da turma é obrigatório')
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
        await updateClass(editingId, data)
        toast.success('Turma atualizada com sucesso!')
      } else {
        await createClass(data)
        toast.success('Turma cadastrada com sucesso!')
      }
      setDialogOpen(false)
      loadClasses()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar turma'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await deleteClass(id)
      toast.success('Turma removida com sucesso!')
      setDeleteConfirm(null)
      loadClasses()
    } catch {
      toast.error('Erro ao remover turma')
    }
  }

  // Filtered classes (client-side additional filter)
  const filteredClasses = classes.filter((cls) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      cls.nome.toLowerCase().includes(q) ||
      (cls.serieAno && cls.serieAno.toLowerCase().includes(q)) ||
      (cls.sala && cls.sala.toLowerCase().includes(q)) ||
      (cls.nivel && cls.nivel.toLowerCase().includes(q))
    )
  })

  // Get institution name by ID
  const getInstitutionName = (id: string) => {
    const inst = institutions.find((i) => i.id === id)
    return inst?.nomeFantasia || inst?.razaoSocial || '—'
  }

  // ---- Render ----

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            Turmas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie o cadastro de turmas e classes
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Turma
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, série, sala..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={filterInstitution}
          onValueChange={(v) => setFilterInstitution(v === '__all__' ? '' : v)}
        >
          <SelectTrigger className="w-full sm:w-[250px]">
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
          <span className="ml-3 text-muted-foreground">Carregando turmas...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredClasses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Nenhuma turma encontrada</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {search || filterInstitution
              ? 'Tente ajustar os filtros da busca.'
              : 'Comece cadastrando a primeira turma.'}
          </p>
          {!search && !filterInstitution && (
            <Button
              onClick={handleNew}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Turma
            </Button>
          )}
        </div>
      )}

      {/* Cards Grid */}
      {!loading && filteredClasses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClasses.map((cls) => {
            const studentCount = cls.students?.length ?? 0
            return (
              <Card
                key={cls.id}
                className="group hover:shadow-md transition-all duration-200 border-border/50 hover:border-emerald-200 dark:hover:border-emerald-800/50"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold truncate text-foreground">
                        {cls.nome}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5 truncate">
                        {cls.institution?.nomeFantasia || getInstitutionName(cls.institutionId)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {cls.nivel && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50"
                        >
                          {cls.nivel}
                        </Badge>
                      )}
                      {cls.turno && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 h-4"
                        >
                          {cls.turno}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    {cls.serieAno && (
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3 text-emerald-500/70" />
                        <span>{cls.serieAno}</span>
                      </div>
                    )}
                    {cls.sala && (
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 text-emerald-500/70" />
                        <span>Sala {cls.sala}</span>
                      </div>
                    )}
                    {cls.anoLetivo && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-emerald-500/70" />
                        <span>{cls.anoLetivo}</span>
                      </div>
                    )}
                    {cls.teacher && (
                      <div className="flex items-center gap-1.5 col-span-2">
                        <UserCheck className="w-3 h-3 text-emerald-500/70 shrink-0" />
                        <span className="truncate">{cls.teacher.nomeCompleto}</span>
                      </div>
                    )}
                  </div>

                  {/* Student count bar */}
                  <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Users className="w-3 h-3 text-emerald-500/60" />
                      <span className="text-muted-foreground">
                        {studentCount}{cls.maxAlunos ? `/${cls.maxAlunos}` : ''} alunos
                      </span>
                    </div>
                    {/* Capacity bar */}
                    {cls.maxAlunos && cls.maxAlunos > 0 && (
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            studentCount / cls.maxAlunos > 0.9
                              ? 'bg-red-400'
                              : studentCount / cls.maxAlunos > 0.7
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                          )}
                          style={{ width: `${Math.min((studentCount / cls.maxAlunos) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-emerald-600"
                        onClick={() => handleEdit(cls)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-red-600"
                        onClick={() => setDeleteConfirm(cls.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover esta turma? Esta ação não pode ser desfeita.
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
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              {editingId ? 'Editar Turma' : 'Nova Turma'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Atualize os dados da turma.'
                : 'Preencha os dados para cadastrar uma nova turma.'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-8rem)]">
            <div className="px-6 py-4 space-y-8">
              {/* Section 1: Dados da Turma */}
              <FormSection title="Dados da Turma" icon={GraduationCap}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup label="Nome" required className="sm:col-span-2">
                    <Input
                      placeholder="Ex: Turma A - 3º Ano"
                      value={form.nome}
                      onChange={(e) => updateField('nome', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Instituição" required>
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
                  <FieldGroup label="Série/Ano">
                    <Input
                      placeholder="Ex: 3º Ano, 5ª Série"
                      value={form.serieAno}
                      onChange={(e) => updateField('serieAno', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Nível">
                    <Select
                      value={form.nivel}
                      onValueChange={(v) => updateField('nivel', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        {NIVEL_TURMA_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                  <FieldGroup label="Turno">
                    <Select
                      value={form.turno}
                      onValueChange={(v) => updateField('turno', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o turno" />
                      </SelectTrigger>
                      <SelectContent>
                        {TURNO_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                </div>
              </FormSection>

              {/* Section 2: Infraestrutura */}
              <FormSection title="Infraestrutura e Horário" icon={School}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup label="Sala">
                    <Input
                      placeholder="Ex: Sala 201"
                      value={form.sala}
                      onChange={(e) => updateField('sala', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Ano Letivo">
                    <Input
                      placeholder="Ex: 2025"
                      value={form.anoLetivo}
                      onChange={(e) => updateField('anoLetivo', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup label="Máx. Alunos">
                    <Input
                      type="number"
                      placeholder="0"
                      value={form.maxAlunos}
                      onChange={(e) => updateField('maxAlunos', e.target.value)}
                    />
                  </FieldGroup>
                </div>
              </FormSection>

              {/* Section 3: Professor Responsável */}
              <FormSection title="Professor Responsável" icon={UserCheck}>
                <div className="grid grid-cols-1 gap-4">
                  <FieldGroup label="Professor Responsável">
                    <Select
                      value={form.teacherId}
                      onValueChange={(v) => updateField('teacherId', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          form.institutionId
                            ? 'Selecione o professor'
                            : 'Selecione uma instituição primeiro'
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.nomeCompleto}
                            {teacher.disciplinas && (
                              <span className="text-muted-foreground ml-1">
                                ({teacher.disciplinas})
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                  {!form.institutionId && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Selecione uma instituição para carregar a lista de professores.
                    </p>
                  )}
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
              {editingId ? 'Salvar Alterações' : 'Cadastrar Turma'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
