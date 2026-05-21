'use client'

import { useState, useEffect } from 'react'
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
  ClipboardList,
  Plus,
  Search,
  Filter,
  Save,
  Trash2,
  Edit,
  AlertTriangle,
  Clock,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  fetchStudents,
  fetchRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} from '@/lib/api'
import type { Student, Record } from '@/lib/types'
import {
  TIPO_REGISTRO_OPTIONS,
  CATEGORIA_REGISTRO_OPTIONS,
  PRIORIDADE_OPTIONS,
  STATUS_REGISTRO_OPTIONS,
  AUTHOR_ROLE_OPTIONS,
} from '@/lib/constants'

function getPriorityBadge(prioridade: string | null) {
  if (!prioridade) return <Badge variant="secondary">—</Badge>
  const map: Record<string, string> = {
    Baixa: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Média: 'bg-amber-100 text-amber-700 border-amber-200',
    Alta: 'bg-orange-100 text-orange-700 border-orange-200',
    Urgente: 'bg-red-100 text-red-700 border-red-200',
  }
  return (
    <Badge className={map[prioridade] || 'bg-gray-100 text-gray-700'}>
      {prioridade === 'Urgente' && (
        <AlertTriangle className="w-3 h-3 mr-1" />
      )}
      {prioridade}
    </Badge>
  )
}

function getStatusBadge(status: string | null) {
  if (!status) return <Badge variant="secondary">—</Badge>
  const map: Record<string, string> = {
    Aberto: 'bg-blue-100 text-blue-700 border-blue-200',
    'Em andamento': 'bg-amber-100 text-amber-700 border-amber-200',
    Concluído: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  }
  return <Badge className={map[status] || 'bg-gray-100 text-gray-700'}>{status}</Badge>
}

function getTipoBadge(tipo: string) {
  const map: Record<string, string> = {
    Pedagógica: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Psicológica: 'bg-teal-100 text-teal-700 border-teal-200',
    Comportamental: 'bg-orange-100 text-orange-700 border-orange-200',
    Evolução: 'bg-amber-100 text-amber-700 border-amber-200',
    Familiar: 'bg-pink-100 text-pink-700 border-pink-200',
    Outra: 'bg-gray-100 text-gray-700 border-gray-200',
  }
  return <Badge className={map[tipo] || 'bg-gray-100 text-gray-700'}>{tipo}</Badge>
}

interface FormData {
  studentId: string
  tipo: string
  categoria: string
  titulo: string
  descricao: string
  authorName: string
  authorRole: string
  dataRegistro: string
  prioridade: string
  status: string
}

const defaultFormData: FormData = {
  studentId: '',
  tipo: '',
  categoria: '',
  titulo: '',
  descricao: '',
  authorName: '',
  authorRole: '',
  dataRegistro: new Date().toISOString().split('T')[0],
  prioridade: '',
  status: 'Aberto',
}

