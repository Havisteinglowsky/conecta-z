// ============================================
// NEUROLYNX - TypeScript Types & Interfaces
// ============================================

// --- Active Module (Navigation) ---
export type ActiveModule =
  | 'dashboard'
  | 'institutions'
  | 'students'
  | 'teachers'
  | 'psychologists'
  | 'companions'
  | 'classes'
  | 'curriculums'
  | 'cognitive-profiles'
  | 'records'
  | 'reports'
  | 'ai-assistant'

// --- Institution ---
export interface Institution {
  id: string
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  codigoInep: string | null
  tipo: string
  dependenciaAdmin: string | null
  rede: string | null
  regulamentacao: string | null
  logo: string | null
  cep: string | null
  logradouro: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  municipio: string | null
  uf: string | null
  pais: string
  telefone: string | null
  telefone2: string | null
  email: string | null
  site: string | null
  nomeDiretor: string | null
  telefoneDiretor: string | null
  emailDiretor: string | null
  modalidades: string | null
  etapas: string | null
  turnos: string | null
  totalSalas: number | null
  capacidadeAlunos: number | null
  laboratorioInformatica: boolean
  biblioteca: boolean
  quadraEsportiva: boolean
  salaRecursos: boolean
  acessibilidade: boolean
  internet: boolean
  ativo: boolean
  createdAt: string
  updatedAt: string
  students?: Student[]
  teachers?: Teacher[]
  psychologists?: Psychologist[]
  classes?: Class[]
  curriculums?: Curriculum[]
}

export interface InstitutionFormData {
  cnpj: string
  razaoSocial: string
  nomeFantasia: string
  codigoInep?: string
  tipo: string
  dependenciaAdmin?: string
  rede?: string
  regulamentacao?: string
  logo?: string
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  municipio?: string
  uf?: string
  pais?: string
  telefone?: string
  telefone2?: string
  email?: string
  site?: string
  nomeDiretor?: string
  telefoneDiretor?: string
  emailDiretor?: string
  modalidades?: string
  etapas?: string
  turnos?: string
  totalSalas?: number
  capacidadeAlunos?: number
  laboratorioInformatica?: boolean
  biblioteca?: boolean
  quadraEsportiva?: boolean
  salaRecursos?: boolean
  acessibilidade?: boolean
  internet?: boolean
  ativo?: boolean
}

// --- Student ---
export interface Student {
  id: string
  institutionId: string
  matricula: string
  nomeCompleto: string
  cpf: string | null
  rg: string | null
  orgaoEmissor: string | null
  ufEmissor: string | null
  dataExpedicao: string | null
  dataNascimento: string
  sexo: string | null
  corRaca: string | null
  nacionalidade: string
  naturalidade: string | null
  paisNascimento: string
  nomePai: string | null
  nomeMae: string | null
  cep: string | null
  logradouro: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  municipio: string | null
  uf: string | null
  telefone: string | null
  celular: string | null
  email: string | null
  responsavelNome: string | null
  responsavelParentesco: string | null
  responsavelCpf: string | null
  responsavelRg: string | null
  responsavelTelefone: string | null
  responsavelEmail: string | null
  responsavelProfissao: string | null
  necessidadeEspecial: boolean
  tipoDeficiencia: string | null
  cid: string | null
  laudoLaee: boolean
  recursosAcessibilidade: string | null
  acomodacoes: string | null
  alergias: string | null
  medicacoes: string | null
  doencasCronicas: string | null
  planoSaude: string | null
  contatoEmergencia: string | null
  tipoSanguineo: string | null
  bolsaFamilia: boolean
  peti: boolean
  outrosProgramas: string | null
  turmaId: string | null
  serieAno: string | null
  turno: string | null
  dataMatricula: string | null
  situacao: string
  modalidade: string | null
  transporteEscolar: boolean
  alimentacao: string | null
  observacoes: string | null
  ativo: boolean
  createdAt: string
  updatedAt: string
  institution?: Institution
  turma?: Class | null
  cognitiveProfiles?: CognitiveProfile[]
  records?: Record[]
  reports?: Report[]
  companionLinks?: StudentCompanion[]
}

