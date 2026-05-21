'use client'

import { useAppStore } from '@/lib/store'
import { 
  LayoutDashboard, School, GraduationCap, Stethoscope, Brain, 
  Users, BookOpen, Cpu, ClipboardList, FileText, Bot,
  Menu, ChevronRight, Sparkles, TrendingUp, Briefcase, Terminal,
  Network,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { ActiveModule } from '@/lib/types'

import Dashboard from '@/components/modules/Dashboard'
import InstitutionsModule from '@/components/modules/InstitutionsModule'
import StudentsModule from '@/components/modules/StudentsModule'
import TeachersModule from '@/components/modules/TeachersModule'
import PsychologistsModule from '@/components/modules/PsychologistsModule'
import CompanionsModule from '@/components/modules/CompanionsModule'
import ClassesModule from '@/components/modules/ClassesModule'
import CurriculumsModule from '@/components/modules/CurriculumsModule'
import CognitiveProfilesModule from '@/components/modules/CognitiveProfilesModule'
import RecordsModule from '@/components/modules/RecordsModule'
import ReportsModule from '@/components/modules/ReportsModule'
import TeachingPlansModule from '@/components/modules/TeachingPlansModule'
import EvolutionHistoryModule from '@/components/modules/EvolutionHistoryModule'
import CorporateDossierModule from '@/components/modules/CorporateDossierModule'
import HubPromptsModule from '@/components/modules/HubPromptsModule'
import AIAssistantModule from '@/components/modules/AIAssistantModule'

const NAV_ITEMS: { group: string; items: { id: ActiveModule; label: string; icon: React.ElementType }[] }[] = [
  {
    group: 'Principal',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'institutions', label: 'Instituições', icon: School },
    ]
  },
  {
    group: 'Pessoas',
    items: [
      { id: 'students', label: 'Alunos', icon: GraduationCap },
      { id: 'teachers', label: 'Professores', icon: BookOpen },
      { id: 'psychologists', label: 'Psicólogos', icon: Stethoscope },
      { id: 'companions', label: 'Acompanhantes', icon: Users },
    ]
  },
  {
    group: 'Acadêmico',
    items: [
      { id: 'classes', label: 'Turmas', icon: Users },
      { id: 'curriculums', label: 'Currículos', icon: BookOpen },
      { id: 'cognitive-profiles', label: 'Perfil Cognitivo', icon: Brain },
      { id: 'teaching-plans', label: 'Planos de Ensino', icon: GraduationCap },
      { id: 'evolution-history', label: 'Evolução', icon: TrendingUp },
    ]
  },
  {
    group: 'Registros',
    items: [
      { id: 'records', label: 'Registros', icon: ClipboardList },
      { id: 'reports', label: 'Relatórios', icon: FileText },
    ]
  },
  {
    group: 'Institucional',
    items: [
      { id: 'corporate-dossier', label: 'Dossiê Corporativo', icon: Briefcase },
      { id: 'hub-prompts', label: 'Hub de Prompts', icon: Terminal },
    ]
  },
  {
    group: 'Inteligência',
    items: [
      { id: 'ai-assistant', label: 'Assistente IA', icon: Bot },
    ]
  },
]

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { activeModule, setActiveModule } = useAppStore()

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF6B2B] to-[#FF8F5A] flex items-center justify-center shadow-lg shadow-[#FF6B2B]/20">
          <Network className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            CON<span className="text-[#FF6B2B]">EC</span>TA
          </h1>
          <p className="text-[10px] text-muted-foreground leading-none">Educação Adaptativa Integrada</p>
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3 py-3">
        <div className="space-y-5">
          {NAV_ITEMS.map((group) => (
            <div key={group.group}>
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {group.group}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeModule === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveModule(item.id)
                        onNavigate?.()
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                        'hover:bg-accent/50',
                        isActive
                          ? 'bg-[#FF6B2B]/10 text-[#FF6B2B] shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <item.icon className={cn(
                        'w-4.5 h-4.5 shrink-0',
                        isActive ? 'text-[#FF6B2B]' : 'text-muted-foreground/60'
                      )} />
                      <span className="truncate">{item.label}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#FF6B2B]/50" />}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Separator />
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B2B]" />
          <span>MVP v2.0</span>
          <Badge variant="secondary" className="ml-auto text-[9px] px-1.5 py-0 h-4">LGPD</Badge>
          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 bg-[#00D4A0]/10 text-[#00D4A0]">LBI</Badge>
        </div>
      </div>
    </div>
  )
}

function ModuleContent() {
  const { activeModule } = useAppStore()

  const modules: Record<ActiveModule, React.ReactNode> = {
    'dashboard': <Dashboard />,
    'institutions': <InstitutionsModule />,
    'students': <StudentsModule />,
    'teachers': <TeachersModule />,
    'psychologists': <PsychologistsModule />,
    'companions': <CompanionsModule />,
    'classes': <ClassesModule />,
    'curriculums': <CurriculumsModule />,
    'cognitive-profiles': <CognitiveProfilesModule />,
    'records': <RecordsModule />,
    'reports': <ReportsModule />,
    'teaching-plans': <TeachingPlansModule />,
    'evolution-history': <EvolutionHistoryModule />,
    'corporate-dossier': <CorporateDossierModule />,
    'hub-prompts': <HubPromptsModule />,
    'ai-assistant': <AIAssistantModule />,
  }

  return modules[activeModule] || <Dashboard />
}

function Header() {
  const { activeModule, sidebarOpen, setSidebarOpen } = useAppStore()
  
  const moduleLabels: Record<ActiveModule, string> = {
    'dashboard': 'Dashboard',
    'institutions': 'Instituições de Ensino',
    'students': 'Ficha Cadastral do Aluno',
    'teachers': 'Professores & Educadores',
    'psychologists': 'Psicólogos',
    'companions': 'Acompanhantes & Cuidadores',
    'classes': 'Turmas',
    'curriculums': 'Currículos Escolares',
    'cognitive-profiles': 'Perfil Cognitivo Evolutivo (PCE)',
    'records': 'Registros & Observações',
    'reports': 'Relatórios',
    'teaching-plans': 'Planos de Ensino Personalizado',
    'evolution-history': 'Evolução & Histórico',
    'corporate-dossier': 'Dossiê Corporativo CONECTA',
    'hub-prompts': 'Hub de Prompts',
    'ai-assistant': 'Assistente de IA',
  }

  return (
    <header className="sticky top-0 z-30 flex items-center h-14 px-4 border-b bg-background/80 backdrop-blur-sm gap-3">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
            <Menu className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarNav />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
        <h2 className="text-sm font-semibold text-foreground">{moduleLabels[activeModule]}</h2>
      </div>
    </header>
  )
}

export default function Home() {
  const { sidebarOpen } = useAppStore()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden md:flex flex-col border-r bg-card transition-all duration-200 shrink-0',
        sidebarOpen ? 'w-56' : 'w-0 overflow-hidden'
      )}>
        <SidebarNav />
      </aside>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 overflow-auto">
          <ModuleContent />
        </main>
      </div>
    </div>
  )
}
