'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import type { Student, StudentFormData, Institution, Class } from '@/lib/types'
import {
  fetchStudents,
  fetchStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  fetchInstitutions,
  fetchClasses,
} from '@/lib/api'
import {
  UF_LIST,
  COR_RACA_OPTIONS,
  SEXO_OPTIONS,
  NACIONALIDADE_OPTIONS,
  TIPO_DEFICIENCIA_OPTIONS,
  TURNO_OPTIONS,
  SITUACAO_ALUNO_OPTIONS,
  MODALIDADE_OPTIONS,
  PARENTESCO_RESPONSAVEL_OPTIONS,
  ALIMENTACAO_OPTIONS,
  TIPO_SANGUINEO_OPTIONS,
} from '@/lib/constants'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  GraduationCap,
  Search,
  Plus,
  ArrowLeft,
  Save,
  Trash2,
  User,
  MapPin,
  Users,
  Heart,
  Stethoscope,
  HandHeart,
  BookOpen,
  FileText,
  Loader2,
  AlertTriangle,
} from 'lucide-react'

// ─── Default empty form ──────────────────────────────────────────────────────
const emptyForm: StudentFormData = {
  institutionId: '',
  matricula: '',
  nomeCompleto: '',
  cpf: '',
  rg: '',
  orgaoEmissor: '',
  ufEmissor: '',
  dataExpedicao: '',
  dataNascimento: '',
  sexo: '',
  corRaca: '',
  nacionalidade: 'Brasileira',
  naturalidade: '',
  paisNascimento: 'Brasil',
  nomePai: '',
  nomeMae: '',
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
  responsavelNome: '',
  responsavelParentesco: '',
  responsavelCpf: '',
  responsavelRg: '',
  responsavelTelefone: '',
  responsavelEmail: '',
  responsavelProfissao: '',
  necessidadeEspecial: false,
  tipoDeficiencia: '',
  cid: '',
  laudoLaee: false,
  recursosAcessibilidade: '',
  acomodacoes: '',
  alergias: '',
  medicacoes: '',
  doencasCronicas: '',
  planoSaude: '',
  contatoEmergencia: '',
  tipoSanguineo: '',
  bolsaFamilia: false,
  peti: false,
  outrosProgramas: '',
  turmaId: '',
  serieAno: '',
  turno: '',
  dataMatricula: '',
  situacao: 'Ativo',
  modalidade: '',
  transporteEscolar: false,
  alimentacao: '',
  observacoes: '',
  ativo: true,
}

