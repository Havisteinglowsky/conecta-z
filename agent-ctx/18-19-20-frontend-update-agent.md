# Task 18-19-20 - Frontend Update Agent

## Task: Update Students, Reports modules and create Teaching Plans module

### Changes Made:

1. **types.ts** - Added `teaching-plans` to ActiveModule, added 24 new fields to Student/StudentFormData (analfabeto, nivelLeitura, nivelEscrita, etc.), created TeachingPlan and TeachingPlanFormData interfaces

2. **constants.ts** - Added 11 new constant arrays: NIVEL_LEITURA_OPTIONS, NIVEL_ESCRITA_OPTIONS, METODO_ALFABETIZACAO_OPTIONS, ADAPTACAO_COMUNICACAO_OPTIONS, RITMO_APRENDIZAGEM_OPTIONS, NIVEL_FUNCIONAMENTO_OPTIONS, NIVEL_AUTONOMIA_OPTIONS, TIPO_APOIO_OPTIONS, ADAPTACAO_CURRICULAR_OPTIONS, STATUS_PLANO_OPTIONS, TIPO_RELATORIO_PDF_OPTIONS

3. **api.ts** - Added TeachingPlan and TeachingPlanFormData imports, added fetchTeachingPlans, fetchTeachingPlan, createTeachingPlan, updateTeachingPlan, deleteTeachingPlan, generatePDFReport functions

4. **StudentsModule.tsx** - Added 2 new tabs (Tab 9: Adaptações Analfabeto, Tab 10: Adaptações Def. Intelectual), added alert banner in NEE tab, added 24 new form fields, updated emptyForm and data loading

5. **ReportsModule.tsx** - Complete rewrite with PDF generation (per-row + advanced dialog), history viewer, extended report types, color-coded badges

6. **TeachingPlansModule.tsx** - New module with list view, 8-section form dialog, view dialog, PDF generation, CRUD operations

7. **page.tsx** - Added teaching-plans to NAV_ITEMS, modules map, and moduleLabels

### Lint: PASS (zero errors)
### Database: Already in sync