export interface StudentFormData {
  institutionId: string
  matricula: string
  nomeCompleto: string
  cpf?: string
  rg?: string
  orgaoEmissor?: string
  ufEmissor?: string
  dataExpedicao?: string
  dataNascimento: string
  sexo?: string
  corRaca?: string
  nacionalidade?: string
  naturalidade?: string
  paisNascimento?: string
  nomePai?: string
  nomeMae?: string
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  municipio?: string
  uf?: string
  telefone?: string
  celular?: string
  email?: string
  responsavelNome?: string
  responsavelParentesco?: string
  responsavelCpf?: string
  responsavelRg?: string
  responsavelTelefone?: string
  responsavelEmail?: string
  responsavelProfissao?: string
  necessidadeEspecial?: boolean
  tipoDeficiencia?: string
  cid?: string
  laudoLaee?: boolean
  recursosAcessibilidade?: string
  acomodacoes?: string
  alergias?: string
  medicacoes?: string
  doencasCronicas?: string
  planoSaude?: string
  contatoEmergencia?: string
  tipoSanguineo?: string
  bolsaFamilia?: boolean
  peti?: boolean
  outrosProgramas?: string
  turmaId?: string
  serieAno?: string
  turno?: string
  dataMatricula?: string
  situacao?: string
  modalidade?: string
  transporteEscolar?: boolean
  alimentacao?: string
  observacoes?: string
  ativo?: boolean
}

// --- Teacher ---
export interface Teacher {
  id: string
  institutionId: string
  matricula: string | null
  nomeCompleto: string
  cpf: string | null
  rg: string | null
  orgaoEmissor: string | null
  dataNascimento: string | null
  sexo: string | null
  corRaca: string | null
  nacionalidade: string
  estadoCivil: string | null
  cep: string | null
  logradouro: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  municipio: string | null
  uf: string | null
  telefone: string | null
  celular: string | null
  email: string | null
  escolaridade: string | null
  cursoGraduacao: string | null
  instituicaoGraduacao: string | null
  anoConclusaoGrad: string | null
  posGraduacao: string | null
  areaPosGraduacao: string | null
  instituicaoPosGrad: string | null
  anoConclusaoPos: string | null
  cargo: string | null
  nivel: string | null
  regimeJuridico: string | null
  cargaHoraria: string | null
  dataAdmissao: string | null
  lotacao: string | null
  disciplinas: string | null
  series: string | null
  especializacaoInclusao: boolean
  especializacaoEspecial: boolean
  cursosCapacitacao: string | null
  ativo: boolean
  createdAt: string
  updatedAt: string
  institution?: Institution
  classes?: Class[]
  records?: Record[]
}

export interface TeacherFormData {
  institutionId: string
  matricula?: string
  nomeCompleto: string
  cpf?: string
  rg?: string
  orgaoEmissor?: string
  dataNascimento?: string
  sexo?: string
  corRaca?: string
  nacionalidade?: string
  estadoCivil?: string
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  municipio?: string
  uf?: string
  telefone?: string
  celular?: string
  email?: string
  escolaridade?: string
  cursoGraduacao?: string
  instituicaoGraduacao?: string
  anoConclusaoGrad?: string
  posGraduacao?: string
  areaPosGraduacao?: string
  instituicaoPosGrad?: string
  anoConclusaoPos?: string
  cargo?: string
  nivel?: string
  regimeJuridico?: string
  cargaHoraria?: string
  dataAdmissao?: string
  lotacao?: string
  disciplinas?: string
  series?: string
  especializacaoInclusao?: boolean
  especializacaoEspecial?: boolean
  cursosCapacitacao?: string
  ativo?: boolean
}

// --- Psychologist ---
export interface Psychologist {
  id: string
  institutionId: string
  nomeCompleto: string
  cpf: string | null
  rg: string | null
  dataNascimento: string | null
  sexo: string | null
  nacionalidade: string
  telefone: string | null
  celular: string | null
  email: string | null
  crp: string | null
  crpUf: string | null
  escolaridade: string | null
  cursoGraduacao: string | null
  instituicaoGraduacao: string | null
  anoConclusao: string | null
  posGraduacao: string | null
  areaEspecializacao: string | null
  abordagemTerapeutica: string | null
  cargo: string | null
  regimeJuridico: string | null
  cargaHoraria: string | null
  dataAdmissao: string | null
  supervisorNome: string | null
  supervisorCrp: string | null
  horarioAtendimento: string | null
  experienciaInclusao: boolean
  experienciaNeurodiv: boolean
  capacitacaoLaee: boolean
  ativo: boolean
  createdAt: string
  updatedAt: string
  institution?: Institution
  records?: Record[]
  reports?: Report[]
}

