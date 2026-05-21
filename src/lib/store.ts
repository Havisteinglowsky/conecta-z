import { create } from 'zustand'
import type { ActiveModule } from './types'

interface AppState {
  // Navigation
  activeModule: ActiveModule
  setActiveModule: (module: ActiveModule) => void

  // For entity detail views
  selectedStudentId: string | null
  setSelectedStudentId: (id: string | null) => void
  selectedInstitutionId: string | null
  setSelectedInstitutionId: (id: string | null) => void

  // Sidebar state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  activeModule: 'dashboard',
  setActiveModule: (module) => set({ activeModule: module }),

  // For entity detail views
  selectedStudentId: null,
  setSelectedStudentId: (id) => set({ selectedStudentId: id }),
  selectedInstitutionId: null,
  setSelectedInstitutionId: (id) => set({ selectedInstitutionId: id }),

  // Sidebar state
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
