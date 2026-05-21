---
Task ID: 2
Agent: API Routes Builder
Task: Create all API routes for CRUD operations

Work Log:
- Created 23 API route files covering all 10 Prisma models plus dashboard stats
- Institutions: GET (list with search), POST (create) + GET/PUT/DELETE by ID (soft delete)
- Students: GET (list with search, institutionId, turmaId), POST + GET (with relations: institution, turma, cognitiveProfiles, companionLinks.companion), PUT, DELETE (soft delete)
- Teachers: GET (list with search, institutionId), POST + GET (with institution & classes), PUT, DELETE (soft delete)
- Psychologists: GET (list with search, institutionId), POST + GET (with institution), PUT, DELETE (soft delete)
- Companions: GET (list with search), POST + GET (with studentLinks), PUT, DELETE (soft delete)
- Student Companions: GET (list by studentId), POST + PUT, DELETE (hard delete)
- Classes: GET (list with institutionId, search), POST + GET (with students, teacher, institution), PUT, DELETE (soft delete)
- Curriculums: GET (list with institutionId), POST + GET/PUT/DELETE by ID (soft delete)
- Cognitive Profiles: GET (list with studentId), POST + GET (with student), PUT, DELETE (hard delete)
- Records: GET (list with studentId, tipo, authorId), POST + GET/PUT/DELETE by ID (hard delete)
- Reports: GET (list with studentId, tipo), POST + GET (with student & psychologist), PUT, DELETE (hard delete)
- Dashboard: GET with aggregate stats (totalStudents, totalTeachers, totalPsychologists, totalCompanions, totalClasses, totalInstitutions, totalRecords, recentRecords, studentsBySerie, profilesByNivel)
- All routes use Next.js 16 Route Handlers with proper TypeScript typing
- All routes have try/catch error handling with Portuguese error messages
- Tested all routes via curl - all return correct responses
- Lint passes with no errors

Stage Summary:
- 23 API route files created in src/app/api/ covering all models
- Full CRUD for Institutions, Students, Teachers, Psychologists, Companions, Classes, Curriculums
- Link management for StudentCompanions
- Read/Create/Update/Delete for CognitiveProfiles, Records, Reports
- Dashboard stats endpoint with aggregated data
- All routes tested and working correctly