export interface PsychologistFormData {
  institutionId: string
  nomeCompleto: string
  cpf?: string
  rg?: string
  dataNascimento?: string
  sexo?: string
  nacionalidade?: string
  telefone?: string
  celular?: string
  email?: string
  crp?: string
  crpUf?: string
  escolaridade?: string
  cursoGraduacao?: string
  instituicaoGraduacao?: string
  anoConclusao?: string
  posGraduacao?: string
  areaEspecializacao?: string
  abordagemTerapeutica?: string
  cargo?: string
  regimeJuridico?: string
  cargaHoraria?: string
  dataAdmissao?: string
  supervisorNome?: string
  supervisorCrp?: string
  horarioAtendimento?: string
  experienciaInclusao?: boolean
  experienciaNeurodiv?: boolean
  capacitacaoLaee?: boolean
  ativo?: boolean
}

// --- Companion ---
export interface Companion {
  id: string
  nomeCompleto: string
  cpf: string | null
  rg: string | null
  dataNascimento: string | null
  sexo: string | null
  telefone: string | null
  celular: string | null
  email: string | null
  vinculo: string | null
  formacao: string | null
  registroProfissional: string | null
  funcao: string | null
  cargaHoraria: string | null
  periodo: string | null
  observacoes: string | null
  ativo: boolean
  createdAt: string
  updatedAt: string
  studentLinks?: StudentCompanion[]
}

export interface CompanionFormData {
  nomeCompleto: string
  cpf?: string
  rg?: string
  dataNascimento?: string
  sexo?: string
  telefone?: string
  celular?: string
  email?: string
  vinculo?: string
  formacao?: string
  registroProfissional?: string
  funcao?: string
  cargaHoraria?: string
  periodo?: string
  observacoes?: string
  ativo?: boolean
}

// --- StudentCompanion ---
export interface StudentCompanion {
  id: string
  studentId: string
  companionId: string
  inicio: string | null
  fim: string | null
  observacoes: string | null
  ativo: boolean
  createdAt: string
  updatedAt: string
  student?: Student
  companion?: Companion
}

export interface StudentCompanionFormData {
  studentId: string
  companionId: string
  inicio?: string
  fim?: string
  observacoes?: string
  ativo?: boolean
}

// --- Class ---
export interface Class {
  id: string
  institutionId: string
  nome: string
  serieAno: string | null
  nivel: string | null
  turno: string | null
  sala: string | null
  anoLetivo: string | null
  maxAlunos: number | null
  teacherId: string | null
  ativo: boolean
  createdAt: string
  updatedAt: string
  institution?: Institution
  teacher?: Teacher | null
  students?: Student[]
}

export interface ClassFormData {
  institutionId: string
  nome: string
  serieAno?: string
  nivel?: string
  turno?: string
  sala?: string
  anoLetivo?: string
  maxAlunos?: number
  teacherId?: string
  ativo?: boolean
}

// --- Curriculum ---
export interface Curriculum {
  id: string
  institutionId: string
  nome: string
  anoLetivo: string | null
  nivel: string | null
  serieAno: string | null
  bncc: boolean
  disciplinas: string | null
  competenciasGerais: string | null
  habilidades: string | null
  objetivosAprendizagem: string | null
  metodologias: string | null
  adaptacaoInclusiva: boolean
  adaptacaoNeurodiv: boolean
  descricaoAdaptacao: string | null
  observacoes: string | null
  ativo: boolean
  createdAt: string
  updatedAt: string
  institution?: Institution
}