export default function RecordsModule() {
  const [records, setRecords] = useState<Record[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Filters
  const [filterStudentId, setFilterStudentId] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterPrioridade, setFilterPrioridade] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  async function loadData() {
    setLoading(true)
    try {
      const [recordsData, studentsData] = await Promise.all([
        fetchRecords({
          studentId: filterStudentId || undefined,
          tipo: filterTipo || undefined,
          prioridade: filterPrioridade || undefined,
          status: filterStatus || undefined,
        }),
        fetchStudents(),
      ])
      setRecords(recordsData)
      setStudents(studentsData)
    } catch {
      toast.error('Erro ao carregar registros')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [filterStudentId, filterTipo, filterPrioridade, filterStatus])

  function handleNew() {
    setFormData({ ...defaultFormData, dataRegistro: new Date().toISOString().split('T')[0] })
    setEditingId(null)
    setShowForm(true)
  }

  function handleEdit(record: Record) {
    setFormData({
      studentId: record.studentId,
      tipo: record.tipo,
      categoria: record.categoria || '',
      titulo: record.titulo,
      descricao: record.descricao,
      authorName: record.authorName || '',
      authorRole: record.authorRole || '',
      dataRegistro: record.dataRegistro?.split('T')[0] || new Date().toISOString().split('T')[0],
      prioridade: record.prioridade || '',
      status: record.status || 'Aberto',
    })
    setEditingId(record.id)
    setShowForm(true)
  }

  async function handleSave() {
    if (!formData.studentId) {
      toast.error('Selecione um aluno')
      return
    }
    if (!formData.tipo) {
      toast.error('Selecione o tipo de registro')
      return
    }
    if (!formData.titulo.trim()) {
      toast.error('Informe o título')
      return
    }
    if (!formData.descricao.trim()) {
      toast.error('Informe a descrição')
      return
    }
    setSaving(true)
    try {
      const payload = {
        studentId: formData.studentId,
        tipo: formData.tipo,
        categoria: formData.categoria || undefined,
        titulo: formData.titulo,
        descricao: formData.descricao,
        authorName: formData.authorName || undefined,
        authorRole: formData.authorRole || undefined,
        dataRegistro: formData.dataRegistro || undefined,
        prioridade: formData.prioridade || undefined,
        status: formData.status || 'Aberto',
      }
      if (editingId) {
        await updateRecord(editingId, payload)
        toast.success('Registro atualizado com sucesso!')
      } else {
        await createRecord(payload)
        toast.success('Registro criado com sucesso!')
      }
      setShowForm(false)
      loadData()
    } catch {
      toast.error('Erro ao salvar registro')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deletingId) return
    try {
      await deleteRecord(deletingId)
      toast.success('Registro excluído com sucesso!')
      setShowDeleteDialog(false)
      setDeletingId(null)
      loadData()
    } catch {
      toast.error('Erro ao excluir registro')
    }
  }

  // Client-side search filter
  const filteredRecords = searchQuery
    ? records.filter(
        (r) =>
          r.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.student?.nomeCompleto || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.authorName || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : records

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Registros e Observações</h2>
            <p className="text-sm text-muted-foreground">
              Acompanhamento pedagógico, psicológico e comportamental
            </p>
          </div>
        </div>
        <Button
          onClick={handleNew}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Registro
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStudentId} onValueChange={setFilterStudentId}>
              <SelectTrigger>
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
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todos os tipos</SelectItem>
                {TIPO_REGISTRO_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPrioridade} onValueChange={setFilterPrioridade}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todas</SelectItem>
                {PRIORIDADE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todos</SelectItem>
                {STATUS_REGISTRO_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Nenhum registro encontrado</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead className="hidden md:table-cell">Aluno</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="hidden sm:table-cell">Prioridade</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Data</TableHead>
                    <TableHead className="w-20">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{record.titulo}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-48">
                            {record.descricao}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm">
                          {record.student?.nomeCompleto || '—'}
                        </span>
                      </TableCell>
                      <TableCell>{getTipoBadge(record.tipo)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {getPriorityBadge(record.prioridade)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {getStatusBadge(record.status)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                        {record.dataRegistro
                          ? new Date(record.dataRegistro).toLocaleDateString('pt-BR')
                          : new Date(record.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleEdit(record)}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-700"
                            onClick={() => {
                              setDeletingId(record.id)
                              setShowDeleteDialog(true)
                            }}
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

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-emerald-600" />
              {editingId ? 'Editar Registro' : 'Novo Registro'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-4 pb-4">
              {/* Student + Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">
                    Aluno <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.studentId}
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, studentId: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.nomeCompleto} ({s.matricula})
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
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, tipo: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPO_REGISTRO_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category + Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Categoria</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, categoria: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIA_REGISTRO_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    Título <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, titulo: e.target.value }))
                    }
                    placeholder="Título do registro"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label className="text-xs">
                  Descrição <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, descricao: e.target.value }))
                  }
                  placeholder="Descreva a observação, intervenção ou avaliação..."
                  rows={4}
                />
              </div>

              <Separator />

              {/* Author info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs flex items-center gap-1">
                    <User className="w-3 h-3" /> Nome do Autor
                  </Label>
                  <Input
                    value={formData.authorName}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, authorName: e.target.value }))
                    }
                    placeholder="Nome de quem registra"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Função do Autor</Label>
                  <Select
                    value={formData.authorRole}
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, authorRole: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUTHOR_ROLE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date + Priority + Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Data Registro
                  </Label>
                  <Input
                    type="date"
                    value={formData.dataRegistro}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, dataRegistro: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Prioridade</Label>
                  <Select
                    value={formData.prioridade}
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, prioridade: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORIDADE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, status: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_REGISTRO_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {saving ? (
                <span className="animate-pulse">Salvando...</span>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Atualizar' : 'Criar'} Registro
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
            Tem certeza que deseja excluir este registro? Esta ação não pode ser
            desfeita.
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
