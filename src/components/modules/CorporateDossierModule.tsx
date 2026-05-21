'use client'

import {
  Briefcase, Shield, Lock, DollarSign, AlertTriangle, Brain,
  FileText, Users, TrendingUp, Building2, Scale, Database, Key,
  ArrowRight, CheckCircle2, BarChart3, Cpu, Eye, Globe, Layers,
  RefreshCw, Server, UserCheck, Fingerprint, LineChart
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

/* ─── colour tokens ─── */
const C = {
  noite:      '#0A1628',
  profundo:   '#0D2045',
  vivo:       '#1E5EFF',
  laranja:    '#FF6B2B',
  verde:      '#00D4A0',
  creme:      '#F5F0E8',
}

/* ─── tiny helpers ─── */
const AccentBar = ({ color = C.laranja }: { color?: string }) => (
  <div className="w-1 rounded-full self-stretch" style={{ backgroundColor: color }} />
)

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  color = C.laranja,
}: {
  icon: React.ElementType
  title: string
  subtitle: string
  color?: string
}) => (
  <div className="flex items-start gap-3 mb-6">
    <AccentBar color={color} />
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-5 h-5" style={{ color }} />
        <h2 className="text-xl font-bold tracking-tight" style={{ color: C.noite }}>{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
    </div>
  </div>
)

const MetricCard = ({
  icon: Icon,
  value,
  label,
  accent = C.laranja,
  description,
}: {
  icon: React.ElementType
  value: string
  label: string
  accent?: string
  description?: string
}) => (
  <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
    <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accent }} />
    <CardContent className="p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}15` }}>
          <Icon className="w-4.5 h-4.5" style={{ color: accent }} />
        </div>
        <span className="text-2xl font-extrabold tracking-tight" style={{ color: C.noite }}>{value}</span>
      </div>
      <p className="text-sm font-semibold" style={{ color: C.noite }}>{label}</p>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
)