export interface CurriculumFormData {
  institutionId: string
  nome: string
  anoLetivo?: string
  nivel?: string
  serieAno?: string
  bncc?: boolean
  disciplinas?: string
  competenciasGerais?: string
  habilidades?: string
  objetivosAprendizagem?: string
  metodologias?: string
  adaptacaoInclusiva?: boolean
  adaptacaoNeurodiv?: boolean
  descricaoAdaptacao?: string
  observacoes?: string
  ativo?: boolean
}

// --- CognitiveProfile ---
export interface CognitiveProfile {
  id: string
  studentId: string
  // Perfil Comportamental
  atencao: number | null
  foco: number | null
  impulsividade: number | null
  sociabilidade: number | null
  autonomia: number | null
  motivacao: number | null
  adaptabilidade: number | null
  // Perfil Cognitivo
  memoria: number | null
  raciocinioLogico: number | null
  compreensao: number | null
  velocidadeProcessamento: number | null
  resolucaoProblemas: number | null
  criatividade: number | null
  linguagem: number | null
  // Perfil Pedagógico
  leitura: number | null
  escrita: number | null
  calculo: number | null
  interpretacao: number | null
  producaoTextual: number | null
  // Diagnóstico pedagógico
  dificuldades: string | null
  habilidades: string | null
  estilosAprendizagem: string | null
  estrategiasRecomendadas: string | null
  // Histórico Emocional
  estadoEmocional: string | null
  regressoes: string | null
  observacoesEmocionais: string | null
  // Evolução temporal
  nivelEvolucao: string | null
  dataAvaliacao: string | null
  avaliador: string | null
  observacoes: string | null
  createdAt: string
  updatedAt: string
  student?: Student
}

export interface CognitiveProfileFormData {
  studentId: string
  atencao?: number
  foco?: number
  impulsividade?: number
  sociabilidade?: number
  autonomia?: number
  motivacao?: number
  adaptabilidade?: number
  memoria?: number
  raciocinioLogico?: number
  compreensao?: number
  velocidadeProcessamento?: number
  resolucaoProblemas?: number
  criatividade?: number
  linguagem?: number
  leitura?: number
  escrita?: number
  calculo?: number
  interpretacao?: number
  producaoTextual?: number
  dificuldades?: string
  habilidades?: string
  estilosAprendizagem?: string
  estrategiasRecomendadas?: string
  estadoEmocional?: string
  regressoes?: string
  observacoesEmocionais?: string
  nivelEvolucao?: string
  dataAvaliacao?: string
  avaliador?: string
  observacoes?: string
}

// --- Record ---
export interface Record {
  id: string
  studentId: string
  tipo: string
  categoria: string | null
  titulo: string
  descricao: string
  authorId: string | null
  authorName: string | null
  authorRole: string | null
  dataRegistro: string | null
  prioridade: string | null
  status: string
  createdAt: string
  updatedAt: string
  student?: Student
  teacher?: Teacher | null
  psychologist?: Psychologist | null
}

export interface RecordFormData {
  studentId: string
  tipo: string
  categoria?: string
  titulo: string
  descricao: string
  authorId?: string
  authorName?: string
  authorRole?: string
  dataRegistro?: string
  prioridade?: string
  status?: string
}

// --- Report ---
export interface Report {
  id: string
  studentId: string | null
  psychologistId: string | null
  tipo: string
  titulo: string
  conteudo: string
  periodo: string | null
  dataEmissao: string | null
  geradoPor: string | null
  revisadoPor: string | null
  status: string
  createdAt: string
  updatedAt: string
  student?: Student | null
  psychologist?: Psychologist | null
}

export interface ReportFormData {
  studentId?: string
  psychologistId?: string
  tipo: string
  titulo: string
  conteudo: string
  periodo?: string
  dataEmissao?: string
  geradoPor?: string
  revisadoPor?: string
  status?: string
}

// --- Dashboard Stats ---
export interface DashboardStats {
  totalInstitutions: number
  totalStudents: number
  totalTeachers: number
  totalPsychologists: number
  totalCompanions: number
  totalClasses: number
  totalCurriculums: number
  studentsWithSpecialNeeds: number
  activeRecords: number
  pendingReports: number
  studentsBySituacao: Record<string, number>
  studentsByTurno: Record<string, number>
  recentRecords: Record[]
  recentReports: Report[]
}

// --- API Response Types ---
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