// ─── Situacao color map ──────────────────────────────────────────────────────
const situacaoColors: Record<string, string> = {
  Ativo: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Transferido: 'bg-amber-50 text-amber-700 border-amber-200',
  Evadido: 'bg-red-50 text-red-700 border-red-200',
  Afastado: 'bg-gray-50 text-gray-700 border-gray-200',
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function StudentsModule() {
  const { selectedStudentId, setSelectedStudentId } = useAppStore()

  // List state
  const [students, setStudents] = useState<Student[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterInstitution, setFilterInstitution] = useState('')
  const [filterTurma, setFilterTurma] = useState('')
  const [filterSituacao, setFilterSituacao] = useState('')

  // Form state
  const [formData, setFormData] = useState<StudentFormData>(emptyForm)
  const [formLoading, setFormLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('dados-pessoais')
  const [isNew, setIsNew] = useState(false)

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // ─── Load students list ──────────────────────────────────────────────────
  const loadStudents = useCallback(async () => {
    setLoading(true)
    try {
      const params: Parameters<typeof fetchStudents>[0] = {}
      if (searchTerm) params.search = searchTerm
      if (filterInstitution) params.institutionId = filterInstitution
      if (filterTurma) params.turmaId = filterTurma
      if (filterSituacao) params.situacao = filterSituacao
      const data = await fetchStudents(params)
      setStudents(data)
    } catch {
      toast.error('Erro ao carregar alunos')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filterInstitution, filterTurma, filterSituacao])

  // ─── Load reference data ─────────────────────────────────────────────────
  useEffect(() => {
    fetchInstitutions().then(setInstitutions).catch(() => {})
    fetchClasses().then(setClasses).catch(() => {})
  }, [])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  // ─── Load student for editing ────────────────────────────────────────────
  useEffect(() => {
    if (selectedStudentId) {
      setFormLoading(true)
      fetchStudent(selectedStudentId)
        .then((s) => {
          setFormData({
            institutionId: s.institutionId,
            matricula: s.matricula,
            nomeCompleto: s.nomeCompleto,
            cpf: s.cpf || '',
            rg: s.rg || '',
            orgaoEmissor: s.orgaoEmissor || '',
            ufEmissor: s.ufEmissor || '',
            dataExpedicao: s.dataExpedicao ? s.dataExpedicao.split('T')[0] : '',
            dataNascimento: s.dataNascimento ? s.dataNascimento.split('T')[0] : '',
            sexo: s.sexo || '',
            corRaca: s.corRaca || '',
            nacionalidade: s.nacionalidade || 'Brasileira',
            naturalidade: s.naturalidade || '',
            paisNascimento: s.paisNascimento || 'Brasil',
            nomePai: s.nomePai || '',
            nomeMae: s.nomeMae || '',
            cep: s.cep || '',
            logradouro: s.logradouro || '',
            numero: s.numero || '',
            complemento: s.complemento || '',
            bairro: s.bairro || '',
            municipio: s.municipio || '',
            uf: s.uf || '',
            telefone: s.telefone || '',
            celular: s.celular || '',
            email: s.email || '',
            responsavelNome: s.responsavelNome || '',
            responsavelParentesco: s.responsavelParentesco || '',
            responsavelCpf: s.responsavelCpf || '',
            responsavelRg: s.responsavelRg || '',
            responsavelTelefone: s.responsavelTelefone || '',
            responsavelEmail: s.responsavelEmail || '',
            responsavelProfissao: s.responsavelProfissao || '',
            necessidadeEspecial: s.necessidadeEspecial,
            tipoDeficiencia: s.tipoDeficiencia || '',
            cid: s.cid || '',
            laudoLaee: s.laudoLaee,
            recursosAcessibilidade: s.recursosAcessibilidade || '',
            acomodacoes: s.acomodacoes || '',
            alergias: s.alergias || '',
            medicacoes: s.medicacoes || '',
            doencasCronicas: s.doencasCronicas || '',
            planoSaude: s.planoSaude || '',
            contatoEmergencia: s.contatoEmergencia || '',
            tipoSanguineo: s.tipoSanguineo || '',
            bolsaFamilia: s.bolsaFamilia,
            peti: s.peti,
            outrosProgramas: s.outrosProgramas || '',
            turmaId: s.turmaId || '',
            serieAno: s.serieAno || '',
            turno: s.turno || '',
            dataMatricula: s.dataMatricula ? s.dataMatricula.split('T')[0] : '',
            situacao: s.situacao || 'Ativo',
            modalidade: s.modalidade || '',
            transporteEscolar: s.transporteEscolar,
            alimentacao: s.alimentacao || '',
            observacoes: s.observacoes || '',
            ativo: s.ativo,
          })
          setIsNew(false)
        })
        .catch(() => toast.error('Erro ao carregar dados do aluno'))
        .finally(() => setFormLoading(false))
    } else {
      setFormData(emptyForm)
      setIsNew(true)
    }
  }, [selectedStudentId])

  // ─── Form helpers ────────────────────────────────────────────────────────
  const updateField = <K extends keyof StudentFormData>(key: K, value: StudentFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleDeficienciaToggle = (value: string, checked: boolean) => {
    const current = formData.tipoDeficiencia ? formData.tipoDeficiencia.split(',').filter(Boolean) : []
    const updated = checked ? [...current, value] : current.filter((v) => v !== value)
    updateField('tipoDeficiencia', updated.join(','))
  }

  // ─── Save ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!formData.nomeCompleto.trim()) {
      toast.error('Nome Completo é obrigatório')
      return
    }
    if (!formData.dataNascimento) {
      toast.error('Data de Nascimento é obrigatória')
      return
    }
    if (!formData.institutionId) {
      toast.error('Instituição é obrigatória')
      return
    }
    if (!formData.matricula.trim()) {
      toast.error('Matrícula é obrigatória')
      return
    }

    setSaving(true)
    try {
      if (isNew) {
        const created = await createStudent(formData)
        setSelectedStudentId(created.id)
        toast.success('Aluno cadastrado com sucesso!')
      } else if (selectedStudentId) {
        await updateStudent(selectedStudentId, formData)
        toast.success('Dados atualizados com sucesso!')
      }
      loadStudents()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar dados'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  // ─── Delete ──────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteStudent(deleteId)
      toast.success('Aluno removido com sucesso')
      setDeleteDialogOpen(false)
      setDeleteId(null)
      if (selectedStudentId === deleteId) {
        setSelectedStudentId(null)
      }
      loadStudents()
    } catch {
      toast.error('Erro ao remover aluno')
    }
  }

  const openNewStudent = () => {
    setSelectedStudentId(null)
    setFormData(emptyForm)
    setIsNew(true)
    setActiveTab('dados-pessoais')
  }

  // ─── Filtered classes based on institution ───────────────────────────────
  const filteredClasses = filterInstitution
    ? classes.filter((c) => c.institutionId === filterInstitution)
    : classes

  const formClasses = formData.institutionId
    ? classes.filter((c) => c.institutionId === formData.institutionId)
    : classes

  // ═════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ═════════════════════════════════════════════════════════════════════════
  if (!selectedStudentId && !isNew) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Alunos</h2>
              <p className="text-sm text-muted-foreground">Ficha Cadastral Completa</p>
            </div>
          </div>
          <Button
            onClick={openNewStudent}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Aluno
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou matrícula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={filterInstitution} onValueChange={(v) => { setFilterInstitution(v === '__all__' ? '' : v); setFilterTurma('') }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Instituição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todas as instituições</SelectItem>
                  {institutions.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.nomeFantasia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterTurma} onValueChange={(v) => setFilterTurma(v === '__all__' ? '' : v)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todas as turmas</SelectItem>
                  {filteredClasses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterSituacao} onValueChange={(v) => setFilterSituacao(v === '__all__' ? '' : v)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todas</SelectItem>
                  {SITUACAO_ALUNO_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : students.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">Nenhum aluno encontrado</p>
                <p className="text-sm mt-1">Clique em &quot;Novo Aluno&quot; para cadastrar o primeiro aluno</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[120px]">Matrícula</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">Série</TableHead>
                      <TableHead className="hidden sm:table-cell">Turno</TableHead>
                      <TableHead>Situação</TableHead>
                      <TableHead className="hidden lg:table-cell">NEE</TableHead>
                      <TableHead className="w-[80px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((s) => (
                      <TableRow
                        key={s.id}
                        className="cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors"
                        onClick={() => setSelectedStudentId(s.id)}
                      >
                        <TableCell className="font-mono text-sm">{s.matricula}</TableCell>
                        <TableCell className="font-medium">{s.nomeCompleto}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{s.serieAno || '—'}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{s.turno || '—'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={situacaoColors[s.situacao] || 'bg-gray-50 text-gray-700 border-gray-200'}>
                            {s.situacao}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {s.necessidadeEspecial ? (
                            <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100">
                              Sim
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">Não</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteId(s.id)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Confirmar Exclusão
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja remover este aluno? Esta ação não pode ser desfeita.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Remover
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════════════════
  // DETAIL / FORM VIEW
  // ═════════════════════════════════════════════════════════════════════════
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setSelectedStudentId(null)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              {isNew ? 'Novo Aluno' : formData.nomeCompleto || 'Carregando...'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isNew ? 'Preencha os dados do aluno' : `Matrícula: ${formData.matricula}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
              onClick={() => {
                setDeleteId(selectedStudentId)
                setDeleteDialogOpen(true)
              }}
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Excluir</span>
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      {/* Form Content */}
      {formLoading ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="w-full overflow-x-auto">
            <TabsList className="w-full inline-flex h-auto p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="dados-pessoais" className="gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2">
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dados Pessoais</span>
                <span className="sm:hidden">Pessoal</span>
              </TabsTrigger>
              <TabsTrigger value="endereco" className="gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2">
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Endereço & Contato</span>
                <span className="sm:hidden">Endereço</span>
              </TabsTrigger>
              <TabsTrigger value="responsavel" className="gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2">
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Responsável</span>
                <span className="sm:hidden">Resp.</span>
              </TabsTrigger>
              <TabsTrigger value="nee" className="gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2">
                <Heart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Educação Especial / NEE</span>
                <span className="sm:hidden">NEE</span>
              </TabsTrigger>
              <TabsTrigger value="saude" className="gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Saúde</span>
              </TabsTrigger>
              <TabsTrigger value="sociais" className="gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2">
                <HandHeart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Programas Sociais</span>
                <span className="sm:hidden">Sociais</span>
              </TabsTrigger>
              <TabsTrigger value="escolares" className="gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dados Escolares</span>
                <span className="sm:hidden">Escolar</span>
              </TabsTrigger>
              <TabsTrigger value="observacoes" className="gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Obs.</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ─── Tab 1: Dados Pessoais ──────────────────────────────────────── */}
          <TabsContent value="dados-pessoais">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Institution & Matricula */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Instituição <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.institutionId} onValueChange={(v) => updateField('institutionId', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions.map((i) => (
                          <SelectItem key={i.id} value={i.id}>
                            {i.nomeFantasia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Matrícula <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.matricula}
                      onChange={(e) => updateField('matricula', e.target.value)}
                      placeholder="Nº da matrícula"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Nome Completo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.nomeCompleto}
                      onChange={(e) => updateField('nomeCompleto', e.target.value)}
                      placeholder="Nome completo do aluno"
                    />
                  </div>
                </div>

                <Separator />

                {/* Documentos */}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">Documentos</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">CPF</Label>
                      <Input value={formData.cpf || ''} onChange={(e) => updateField('cpf', e.target.value)} placeholder="000.000.000-00" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">RG</Label>
                      <Input value={formData.rg || ''} onChange={(e) => updateField('rg', e.target.value)} placeholder="Nº do RG" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Órgão Emissor</Label>
                      <Input value={formData.orgaoEmissor || ''} onChange={(e) => updateField('orgaoEmissor', e.target.value)} placeholder="SSP" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">UF Emissor</Label>
                      <Select value={formData.ufEmissor || ''} onValueChange={(v) => updateField('ufEmissor', v === '__none__' ? '' : v)}>
                        <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">Nenhum</SelectItem>
                          {UF_LIST.map((uf) => <SelectItem key={uf.value} value={uf.value}>{uf.value} - {uf.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Data Expedição</Label>
                      <Input type="date" value={formData.dataExpedicao || ''} onChange={(e) => updateField('dataExpedicao', e.target.value)} />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Nascimento & Demográficos */}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">Nascimento & Demografia</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Data Nascimento <span className="text-red-500">*</span>
                      </Label>
                      <Input type="date" value={formData.dataNascimento || ''} onChange={(e) => updateField('dataNascimento', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Sexo</Label>
                      <Select value={formData.sexo || ''} onValueChange={(v) => updateField('sexo', v === '__none__' ? '' : v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">Não informado</SelectItem>
                          {SEXO_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Cor/Raça</Label>
                      <Select value={formData.corRaca || ''} onValueChange={(v) => updateField('corRaca', v === '__none__' ? '' : v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">Não informado</SelectItem>
                          {COR_RACA_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Nacionalidade</Label>
                      <Select value={formData.nacionalidade || 'Brasileira'} onValueChange={(v) => updateField('nacionalidade', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {NACIONALIDADE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Naturalidade</Label>
                      <Input value={formData.naturalidade || ''} onChange={(e) => updateField('naturalidade', e.target.value)} placeholder="Cidade natal" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">País Nascimento</Label>
                      <Input value={formData.paisNascimento || ''} onChange={(e) => updateField('paisNascimento', e.target.value)} placeholder="Brasil" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Filiação */}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">Filiação</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Nome do Pai</Label>
                      <Input value={formData.nomePai || ''} onChange={(e) => updateField('nomePai', e.target.value)} placeholder="Nome completo do pai" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Nome da Mãe</Label>
                      <Input value={formData.nomeMae || ''} onChange={(e) => updateField('nomeMae', e.target.value)} placeholder="Nome completo da mãe" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Tab 2: Endereço & Contato ──────────────────────────────────── */}
          <TabsContent value="endereco">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Endereço & Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">CEP</Label>
                    <Input value={formData.cep || ''} onChange={(e) => updateField('cep', e.target.value)} placeholder="00000-000" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm">Logradouro</Label>
                    <Input value={formData.logradouro || ''} onChange={(e) => updateField('logradouro', e.target.value)} placeholder="Rua, Avenida..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Número</Label>
                    <Input value={formData.numero || ''} onChange={(e) => updateField('numero', e.target.value)} placeholder="Nº" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Complemento</Label>
                    <Input value={formData.complemento || ''} onChange={(e) => updateField('complemento', e.target.value)} placeholder="Apto, Bloco..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Bairro</Label>
                    <Input value={formData.bairro || ''} onChange={(e) => updateField('bairro', e.target.value)} placeholder="Bairro" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Município</Label>
                    <Input value={formData.municipio || ''} onChange={(e) => updateField('municipio', e.target.value)} placeholder="Cidade" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">UF</Label>
                    <Select value={formData.uf || ''} onValueChange={(v) => updateField('uf', v === '__none__' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Nenhum</SelectItem>
                        {UF_LIST.map((uf) => <SelectItem key={uf.value} value={uf.value}>{uf.value} - {uf.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Telefone</Label>
                    <Input value={formData.telefone || ''} onChange={(e) => updateField('telefone', e.target.value)} placeholder="(00) 0000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Celular</Label>
                    <Input value={formData.celular || ''} onChange={(e) => updateField('celular', e.target.value)} placeholder="(00) 00000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Email</Label>
                    <Input type="email" value={formData.email || ''} onChange={(e) => updateField('email', e.target.value)} placeholder="email@exemplo.com" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Tab 3: Responsável Legal ───────────────────────────────────── */}
          <TabsContent value="responsavel">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Responsável Legal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm">Nome</Label>
                    <Input value={formData.responsavelNome || ''} onChange={(e) => updateField('responsavelNome', e.target.value)} placeholder="Nome completo do responsável" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Parentesco</Label>
                    <Select value={formData.responsavelParentesco || ''} onValueChange={(v) => updateField('responsavelParentesco', v === '__none__' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Não informado</SelectItem>
                        {PARENTESCO_RESPONSAVEL_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">CPF</Label>
                    <Input value={formData.responsavelCpf || ''} onChange={(e) => updateField('responsavelCpf', e.target.value)} placeholder="000.000.000-00" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">RG</Label>
                    <Input value={formData.responsavelRg || ''} onChange={(e) => updateField('responsavelRg', e.target.value)} placeholder="Nº do RG" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Telefone</Label>
                    <Input value={formData.responsavelTelefone || ''} onChange={(e) => updateField('responsavelTelefone', e.target.value)} placeholder="(00) 00000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Email</Label>
                    <Input type="email" value={formData.responsavelEmail || ''} onChange={(e) => updateField('responsavelEmail', e.target.value)} placeholder="email@exemplo.com" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Profissão</Label>
                    <Input value={formData.responsavelProfissao || ''} onChange={(e) => updateField('responsavelProfissao', e.target.value)} placeholder="Profissão" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Tab 4: Educação Especial / NEE ─────────────────────────────── */}
          <TabsContent value="nee">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  Educação Especial / NEE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <div>
                    <Label className="text-sm font-medium">Necessidade Especial</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">O aluno possui alguma necessidade educacional especial?</p>
                  </div>
                  <Switch
                    checked={formData.necessidadeEspecial}
                    onCheckedChange={(v) => {
                      updateField('necessidadeEspecial', v)
                      if (!v) {
                        updateField('tipoDeficiencia', '')
                        updateField('cid', '')
                        updateField('laudoLaee', false)
                        updateField('recursosAcessibilidade', '')
                        updateField('acomodacoes', '')
                      }
                    }}
                  />
                </div>

                {formData.necessidadeEspecial && (
                  <>
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Tipo de Deficiência</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {TIPO_DEFICIENCIA_OPTIONS.map((opt) => {
                          const checked = formData.tipoDeficiencia
                            ? formData.tipoDeficiencia.split(',').includes(opt.value)
                            : false
                          return (
                            <label
                              key={opt.value}
                              className="flex items-center gap-2 p-3 rounded-lg border border-border/50 hover:bg-emerald-50/50 cursor-pointer transition-colors"
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(c) => handleDeficienciaToggle(opt.value, !!c)}
                              />
                              <span className="text-sm">{opt.label}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">CID</Label>
                        <Input value={formData.cid || ''} onChange={(e) => updateField('cid', e.target.value)} placeholder="Código CID" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                        <div>
                          <Label className="text-sm font-medium">Laudo LAEE</Label>
                          <p className="text-xs text-muted-foreground">Possui laudo de LAEE?</p>
                        </div>
                        <Switch
                          checked={formData.laudoLaee}
                          onCheckedChange={(v) => updateField('laudoLaee', v)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Recursos de Acessibilidade</Label>
                      <Textarea
                        value={formData.recursosAcessibilidade || ''}
                        onChange={(e) => updateField('recursosAcessibilidade', e.target.value)}
                        placeholder="Descreva os recursos de acessibilidade necessários..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Acomodações</Label>
                      <Textarea
                        value={formData.acomodacoes || ''}
                        onChange={(e) => updateField('acomodacoes', e.target.value)}
                        placeholder="Descreva as acomodações necessárias..."
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Tab 5: Saúde ───────────────────────────────────────────────── */}
          <TabsContent value="saude">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  Saúde
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Alergias</Label>
                    <Textarea
                      value={formData.alergias || ''}
                      onChange={(e) => updateField('alergias', e.target.value)}
                      placeholder="Descreva alergias conhecidas..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Medicações</Label>
                    <Textarea
                      value={formData.medicacoes || ''}
                      onChange={(e) => updateField('medicacoes', e.target.value)}
                      placeholder="Medicações em uso..."
                      rows={2}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Doenças Crônicas</Label>
                    <Textarea
                      value={formData.doencasCronicas || ''}
                      onChange={(e) => updateField('doencasCronicas', e.target.value)}
                      placeholder="Doenças crônicas conhecidas..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Plano de Saúde</Label>
                    <Input
                      value={formData.planoSaude || ''}
                      onChange={(e) => updateField('planoSaude', e.target.value)}
                      placeholder="Nome do plano de saúde"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Contato de Emergência</Label>
                    <Input
                      value={formData.contatoEmergencia || ''}
                      onChange={(e) => updateField('contatoEmergencia', e.target.value)}
                      placeholder="Nome - Telefone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Tipo Sanguíneo</Label>
                    <Select value={formData.tipoSanguineo || ''} onValueChange={(v) => updateField('tipoSanguineo', v === '__none__' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Não informado</SelectItem>
                        {TIPO_SANGUINEO_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Tab 6: Programas Sociais ───────────────────────────────────── */}
          <TabsContent value="sociais">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <HandHeart className="w-4 h-4 text-emerald-600" />
                  Programas Sociais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <div>
                    <Label className="text-sm font-medium">Bolsa Família</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">O aluno é beneficiário do Bolsa Família?</p>
                  </div>
                  <Switch
                    checked={formData.bolsaFamilia}
                    onCheckedChange={(v) => updateField('bolsaFamilia', v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                  <div>
                    <Label className="text-sm font-medium">PETI</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">O aluno participa do PETI (Programa de Erradicação do Trabalho Infantil)?</p>
                  </div>
                  <Switch
                    checked={formData.peti}
                    onCheckedChange={(v) => updateField('peti', v)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Outros Programas</Label>
                  <Textarea
                    value={formData.outrosProgramas || ''}
                    onChange={(e) => updateField('outrosProgramas', e.target.value)}
                    placeholder="Descreva outros programas sociais..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Tab 7: Dados Escolares ─────────────────────────────────────── */}
          <TabsContent value="escolares">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Dados Escolares
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Instituição</Label>
                    <Select value={formData.institutionId} onValueChange={(v) => { updateField('institutionId', v); updateField('turmaId', '') }}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {institutions.map((i) => <SelectItem key={i.id} value={i.id}>{i.nomeFantasia}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Turma</Label>
                    <Select value={formData.turmaId || ''} onValueChange={(v) => updateField('turmaId', v === '__none__' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Sem turma</SelectItem>
                        {formClasses.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome} {c.serieAno ? `- ${c.serieAno}` : ''}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Série/Ano</Label>
                    <Input value={formData.serieAno || ''} onChange={(e) => updateField('serieAno', e.target.value)} placeholder="Ex: 6º Ano" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Turno</Label>
                    <Select value={formData.turno || ''} onValueChange={(v) => updateField('turno', v === '__none__' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Não informado</SelectItem>
                        {TURNO_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Data Matrícula</Label>
                    <Input type="date" value={formData.dataMatricula || ''} onChange={(e) => updateField('dataMatricula', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Situação</Label>
                    <Select value={formData.situacao || 'Ativo'} onValueChange={(v) => updateField('situacao', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SITUACAO_ALUNO_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Modalidade</Label>
                    <Select value={formData.modalidade || ''} onValueChange={(v) => updateField('modalidade', v === '__none__' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Não informado</SelectItem>
                        {MODALIDADE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                    <div>
                      <Label className="text-sm font-medium">Transporte Escolar</Label>
                      <p className="text-xs text-muted-foreground">Utiliza transporte escolar?</p>
                    </div>
                    <Switch
                      checked={formData.transporteEscolar}
                      onCheckedChange={(v) => updateField('transporteEscolar', v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Alimentação</Label>
                    <Select value={formData.alimentacao || ''} onValueChange={(v) => updateField('alimentacao', v === '__none__' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Não informado</SelectItem>
                        {ALIMENTACAO_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Tab 8: Observações ─────────────────────────────────────────── */}
          <TabsContent value="observacoes">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Observações Gerais</Label>
                  <Textarea
                    value={formData.observacoes || ''}
                    onChange={(e) => updateField('observacoes', e.target.value)}
                    placeholder="Registre aqui observações gerais sobre o aluno, informações adicionais, contextos familiares, etc..."
                    rows={12}
                    className="min-h-[200px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Floating Save Button (mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-2xl shadow-emerald-500/40"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        </Button>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Confirmar Exclusão
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja remover este aluno? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