const BulletItem = ({ children, accent = C.laranja }: { children: React.ReactNode; accent?: string }) => (
  <div className="flex items-start gap-2.5 mb-3">
    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${accent}15` }}>
      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: accent }} />
    </div>
    <div className="text-sm leading-relaxed" style={{ color: C.noite }}>{children}</div>
  </div>
)

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 — SUMÁRIO EXECUTIVO
   ═══════════════════════════════════════════════════════════════ */
function SumarioExecutivo() {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Briefcase}
        title="Sumário Executivo"
        subtitle="Visão estratégica do CONECTA como plataforma GovTech de neuroeducação adaptativa"
      />

      {/* Hero card */}
      <Card className="border-0 overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.noite} 0%, ${C.profundo} 100%)` }}>
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6" style={{ color: C.laranja }} />
            <Badge style={{ backgroundColor: C.laranja, color: '#fff' }} className="text-xs font-bold">GovTech SaaS</Badge>
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3 leading-tight">
            Central de Otimização e Neuroeducação para Evolução Cognitiva com Tecnologia Adaptativa
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed max-w-3xl">
            O CONECTA é uma plataforma SaaS que integra escola, família e clínica num ecossistema único de neuroeducação adaptativa.
            Projetado para municípios e tribunais de justiça, atende diretamente ao Art. 28 da Lei Brasileira de Inclusão,
            transformando laudos neuropsicológicos estáticos em Perfis Cognitivos Evolutivos dinâmicos — alimentados diariamente
            por terapeutas, professores e psicólogos — e processados por um motor de IA auto-regulável que gera planos
            pedagógicos individualizados em tempo real.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">Neuroeducação</Badge>
            <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">GovTech</Badge>
            <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">Inclusão Escolar</Badge>
            <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">IA Adaptativa</Badge>
            <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">LBI Art.28</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard icon={DollarSign} value="R$ 150 mil" label="Custo do MVP" accent={C.laranja} description="Investimento total para validação técnica e operacional" />
        <MetricCard icon={TrendingUp} value="85%" label="Taxa de Retenção" accent={C.verde} description="Redução de evasão escolar em neurodivergentes" />
        <MetricCard icon={Shield} value="LBI Art.28" label="Conformidade Legal" accent={C.vivo} description="Atendimento integral ao marco de inclusão" />
      </div>

      {/* Vision statement */}
      <Card className="border-0 shadow-md" style={{ backgroundColor: C.creme }}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-5 h-5" style={{ color: C.laranja }} />
            <span className="font-bold text-sm" style={{ color: C.noite }}>Visão</span>
          </div>
          <p className="text-sm leading-relaxed italic" style={{ color: C.profundo }}>
            &ldquo;Conectar escola, família e clínica numa tríade colaborativa onde o Perfil Cognitivo Evolutivo do aluno
            é atualizado em tempo real — eliminando a distância entre o laudo neuropsicológico e a prática pedagógica
            adaptativa. Cada neurodivergente merece um plano de evolução que acompanhe seu ritmo, não o inverso.&rdquo;
          </p>
        </CardContent>
      </Card>

      {/* Differentiators */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold" style={{ color: C.noite }}>Diferenciais Estratégicos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BulletItem accent={C.laranja}>
              <strong>Perfil Cognitivo Evolutivo (PCE)</strong> — modelo dinâmico que substitui laudos estáticos por alimentação contínua
            </BulletItem>
            <BulletItem accent={C.verde}>
              <strong>Motor de IA Auto-Regulável</strong> — adapta intervenções em tempo real com base em 19 dimensões cognitivas
            </BulletItem>
            <BulletItem accent={C.vivo}>
              <strong>Conformidade Legal Integral</strong> — LBI, LDB, ECA e LGPD nativos na arquitetura
            </BulletItem>
            <BulletItem accent={C.laranja}>
              <strong>Modelo SaaS Municipal</strong> — escalável para redes públicas com pricing por matrícula NEE
            </BulletItem>
            <BulletItem accent={C.verde}>
              <strong>Tríade Escola-Família-Clínica</strong> — comunicação unificada e visão 360° do aluno
            </BulletItem>
            <BulletItem accent={C.vivo}>
              <strong>Governança de Dados de Saúde</strong> — criptografia AES-256 e anonimização para pesquisa
            </BulletItem>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2 — O PROBLEMA DETALHADO
   ═══════════════════════════════════════════════════════════════ */
function OProblemaDetalhado() {
  const problems = [
    {
      icon: Users,
      title: 'Sobrecarga Docente',
      color: C.laranja,
      stats: '1 professor : 30+ alunos',
      text: 'Professores da rede pública enfrentam turmas superlotadas sem formação em educação especial. Sem ferramentas de apoio, tornam-se os únicos responsáveis pela inclusão — sem suporte técnico, sem dados cognitivos e sem conexão com a equipe clínica do aluno.',
      tags: ['Formação insuficiente', 'Ausência de dados', 'Isolamento profissional'],
    },
    {
      icon: FileText,
      title: 'Laudos Engavetados',
      color: C.vivo,
      stats: '68% sem aplicação pedagógica',
      text: 'Laudos neuropsicológicos permanecem em gavetas de coordenação sem tradução em ação pedagógica. O diagnóstico existe, mas a ponte entre o parecer técnico e o plano de ensino individualizado simplesmente não existe na infraestrutura escolar atual.',
      tags: ['Diagnóstico sem ação', 'Desconexão clínico-pedagógica', 'Parecer → Gaveta'],
    },
    {
      icon: Brain,
      title: 'Desregulação Social de Neurodivergentes',
      color: C.laranja,
      stats: 'TEA · TDAH · Discalculia · Dislexia',
      text: 'Alunos com Transtorno do Espectro Autista, TDAH, Discalculia e Dislexia são os mais afetados pela ausência de suporte adaptativo. Sem intervenção personalizada, apresentam meltdowns, evasão escolar, e estigmatização — agravando quadros clínicos e violando direitos fundamentais.',
      tags: ['Meltdowns frequentes', 'Evasão precoce', 'Estigmatização'],
    },
    {
      icon: AlertTriangle,
      title: 'Ausência de AEE Estruturado',
      color: C.verde,
      stats: 'Atendimento Educacional Especializado',
      text: 'O AEE (Atendimento Educacional Especializado), previsto na LDB e regulamentado pela Política Nacional de Educação Especial, carece de ferramentas tecnológicas para rastrear evolução cognitiva, adaptar currículos e comunicar avanços à família e à clínica.',
      tags: ['Sem rastreio cognitivo', 'Currículos não adaptados', 'Família desinformada'],
    },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={AlertTriangle}
        title="O Problema Detalhado"
        subtitle="Diagnóstico da falha sistêmica na inclusão escolar de neurodivergentes no Brasil"
        color={C.laranja}
      />

      {/* Impact banner */}
      <Card className="border-0 overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.laranja}15 0%, ${C.creme} 100%)` }}>
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: C.laranja }}>
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: C.noite }}>7,3 milhões de alunos com NEE matriculados no Brasil</p>
            <p className="text-xs text-muted-foreground">Censo Escolar 2023 — apenas 36% recebem atendimento especializado adequado</p>
          </div>
        </CardContent>
      </Card>

      {/* Problem cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {problems.map((p) => (
          <Card key={p.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${p.color}15` }}>
                  <p.icon className="w-5 h-5" style={{ color: p.color }} />
                </div>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: C.noite }}>{p.title}</h4>
                  <Badge variant="outline" className="text-[10px] font-mono mt-0.5" style={{ borderColor: p.color, color: p.color }}>{p.stats}</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{p.text}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <Badge key={t} className="text-[10px] font-medium" style={{ backgroundColor: `${p.color}15`, color: p.color, border: 'none' }}>
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Closing statement */}
      <Card className="border-0 shadow-md" style={{ backgroundColor: C.noite }}>
        <CardContent className="p-5">
          <p className="text-sm text-gray-300 leading-relaxed">
            <strong className="text-white">O diagnóstico é claro:</strong> o sistema educacional brasileiro produz laudos, mas não produz inclusão.
            A cadeia entre diagnóstico neuropsicológico e intervenção pedagógica adaptativa está rompida. O CONECTA existe para
            reconstruir essa ponte — com tecnologia, dados e inteligência adaptativa.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3 — MODELAGEM DO PCE
   ═══════════════════════════════════════════════════════════════ */
