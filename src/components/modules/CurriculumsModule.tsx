'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  fetchCurriculums,
  createCurriculum,
  updateCurriculum,
  deleteCurriculum,
  fetchInstitutions,
} from '@/lib/api'
import type { Curriculum, CurriculumFormData, Institution } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  ETAPAS_ENSINO_OPTIONS,
  NIVEL_TURMA_OPTIONS,
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
  Search,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  School,
  Loader2,
  CheckCircle2,
  XCircle,
  FileText,
  Target,
  Lightbulb,
  Brain,
  Accessibility,
  Clock,
} from 'lucide-react'
import { toast } from 'sonner'

// ---- Default Form State ----

interface FormState {
  nome: string
  institutionId: string
  anoLetivo: string
  nivel: string
  serieAno: string
  bncc: boolean
  disciplinas: string
  competenciasGerais: string
  habilidades: string
  objetivosAprendizagem: string
  metodologias: string
  adaptacaoInclusiva: boolean
  adaptacaoNeurodiv: boolean
  descricaoAdaptacao: string
  observacoes: string
}

const EMPTY_FORM: FormState = {
  nome: '',
  institutionId: '',
  anoLetivo: new Date().getFullYear().toString(),
  nivel: '',
  serieAno: '',
  bncc: false,
  disciplinas: '',
  competenciasGerais: '',
  habilidades: '',
  objetivosAprendizagem: '',
  metodologias: '',
  adaptacaoInclusiva: false,
  adaptacaoNeurodiv: false,
  descricaoAdaptacao: '',
  observacoes: '',
}

function curriculumToForm(curr: Curriculum): FormState {
  return {
    nome: curr.nome || '',
    institutionId: curr.institutionId || '',
    anoLetivo: curr.anoLetivo || '',
    nivel: curr.nivel || '',
    serieAno: curr.serieAno || '',
    bncc: curr.bncc ?? false,
    disciplinas: curr.disciplinas || '',
    competenciasGerais: curr.competenciasGerais || '',
    habilidades: curr.habilidades || '',
    objetivosAprendizagem: curr.objetivosAprendizagem || '',
    metodologias: curr.metodologias || '',
    adaptacaoInclusiva: curr.adaptacaoInclusiva ?? false,
    adaptacaoNeurodiv: curr.adaptacaoNeurodiv ?? false,
    descricaoAdaptacao: curr.descricaoAdaptacao || '',
    observacoes: curr.observacoes || '',
  }
}

