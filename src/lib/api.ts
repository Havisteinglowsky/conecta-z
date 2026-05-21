import type {
  Institution,
  InstitutionFormData,
  Student,
  StudentFormData,
  Teacher,
  TeacherFormData,
  Psychologist,
  PsychologistFormData,
  Companion,
  CompanionFormData,
  StudentCompanion,
  StudentCompanionFormData,
  Class,
  ClassFormData,
  Curriculum,
  CurriculumFormData,
  CognitiveProfile,
  CognitiveProfileFormData,
  Record,
  RecordFormData,
  Report,
  ReportFormData,
  DashboardStats,
  ApiResponse,
} from './types'

// ---- Helper ----

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erro na requisição' }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }

  return res.json()
}

// ---- Dashboard ----

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return request<DashboardStats>('/api/dashboard')
}

// ---- Institutions ----

export async function fetchInstitutions(search?: string): Promise<Institution[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : ''
  return request<Institution[]>(`/api/institutions${params}`)
}

export async function fetchInstitution(id: string): Promise<Institution> {
  return request<Institution>(`/api/institutions/${id}`)
}

export async function createInstitution(data: InstitutionFormData): Promise<Institution> {
  return request<Institution>('/api/institutions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateInstitution(id: string, data: Partial<InstitutionFormData>): Promise<Institution> {
  return request<Institution>(`/api/institutions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteInstitution(id: string): Promise<ApiResponse<{ id: string }>> {
  return request<ApiResponse<{ id: string }>>(`/api/institutions/${id}`, {
    method: 'DELETE',
  })
}

// ---- Students ----

export async function fetchStudents(params?: {
  search?: string
  institutionId?: string
  turmaId?: string
  situacao?: string
}): Promise<Student[]> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set('search', params.search)
  if (params?.institutionId) searchParams.set('institutionId', params.institutionId)
  if (params?.turmaId) searchParams.set('turmaId', params.turmaId)
  if (params?.situacao) searchParams.set('situacao', params.situacao)
  const qs = searchParams.toString()
  return request<Student[]>(`/api/students${qs ? `?${qs}` : ''}`)
}

export async function fetchStudent(id: string): Promise<Student> {
  return request<Student>(`/api/students/${id}`)
}

export async function createStudent(data: StudentFormData): Promise<Student> {
  return request<Student>('/api/students', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateStudent(id: string, data: Partial<StudentFormData>): Promise<Student> {
  return request<Student>(`/api/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteStudent(id: string): Promise<ApiResponse<{ id: string }>> {
  return request<ApiResponse<{ id: string }>>(`/api/students/${id}`, {
    method: 'DELETE',
  })
}

// ---- Teachers ----

export async function fetchTeachers(params?: {
  search?: string
  institutionId?: string
}): Promise<Teacher[]> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set('search', params.search)
  if (params?.institutionId) searchParams.set('institutionId', params.institutionId)
  const qs = searchParams.toString()
  return request<Teacher[]>(`/api/teachers${qs ? `?${qs}` : ''}`)
}

export async function fetchTeacher(id: string): Promise<Teacher> {
  return request<Teacher>(`/api/teachers/${id}`)
}

export async function createTeacher(data: TeacherFormData): Promise<Teacher> {
  return request<Teacher>('/api/teachers', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateTeacher(id: string, data: Partial<TeacherFormData>): Promise<Teacher> {
  return request<Teacher>(`/api/teachers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteTeacher(id: string): Promise<ApiResponse<{ id: string }>> {
  return request<ApiResponse<{ id: string }>>(`/api/teachers/${id}`, {
    method: 'DELETE',
  })
}

// ---- Psychologists ----

export async function fetchPsychologists(params?: {
  search?: string
  institutionId?: string
}): Promise<Psychologist[]> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set('search', params.search)
  if (params?.institutionId) searchParams.set('institutionId', params.institutionId)
  const qs = searchParams.toString()
  return request<Psychologist[]>(`/api/psychologists${qs ? `?${qs}` : ''}`)
}

export async function fetchPsychologist(id: string): Promise<Psychologist> {
  return request<Psychologist>(`/api/psychologists/${id}`)
}

export async function createPsychologist(data: PsychologistFormData): Promise<Psychologist> {
  return request<Psychologist>('/api/psychologists', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updatePsychologist(id: string, data: Partial<PsychologistFormData>): Promise<Psychologist> {
  return request<Psychologist>(`/api/psychologists/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deletePsychologist(id: string): Promise<ApiResponse<{ id: string }>> {
  return request<ApiResponse<{ id: string }>>(`/api/psychologists/${id}`, {
    method: 'DELETE',
  })
}

// ---- Companions ----

export async function fetchCompanions(search?: string): Promise<Companion[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : ''
  return request<Companion[]>(`/api/companions${params}`)
}

export async function fetchCompanion(id: string): Promise<Companion> {
  return request<Companion>(`/api/companions/${id}`)
}

export async function createCompanion(data: CompanionFormData): Promise<Companion> {
  return request<Companion>('/api/companions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateCompanion(id: string, data: Partial<CompanionFormData>): Promise<Companion> {
  return request<Companion>(`/api/companions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteCompanion(id: string): Promise<ApiResponse<{ id: string }>> {
  return request<ApiResponse<{ id: string }>>(`/api/companions/${id}`, {
    method: 'DELETE',
  })
}

// ---- StudentCompanions ----

export async function fetchStudentCompanions(studentId?: string): Promise<StudentCompanion[]> {
  const params = studentId ? `?studentId=${encodeURIComponent(studentId)}` : ''
  return request<StudentCompanion[]>(`/api/student-companions${params}`)
}

export async function createStudentCompanion(data: StudentCompanionFormData): Promise<StudentCompanion> {
  return request<StudentCompanion>('/api/student-companions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateStudentCompanion(id: string, data: Partial<StudentCompanionFormData>): Promise<StudentCompanion> {
  return request<StudentCompanion>(`/api/student-companions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteStudentCompanion(id: string): Promise<ApiResponse<{ id: string }>> {
  return request<ApiResponse<{ id: string }>>(`/api/student-companions/${id}`, {
    method: 'DELETE',
  })
}

// ---- Classes ----

export async function fetchClasses(params?: {
  search?: string
  institutionId?: string
}): Promise<Class[]> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set('search', params.search)
  if (params?.institutionId) searchParams.set('institutionId', params.institutionId)
  const qs = searchParams.toString()
  return request<Class[]>(`/api/classes${qs ? `?${qs}` : ''}`)
}

export async function fetchClass(id: string): Promise<Class> {
  return request<Class>(`/api/classes/${id}`)
}

export async function createClass(data: ClassFormData): Promise<Class> {
  return request<Class>('/api/classes', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateClass(id: string, data: Partial<ClassFormData>): Promise<Class> {
  return request<Class>(`/api/classes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteClass(id: string): Promise<ApiResponse<{ id: string }>> {
  return request<ApiResponse<{ id: string }>>(`/api/classes/${id}`, {
    method: 'DELETE',
  })
}

// ---- Curriculums ----

export async function fetchCurriculums(params?: {
  search?: string
  institutionId?: string
}): Promise<Curriculum[]> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set('search', params.search)
  if (params?.institutionId) searchParams.set('institutionId', params.institutionId)
  const qs = searchParams.toString()
  return request<Curriculum[]>(`/api/curriculums${qs ? `?${qs}` : ''}`)
}

export async function fetchCurriculum(id: string): Promise<Curriculum> {
  return request<Curriculum>(`/api/curriculums/${id}`)
}

export async function createCurriculum(data: CurriculumFormData): Promise<Curriculum> {
  return request<Curriculum>('/api/curriculums', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateCurriculum(id: string, data: Partial<CurriculumFormData>): Promise<Curriculum> {
  return request<Curriculum>(`/api/curriculums/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteCurriculum(id: string): Promise<ApiResponse<{ id: string }>> {
  return request<ApiResponse<{ id: string }>>(`/api/curriculums/${id}`, {
    method: 'DELETE',
  })
}

// ---- Cognitive Profiles ----

export async function fetchCognitiveProfiles(studentId?: string): Promise<CognitiveProfile[]> {
  const params = studentId ? `?studentId=${encodeURIComponent(studentId)}` : ''
  return request<CognitiveProfile[]>(`/api/cognitive-profiles${params}`)
}

export async function fetchCognitiveProfile(id: string): Promise<CognitiveProfile> {
  return request<CognitiveProfile>(`/api/cognitive-profiles/${id}`)
}

export async function createCognitiveProfile(data: CognitiveProfileFormData): Promise<CognitiveProfile> {
  return request<CognitiveProfile>('/api/cognitive-profiles', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateCognitiveProfile(id: string, data: Partial<CognitiveProfileFormData>): Promise<CognitiveProfile> {
  return request<CognitiveProfile>(`/api/cognitive-profiles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteCognitiveProfile(id: string): Promise<ApiResponse<{ id: string }>> {
  return request<ApiResponse<{ id: string }>>(`/api/cognitive-profiles/${id}`, {
    method: 'DELETE',
  })
}

// ---- Records ----

export async function fetchRecords(params?: {
  search?: string
  studentId?: string
  tipo?: string
  prioridade?: string
  status?: string
}): Promise<Record[]> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set('search', params.search)
  if (params?.studentId) searchParams.set('studentId', params.studentId)
  if (params?.tipo) searchParams.set('tipo', params.tipo)
  if (params?.prioridade) searchParams.set('prioridade', params.prioridade)
  if (params?.status) searchParams.set('status', params.status)
  const qs = searchParams.toString()
  return request<Record[]>(`/api/records${qs ? `?${qs}` : ''}`)
}

export async function fetchRecord(id: string): Promise<Record> {
  return request<Record>(`/api/records/${id}`)
}

export async function createRecord(data: RecordFormData): Promise<Record> {
  return request<Record>('/api/records', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateRecord(id: string, data: Partial<RecordFormData>): Promise<Record> {
  return request<Record>(`/api/records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteRecord(id: string): Promise<ApiResponse<{ id: string }>> {
  return request<ApiResponse<{ id: string }>>(`/api/records/${id}`, {
    method: 'DELETE',
  })
}

// ---- Reports ----

export async function fetchReports(params?: {
  search?: string
  studentId?: string
  psychologistId?: string
  tipo?: string
  status?: string
}): Promise<Report[]> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set('search', params.search)
  if (params?.studentId) searchParams.set('studentId', params.studentId)
  if (params?.psychologistId) searchParams.set('psychologistId', params.psychologistId)
  if (params?.tipo) searchParams.set('tipo', params.tipo)
  if (params?.status) searchParams.set('status', params.status)
  const qs = searchParams.toString()
  return request<Report[]>(`/api/reports${qs ? `?${qs}` : ''}`)
}

export async function fetchReport(id: string): Promise<Report> {
  return request<Report>(`/api/reports/${id}`)
}

export async function createReport(data: ReportFormData): Promise<Report> {
  return request<Report>('/api/reports', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateReport(id: string, data: Partial<ReportFormData>): Promise<Report> {
  return request<Report>(`/api/reports/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteReport(id: string): Promise<ApiResponse<{ id: string }>> {
  return request<ApiResponse<{ id: string }>>(`/api/reports/${id}`, {
    method: 'DELETE',
  })
}