function ModelagemPCE() {
  const dimensions = {
    comportamental: ['Atenção Sustentada', 'Regulação Emocional', 'Interação Social', 'Flexibilidade Cognitiva', 'Iniciativa', 'Colaboração', 'Autocontrole'],
    cognitiva: ['Memória Operacional', 'Processamento Visual', 'Raciocínio Lógico', 'Linguagem Expressiva', 'Linguagem Receptiva', 'Planejamento', 'Percepção Espacial'],
    pedagogica: ['Leitura', 'Escrita', 'Cálculo', 'Resolução de Problemas', 'Autonomia Acadêmica'],
  }

  const feedbackSteps = [
    { icon: Users, label: 'Terapeutas', desc: 'Alimentam dados clínicos e terapêuticos semanais' },
    { icon: Building2, label: 'Professores', desc: 'Registram observações pedagógicas diárias' },
    { icon: Brain, label: 'Psicólogos', desc: 'Atualizam pareceres e ajustam intervenções' },
    { icon: Cpu, label: 'Motor de IA', desc: 'Processa 19 dimensões e gera plano adaptativo' },
    { icon: RefreshCw, label: 'Auto-Regulação', desc: 'Ajusta automaticamente pesos e estratégias' },
    { icon: Eye, label: 'PCE Atualizado', desc: 'Perfil evolutivo disponível em tempo real' },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Brain}
        title="Modelagem do PCE"
        subtitle="Perfil Cognitivo Evolutivo — o coração inteligente do CONECTA"
        color={C.laranja}
      />

      {/* PCE definition */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <p className="text-sm leading-relaxed" style={{ color: C.noite }}>
            O <strong>Perfil Cognitivo Evolutivo (PCE)</strong> é o modelo central do CONECTA. Diferente de um laudo estático,
            o PCE é um <strong>documento vivo</strong> — atualizado diariamente por uma tríade de profissionais (terapeutas, professores, psicólogos)
            e processado por um <strong>motor de IA auto-regulável</strong> que transforma dados brutos em planos pedagógicos individualizados.
            Cada aluno possui 19 dimensões cognitivas mapeadas numa escala evolutiva (1-10), gerando um perfil dinâmico que reflete
            seu progresso real — não um diagnóstico congelado no tempo.
          </p>
        </CardContent>
      </Card>

      {/* Feedback loop diagram */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2" style={{ color: C.noite }}>
            <RefreshCw className="w-4 h-4" style={{ color: C.laranja }} />
            Ciclo de Realimentação Contínua
          </CardTitle>
          <CardDescription>O PCE é alimentado diariamente e auto-regulado pelo motor de IA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {feedbackSteps.map((step, i) => (
              <div key={step.label} className="relative">
                <div className="flex flex-col items-center text-center p-4 rounded-xl border-2 border-dashed" style={{ borderColor: `${C.laranja}30`, backgroundColor: `${C.laranja}05` }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${C.laranja}15` }}>
                    <step.icon className="w-5 h-5" style={{ color: C.laranja }} />
                  </div>
                  <span className="text-xs font-bold mb-1" style={{ color: C.noite }}>{step.label}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">{step.desc}</span>
                </div>
                {i < feedbackSteps.length - 1 && (
                  <ArrowRight className="w-4 h-4 absolute -right-2.5 top-1/2 -translate-y-1/2 hidden sm:block" style={{ color: C.laranja }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center mt-3">
            <Badge style={{ backgroundColor: C.laranja, color: '#fff' }} className="text-xs font-bold gap-1">
              <RefreshCw className="w-3 h-3" /> Ciclo contínuo de evolução
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 19 dimensions */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2" style={{ color: C.noite }}>
            <Layers className="w-4 h-4" style={{ color: C.vivo }} />
            19 Dimensões Cognitivas Mapeadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(dimensions).map(([key, dims]) => {
              const colorMap: Record<string, string> = { comportamental: C.laranja, cognitiva: C.vivo, pedagogica: C.verde }
              const labelMap: Record<string, string> = { comportamental: 'Comportamental', cognitiva: 'Cognitiva', pedagogica: 'Pedagógica' }
              const color = colorMap[key]
              return (
                <div key={key} className="p-4 rounded-xl" style={{ backgroundColor: `${color}08`, border: `1px solid ${color}20` }}>
                  <h5 className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    {labelMap[key]} ({dims.length})
                  </h5>
                  <ul className="space-y-1.5">
                    {dims.map((d) => (
                      <li key={d} className="text-xs flex items-center gap-1.5" style={{ color: C.noite }}>
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI engine */}
      <Card className="border-0 overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.noite} 0%, ${C.profundo} 100%)` }}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-5 h-5" style={{ color: C.laranja }} />
            <span className="text-sm font-bold text-white">Motor de IA Auto-Regulável</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            O motor de IA analisa as 19 dimensões do PCE e gera automaticamente: planos de ensino adaptados,
            sugestões de intervenção terapêutica, alertas de regressão cognitiva, e recomendações de readequação curricular.
            O sistema aprende com cada interação e ajusta os pesos das dimensões conforme o perfil evolutivo do aluno.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">Adaptive Learning</Badge>
            <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">Anomaly Detection</Badge>
            <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">Curriculum Mapping</Badge>
            <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">Early Warning</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4 — RESPONSABILIDADE LEGAL
   ═══════════════════════════════════════════════════════════════ */
function ResponsabilidadeLegal() {
  const legalFrameworks = [
    {
      icon: Scale,
      title: 'Lei Brasileira de Inclusão (LBI — Lei 13.146/15)',
      color: C.laranja,
      highlight: 'Art. 28 — Educação Inclusiva',
      text: 'O CONECTA atende integralmente ao Art. 28 da LBI, que garante ao aluno com deficiência o direito à educação inclusiva em todos os níveis. A plataforma implementa os incisos I a XIV do artigo, com destaque para: currículos adaptados (inciso III), tecnologias assistivas (inciso IV), formação de professores (inciso VIII), e garantia de acessibilidade (inciso V). Cada funcionalidade do PCE está mapeada para um ou mais incisos do Art. 28.',
      articles: ['Inciso III — Currículos adaptados', 'Inciso IV — Tecnologias assistivas', 'Inciso V — Acessibilidade', 'Inciso VIII — Formação docente', 'Inciso XIV — AEE'],
    },
    {
      icon: BookText,
      title: 'LDB — Lei de Diretrizes e Bases (Lei 9.394/96)',
      color: C.vivo,
      highlight: 'Arts. 58-60 — Educação Especial',
      text: 'A LDB define educação especial como modalidade transversal a todos os níveis de ensino. O CONECTA cumpre os Arts. 58 a 60 ao oferecer: serviços de apoio especializado (Art. 58 §1º), currículos adaptados à NEE do aluno (Art. 59 I), e terminalidade específica quando aplicável (Art. 59 II). O PCE serve como instrumento técnico para a definição do plano individual.',
      articles: ['Art. 58 — Modalidade transversal', 'Art. 59 I — Currículos adaptados', 'Art. 59 II — Terminalidade específica', 'Art. 60 — Oferta obrigatória'],
    },
    {
      icon: Shield,
      title: 'ECA — Estatuto da Criança e do Adolescente (Lei 8.069/90)',
      color: C.verde,
      highlight: 'Arts. 53-55 — Direito à Educação',
      text: 'O ECA garante à criança e ao adolescente o direito à educação com igualdade de condições, acesso escolar público próximo à residência, e oferta de ensino noturno regular. Para neurodivergentes, o CONECTA assegura que o direito à educação não seja apenas formal, mas efetivo — com adaptações que garantam aprendizagem real e desenvolvimento cognitivo mensurável.',
      articles: ['Art. 53 — Igualdade de condições', 'Art. 54 — Dever do Estado', 'Art. 55 — Direito a ser ouvido'],
    },
    {
      icon: Lock,
      title: 'LGPD — Lei Geral de Proteção de Dados (Lei 13.709/18)',
      color: C.laranja,
      highlight: 'Dados de Saúde de Menores',
      text: 'A LGPD classifica dados de saúde como dados sensíveis (Art. 5º II), exigindo proteção reforçada. Quando o titular é menor de idade, a responsabilidade é triplicada. O CONECTA implementa governança de dados de saúde com criptografia AES-256, controle de acesso baseado em funções, anonimização para pesquisa, e consentimento informado dos responsáveis legais — conforme Arts. 7º, 11º e 46º.',
      articles: ['Art. 5º II — Dados sensíveis', 'Art. 7º — Bases legais', 'Art. 11º — Dados sensíveis', 'Art. 46º — Segurança'],
    },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Scale}
        title="Responsabilidade Legal"
        subtitle="Conformidade integral com o marco regulatório de inclusão e proteção de dados"
        color={C.vivo}
      />

      {/* Legal compliance banner */}
      <Card className="border-0 overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.profundo} 0%, ${C.noite} 100%)` }}>
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: C.vivo }}>
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-white">4 Marcos Legais Integrados na Arquitetura</p>
            <p className="text-xs text-gray-400">Cada funcionalidade do CONECTA é rastreável a um dispositivo legal específico</p>
          </div>
        </CardContent>
      </Card>

      {/* Legal frameworks */}
      <div className="space-y-4">
        {legalFrameworks.map((fw) => (
          <Card key={fw.title} className="border-0 shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${fw.color}15` }}>
                  <fw.icon className="w-5 h-5" style={{ color: fw.color }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm" style={{ color: C.noite }}>{fw.title}</h4>
                  <Badge className="text-[10px] font-mono mt-0.5" style={{ backgroundColor: fw.color, color: '#fff' }}>{fw.highlight}</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{fw.text}</p>
              <div className="flex flex-wrap gap-1.5">
                {fw.articles.map((a) => (
                  <Badge key={a} variant="outline" className="text-[10px] font-medium" style={{ borderColor: `${fw.color}40`, color: fw.color }}>
                    {a}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 5 — ARQUITETURA DE PRIVACIDADE
   ═══════════════════════════════════════════════════════════════ */
function ArquiteturaPrivacidade() {
  const layers = [
    {
      icon: Lock,
      title: 'Criptografia AES-256',
      color: C.laranja,
      desc: 'Todos os dados de saúde de menores são criptografados em repouso (AES-256-GCM) e em trânsito (TLS 1.3). Chaves rotacionadas a cada 90 dias com HSM dedicado.',
      specs: ['AES-256-GCM at rest', 'TLS 1.3 in transit', 'HSM key management', 'Rotação 90 dias'],
    },
    {
      icon: UserCheck,
      title: 'Modelo de Autoridade RBAC',
      color: C.vivo,
      desc: 'Controle de acesso baseado em funções com 5 níveis hierárquicos. Cada profissional acessa apenas dados pertinentes à sua função. Psicólogos veem laudos; professores veem planos adaptados; família vê evolução simplificada.',
      specs: ['5 níveis hierárquicos', 'Acesso mínimo necessário', 'Auditoria completa', 'Sessões com timeout'],
    },
    {
      icon: Fingerprint,
      title: 'Consentimento Informado',
      color: C.verde,
      desc: 'Fluxo de consentimento digital com assinatura eletrônica do responsável legal. Registro imutável de autorizações, revogações e alterações. Menores nunca têm dados processados sem consentimento ativo.',
      specs: ['Assinatura eletrônica ICP-Brasil', 'Revogação imediata', 'Log imutável', 'Consentimento granular'],
    },
    {
      icon: Database,
      title: 'Anonimização para Pesquisa',
      color: C.laranja,
      desc: 'Dados destinados a pesquisa acadêmica são anonimizados com técnicas de k-anonimato (k≥5) e generalização de quasi-identifiers. Re-identificação é tecnicamente inviável, conforme LGPD Art. 12.',
      specs: ['k-anonimato (k≥5)', 'Generalização QI', 'Perturbação diferencial', 'Compliance Art.12 LGPD'],
    },
    {
      icon: Key,
      title: 'Governança de Dados de Saúde',
      color: C.vivo,
      desc: 'Política de retenção de 10 anos para dados de saúde de menores (conforme CDC Art. 205 e CFM). Exportação em formato aberto (FHIR/HL7). Direito ao esquecimento implementado com crypto-shredding.',
      specs: ['Retenção 10 anos', 'Exportação FHIR/HL7', 'Crypto-shredding', 'DPO dedicado'],
    },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Lock}
        title="Arquitetura de Privacidade"
        subtitle="Governança de dados sensíveis projetada para menores — além do compliance LGPD"
        color={C.laranja}
      />

      {/* Privacy-first banner */}
      <Card className="border-0 overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.laranja}10 0%, ${C.creme} 100%)` }}>
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6" style={{ color: C.laranja }} />
            <span className="font-bold text-sm" style={{ color: C.noite }}>Privacy by Design — Nativo na Arquitetura</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A arquitetura de privacidade do CONECTA não é uma camada adicionada — é um princípio fundacional.
            Cada decisão de design foi tomada considerando que os dados processados pertencem a menores de idade com
            neurodivergências, o que exige o mais alto nível de proteção regulatório e ético. A governança segue
            os princípios de Privacy by Design da ANPD e as diretrizes do CFM para prontuários eletrônicos.
          </p>
        </CardContent>
      </Card>

      {/* Architecture layers */}
      <div className="space-y-4">
        {layers.map((layer) => (
          <Card key={layer.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${layer.color}15` }}>
                  <layer.icon className="w-5 h-5" style={{ color: layer.color }} />
                </div>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: C.noite }}>{layer.title}</h4>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{layer.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {layer.specs.map((s) => (
                  <Badge key={s} className="text-[10px] font-mono" style={{ backgroundColor: `${layer.color}12`, color: layer.color, border: 'none' }}>
                    {s}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Architecture diagram */}
      <Card className="border-0 overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.noite} 0%, ${C.profundo} 100%)` }}>
        <CardContent className="p-6">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Server className="w-4 h-4" style={{ color: C.laranja }} />
            Visão em Camadas da Arquitetura
          </h4>
          <div className="space-y-2">
            {[
              { label: 'Camada de Apresentação', desc: 'Interface adaptativa · Acessibilidade WCAG 2.1 AA', color: C.verde },
              { label: 'Camada de Aplicação', desc: 'API REST · RBAC · Auditoria · Consentimento', color: C.vivo },
              { label: 'Camada de Dados', desc: 'AES-256 · Anonimização · FHIR/HL7 · Crypto-shredding', color: C.laranja },
              { label: 'Camada de Infraestrutura', desc: 'HSM · TLS 1.3 · Backup criptografado · DR region', color: C.verde },
            ].map((cam) => (
              <div key={cam.label} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: `${cam.color}10`, borderLeft: `3px solid ${cam.color}` }}>
                <span className="text-xs font-bold text-white shrink-0 w-36 sm:w-44">{cam.label}</span>
                <span className="text-[10px] text-gray-400">{cam.desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 6 — VIABILIDADE FINANCEIRA
   ═══════════════════════════════════════════════════════════════ */
function ViabilidadeFinanceira() {
  const roiData = [
    { year: 'Ano 1', students: 500, revenue: 150, cost: 150, roi: 0 },
    { year: 'Ano 2', students: 2000, revenue: 600, cost: 280, roi: 114 },
    { year: 'Ano 3', students: 8000, revenue: 2400, cost: 650, roi: 269 },
    { year: 'Ano 5', students: 25000, revenue: 7500, cost: 1400, roi: 436 },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={DollarSign}
        title="Viabilidade Financeira"
        subtitle="Modelo de negócio SaaS com projeções de ROI para municípios e tribunais"
        color={C.verde}
      />

      {/* MVP cost card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard icon={DollarSign} value="R$ 150 mil" label="Custo Operacional do MVP" accent={C.laranja} description="Desenvolvimento + infra + equipe (12 meses)" />
        <MetricCard icon={TrendingUp} value="85%" label="Redução de Evasão" accent={C.verde} description="Retenção de neurodivergentes com PCE ativo" />
        <MetricCard icon={LineChart} value="436%" label="ROI em 5 Anos" accent={C.vivo} description="Retorno projetado sobre investimento inicial" />
      </div>

      {/* SaaS pricing model */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2" style={{ color: C.noite }}>
            <BarChart3 className="w-4 h-4" style={{ color: C.verde }} />
            Modelo de Pricing SaaS — Por Matrícula NEE
          </CardTitle>
          <CardDescription>Escalabilidade com previsibilidade orçamentária para gestores públicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { tier: 'Município Pequeno', alunos: 'Até 200 NEE', price: 'R$ 25/aluno/mês', features: ['PCE completo', 'Motor de IA', 'Suporte 8h', 'Dashboard gestor'], color: C.verde },
              { tier: 'Município Médio', alunos: '200–1.000 NEE', price: 'R$ 18/aluno/mês', features: ['Tudo do Small', 'API de integração', 'Suporte 12h', 'Relatórios LGPD'], color: C.vivo },
              { tier: 'Município Grande / Tribunal', alunos: '1.000+ NEE', price: 'R$ 12/aluno/mês', features: ['Tudo do Medium', 'White-label', 'SLA 99.9%', 'DPO dedicado'], color: C.laranja },
            ].map((plan) => (
              <div key={plan.tier} className="p-4 rounded-xl border-2" style={{ borderColor: `${plan.color}30`, backgroundColor: `${plan.color}05` }}>
                <h5 className="text-xs font-bold mb-1" style={{ color: plan.color }}>{plan.tier}</h5>
                <p className="text-[10px] text-muted-foreground mb-2">{plan.alunos}</p>
                <p className="text-lg font-extrabold mb-3" style={{ color: C.noite }}>{plan.price}</p>
                <ul className="space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="text-[11px] flex items-center gap-1.5" style={{ color: C.noite }}>
                      <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ROI projections */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2" style={{ color: C.noite }}>
            <TrendingUp className="w-4 h-4" style={{ color: C.verde }} />
            Projeção de ROI — 5 Anos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: `${C.verde}20` }}>
                  <th className="text-left py-2 pr-4 text-xs font-bold text-muted-foreground">Período</th>
                  <th className="text-right py-2 px-2 text-xs font-bold text-muted-foreground">Alunos NEE</th>
                  <th className="text-right py-2 px-2 text-xs font-bold text-muted-foreground">Receita (R$ mil)</th>
                  <th className="text-right py-2 px-2 text-xs font-bold text-muted-foreground">Custo (R$ mil)</th>
                  <th className="text-right py-2 pl-2 text-xs font-bold text-muted-foreground">ROI</th>
                </tr>
              </thead>
              <tbody>
                {roiData.map((row) => (
                  <tr key={row.year} className="border-b last:border-0" style={{ borderColor: `${C.verde}10` }}>
                    <td className="py-2.5 pr-4 font-bold" style={{ color: C.noite }}>{row.year}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums" style={{ color: C.noite }}>{row.students.toLocaleString('pt-BR')}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums" style={{ color: C.verde }}>R$ {row.revenue.toLocaleString('pt-BR')}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums" style={{ color: C.laranja }}>R$ {row.cost.toLocaleString('pt-BR')}</td>
                    <td className="py-2.5 pl-2 text-right">
                      <Badge className="text-[10px] font-bold" style={{ backgroundColor: row.roi > 100 ? C.verde : row.roi > 0 ? C.vivo : 'gray', color: '#fff' }}>
                        {row.roi > 0 ? `+${row.roi}%` : 'Break-even'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cost breakdown */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2" style={{ color: C.noite }}>
            <DollarSign className="w-4 h-4" style={{ color: C.laranja }} />
            Composição do Investimento MVP — R$ 150.000,00
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { item: 'Desenvolvimento da Plataforma (Frontend + Backend + IA)', pct: 40, value: 'R$ 60.000', color: C.laranja },
              { item: 'Infraestrutura Cloud (AWS/GCP — 12 meses)', pct: 15, value: 'R$ 22.500', color: C.vivo },
              { item: 'Equipe Técnica (2 devs + 1 UX + 1 neuroeducadora)', pct: 25, value: 'R$ 37.500', color: C.verde },
              { item: 'Validação com Escolas-Piloto (3 municípios)', pct: 10, value: 'R$ 15.000', color: C.laranja },
              { item: 'Legal, Compliance LGPD e Certificações', pct: 10, value: 'R$ 15.000', color: C.vivo },
            ].map((item) => (
              <div key={item.item}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: C.noite }}>{item.item}</span>
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Closing CTA */}
      <Card className="border-0 overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.noite} 0%, ${C.profundo} 100%)` }}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5" style={{ color: C.verde }} />
            <span className="text-sm font-bold text-white">Impacto Socioeconômico</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            Cada real investido no CONECTA gera impacto mensurável: redução de evasão escolar, economia em processos judiciais
            por descumprimento da LBI, e melhoria nos indicadores IDEB de municípios com alta incidência de NEE.
            O modelo SaaS municipal permite que prefeituras de todos os portes implementem inclusão real — sem investimento
            em infraestrutura local, sem risco tecnológico, com previsibilidade orçamentária.
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge style={{ backgroundColor: C.verde, color: '#fff' }} className="text-xs font-bold">Evasão ↓ 85%</Badge>
            <Badge style={{ backgroundColor: C.laranja, color: '#fff' }} className="text-xs font-bold">Custo Zero Infra</Badge>
            <Badge style={{ backgroundColor: C.vivo, color: '#fff' }} className="text-xs font-bold">ROI 436% em 5 anos</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN MODULE
   ═══════════════════════════════════════════════════════════════ */
const TABS = [
  { id: 'sumario', label: 'Sumário', shortLabel: 'Sumário', icon: Briefcase },
  { id: 'problema', label: 'O Problema', shortLabel: 'Problema', icon: AlertTriangle },
  { id: 'pce', label: 'Modelagem PCE', shortLabel: 'PCE', icon: Brain },
  { id: 'legal', label: 'Responsabilidade Legal', shortLabel: 'Legal', icon: Scale },
  { id: 'privacidade', label: 'Arquitetura de Privacidade', shortLabel: 'Privacidade', icon: Lock },
  { id: 'financeiro', label: 'Viabilidade Financeira', shortLabel: 'Financeiro', icon: DollarSign },
] as const

type TabId = (typeof TABS)[number]['id']

export default function CorporateDossierModule() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: C.creme }}>
      {/* Module header */}
      <div className="sticky top-0 z-20 border-b" style={{ backgroundColor: C.noite }}>
        <div className="px-4 md:px-8 py-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.laranja }}>
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white tracking-tight">Dossiê Corporativo CONECTA</h1>
              <p className="text-[10px] text-gray-400">Vitrine Tecnológica · Captação de Recursos · Parcerias Institucionais</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Badge className="text-[9px] font-bold" style={{ backgroundColor: C.laranja, color: '#fff' }}>MVP v2.0</Badge>
            <Badge className="text-[9px] font-bold" style={{ backgroundColor: C.verde, color: '#fff' }}>LGPD Compliant</Badge>
            <Badge className="text-[9px] font-bold" style={{ backgroundColor: C.vivo, color: '#fff' }}>LBI Art.28</Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 md:px-8 py-6">
        <Tabs defaultValue="sumario" className="w-full">
          <div className="mb-6 overflow-x-auto">
            <TabsList className="bg-white/80 backdrop-blur-sm shadow-sm w-full h-auto flex-wrap gap-1 p-1.5">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-[#FF6B2B] data-[state=active]:text-white data-[state=active]:shadow-md text-xs px-3 py-2 transition-all"
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline ml-1.5">{tab.label}</span>
                  <span className="sm:hidden ml-1">{tab.shortLabel}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <ScrollArea className="max-h-[calc(100vh-220px)]">
            <TabsContent value="sumario"><SumarioExecutivo /></TabsContent>
            <TabsContent value="problema"><OProblemaDetalhado /></TabsContent>
            <TabsContent value="pce"><ModelagemPCE /></TabsContent>
            <TabsContent value="legal"><ResponsabilidadeLegal /></TabsContent>
            <TabsContent value="privacidade"><ArquiteturaPrivacidade /></TabsContent>
            <TabsContent value="financeiro"><ViabilidadeFinanceira /></TabsContent>
          </ScrollArea>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t px-4 md:px-8 py-4" style={{ backgroundColor: C.noite }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-gray-500">
            CONECTA · Central de Otimização e Neuroeducação para Evolução Cognitiva com Tecnologia Adaptativa
          </p>
          <p className="text-[10px] text-gray-600">
            Documento confidencial · Uso institucional · 2025
          </p>
        </div>
      </footer>
    </div>
  )
}