function formToFormData(form: FormState): CurriculumFormData {
  return {
    institutionId: form.institutionId,
    nome: form.nome,
    anoLetivo: form.anoLetivo || undefined,
    nivel: form.nivel || undefined,
    serieAno: form.serieAno || undefined,
    bncc: form.bncc,
    disciplinas: form.disciplinas || undefined,
    competenciasGerais: form.competenciasGerais || undefined,
    habilidades: form.habilidades || undefined,
    objetivosAprendizagem: form.objetivosAprendizagem || undefined,
    metodologias: form.metodologias || undefined,
    adaptacaoInclusiva: form.adaptacaoInclusiva,
    adaptacaoNeurodiv: form.adaptacaoNeurodiv,
    descricaoAdaptacao: form.descricaoAdaptacao || undefined,
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

// ---- Toggle Row ----

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="pr-4">
        <span className="text-sm text-foreground/80">{label}</span>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

// ---- Main Component ----

export default function CurriculumsModule() {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])
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

  // Fetch curriculums
  const loadCurriculums = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchCurriculums({
        search: search || undefined,
        institutionId: filterInstitution || undefined,
      })
      setCurriculums(data)
    } catch {
      toast.error('Erro ao carregar currículos')
    } finally {
      setLoading(false)
    }
  }, [search, filterInstitution])

  useEffect(() => {
    loadCurriculums()
  }, [loadCurriculums])

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
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // Open dialog for new
  const handleNew = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setDialogOpen(true)
  }

  // Open dialog for edit
  const handleEdit = (curr: Curriculum) => {
    setForm(curriculumToForm(curr))
    setEditingId(curr.id)
    setDialogOpen(true)
  }

  // Save (create or update)
  const handleSave = async () => {
    if (!form.nome.trim()) {
      toast.error('Nome do currículo é obrigatório')
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
        await updateCurriculum(editingId, data)
        toast.success('Currículo atualizado com sucesso!')
      } else {
        await createCurriculum(data)
        toast.success('Currículo cadastrado com sucesso!')
      }
      setDialogOpen(false)
      loadCurriculums()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar currículo'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await deleteCurriculum(id)
      toast.success('Currículo removido com sucesso!')
      setDeleteConfirm(null)
      loadCurriculums()
    } catch {
      toast.error('Erro ao remover currículo')
    }
  }

  // Filtered curriculums (client-side additional filter)
  const filteredCurriculums = curriculums.filter((curr) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      curr.nome.toLowerCase().includes(q) ||
      (curr.nivel && curr.nivel.toLowerCase().includes(q)) ||
      (curr.serieAno && curr.serieAno.toLowerCase().includes(q)) ||
      (curr.disciplinas && curr.disciplinas.toLowerCase().includes(q))
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
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Currículos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os currículos e adaptações curriculares
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Currículo
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, nível, disciplinas..."
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
          <span className="ml-3 text-muted-foreground">Carregando currículos...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCurriculums.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Nenhum currículo encontrado</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {search || filterInstitution
              ? 'Tente ajustar os filtros da busca.'
              : 'Comece cadastrando o primeiro currículo.'}
          </p>
          {!search && !filterInstitution && (
            <Button
              onClick={handleNew}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Currículo
            </Button>
          )}
        </div>
      )}

      {/* Cards Grid */}
      {!loading && filteredCurriculums.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCurriculums.map((curr) => (
            <Card
              key={curr.id}
              className="group hover:shadow-md transition-all duration-200 border-border/50 hover:border-emerald-200 dark:hover:border-emerald-800/50"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold truncate text-foreground">
                      {curr.nome}
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5 truncate">
                      {curr.institution?.nomeFantasia || getInstitutionName(curr.institutionId)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {curr.bncc && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50"
                      >
                        BNCC
                      </Badge>
                    )}
                    {curr.nivel && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                        {curr.nivel}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  {curr.serieAno && (
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-emerald-500/70" />
                      <span>{curr.serieAno}</span>
                    </div>
                  )}
                  {curr.anoLetivo && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-emerald-500/70" />
                      <span>{curr.anoLetivo}</span>
                    </div>
                  )}
                </div>

                {/* Adaptation badges */}
                <div className="flex flex-wrap gap-1">
                  {curr.adaptacaoInclusiva && (
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1.5 py-0 h-4 border-teal-200 text-teal-700 dark:border-teal-800/50 dark:text-teal-400"
                    >
                      <Accessibility className="w-2.5 h-2.5 mr-1" />
                      Inclusiva
                    </Badge>
                  )}
                  {curr.adaptacaoNeurodiv && (
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1.5 py-0 h-4 border-purple-200 text-purple-700 dark:border-purple-800/50 dark:text-purple-400"
                    >
                      <Brain className="w-2.5 h-2.5 mr-1" />
                      Neurodiv
                    </Badge>
                  )}
                </div>

                {/* Content summary */}
                <div className="space-y-1">
                  {curr.disciplinas && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FileText className="w-3 h-3 text-emerald-500/70 shrink-0" />
                      <span className="truncate">{curr.disciplinas.substring(0, 80)}{curr.disciplinas.length > 80 ? '...' : ''}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1 ml-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-emerald-600"
                      onClick={() => handleEdit(curr)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-red-600"
                      onClick={() => setDeleteConfirm(curr.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
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
              Tem certeza que deseja remover este currículo? Esta ação não pode ser desfeita.
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
              {editingId ? 'Editar Currículo' : 'Novo Currículo'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Atualize os dados do currículo.'
                : 'Preencha os dados para cadastrar um novo currículo.'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-8rem)]">
            <div className="px-6 py-4 space-y-8">
              {/* Section 1: Dados Gerais */}
              <FormSection title="Dados Gerais" icon={BookOpen}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldGroup label="Nome" required className="sm:col-span-2">
                    <Input
                      placeholder="Ex: Currículo 2025 - Ensino Fundamental I"
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
                  <FieldGroup label="Ano Letivo">
                    <Input
                      placeholder="Ex: 2025"
                      value={form.anoLetivo}
                      onChange={(e) => updateField('anoLetivo', e.target.value)}
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
                  <FieldGroup label="Série/Ano">
                    <Select
                      value={form.serieAno}
                      onValueChange={(v) => updateField('serieAno', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a série/ano" />
                      </SelectTrigger>
                      <SelectContent>
                        {ETAPAS_ENSINO_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                </div>
              </FormSection>

              {/* Section 2: BNCC e Conteúdo */}
              <FormSection title="BNCC e Conteúdo Curricular" icon={Target}>
                <div className="space-y-4">
                  <ToggleRow
                    label="Base Nacional Comum Curricular (BNCC)"
                    description="Indica se este currículo segue a BNCC"
                    checked={form.bncc}
                    onChange={(v) => updateField('bncc', v)}
                  />
                  <FieldGroup label="Disciplinas">
                    <Textarea
                      placeholder="Liste as disciplinas do currículo, separadas por vírgula ou linha..."
                      value={form.disciplinas}
                      onChange={(e) => updateField('disciplinas', e.target.value)}
                      rows={3}
                    />
                  </FieldGroup>
                  <FieldGroup label="Competências Gerais">
                    <Textarea
                      placeholder="Descreva as competências gerais do currículo..."
                      value={form.competenciasGerais}
                      onChange={(e) => updateField('competenciasGerais', e.target.value)}
                      rows={4}
                    />
                  </FieldGroup>
                  <FieldGroup label="Habilidades">
                    <Textarea
                      placeholder="Descreva as habilidades esperadas..."
                      value={form.habilidades}
                      onChange={(e) => updateField('habilidades', e.target.value)}
                      rows={4}
                    />
                  </FieldGroup>
                </div>
              </FormSection>

              {/* Section 3: Objetivos e Metodologias */}
              <FormSection title="Objetivos e Metodologias" icon={Lightbulb}>
                <div className="space-y-4">
                  <FieldGroup label="Objetivos de Aprendizagem">
                    <Textarea
                      placeholder="Descreva os objetivos de aprendizagem..."
                      value={form.objetivosAprendizagem}
                      onChange={(e) => updateField('objetivosAprendizagem', e.target.value)}
                      rows={4}
                    />
                  </FieldGroup>
                  <FieldGroup label="Metodologias">
                    <Textarea
                      placeholder="Descreva as metodologias de ensino utilizadas..."
                      value={form.metodologias}
                      onChange={(e) => updateField('metodologias', e.target.value)}
                      rows={4}
                    />
                  </FieldGroup>
                </div>
              </FormSection>

              {/* Section 4: Adaptações */}
              <FormSection title="Adaptações Curriculares" icon={Accessibility}>
                <div className="space-y-4">
                  <ToggleRow
                    label="Adaptação Inclusiva"
                    description="Currículo possui adaptações para inclusão escolar"
                    checked={form.adaptacaoInclusiva}
                    onChange={(v) => updateField('adaptacaoInclusiva', v)}
                  />
                  <ToggleRow
                    label="Adaptação para Neurodivergentes"
                    description="Currículo possui adaptações para alunos neurodivergentes"
                    checked={form.adaptacaoNeurodiv}
                    onChange={(v) => updateField('adaptacaoNeurodiv', v)}
                  />
                  {(form.adaptacaoInclusiva || form.adaptacaoNeurodiv) && (
                    <FieldGroup label="Descrição da Adaptação">
                      <Textarea
                        placeholder="Descreva as adaptações curriculares realizadas..."
                        value={form.descricaoAdaptacao}
                        onChange={(e) => updateField('descricaoAdaptacao', e.target.value)}
                        rows={4}
                      />
                    </FieldGroup>
                  )}
                </div>
              </FormSection>

              {/* Section 5: Observações */}
              <FormSection title="Observações" icon={FileText}>
                <FieldGroup label="Observações">
                  <Textarea
                    placeholder="Observações adicionais sobre o currículo..."
                    value={form.observacoes}
                    onChange={(e) => updateField('observacoes', e.target.value)}
                    rows={3}
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
              {editingId ? 'Salvar Alterações' : 'Cadastrar Currículo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
