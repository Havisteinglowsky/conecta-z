'use client'

import { useState, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Terminal,
  Copy,
  Check,
  Search,
  Brain,
  FileText,
  GraduationCap,
  Shield,
  BookOpen,
  Sparkles,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface PromptData {
  id: string
  title: string
  prompt: string
  tags: string[]
}

interface CategoryData {
  id: string
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
  textColor: string
  prompts: PromptData[]
}

// ─── Prompt Data ─────────────────────────────────────────────────────────────

const CATEGORIES: CategoryData[] = [
  {
    id: 'avaliacao',
    label: 'Avaliação Neuropsicológica',
    icon: Brain,
    color: '#FF6B2B',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    prompts: [
      {
        id: 'avaliacao-1',
        title: 'Relatório de Evolução Trimestral (Persona ABA)',
        prompt: `Você é um terapeuta ABA com 15 anos de experiência em análise comportamental aplicada a crianças neurodivergentes. Com base nos dados a seguir, elabore um Relatório de Evolução Trimestral completo:

DADOS DE ENTRADA:
- Nome do aluno: [NOME]
- Idade: [IDADE]
- Diagnóstico: [DIAGNÓSTICO]
- Período de referência: [PERÍODO]
- Metas do trimestre anterior: [METAS_ANTERIORES]
- Dados de observação direta: [DADOS_OBSERVAÇÃO]
- Registros de sessão: [REGISTROS_SESSÃO]

ESTRUTURA EXIGIDA:
1. **Resumo Executivo** — Síntese em 3 frases do progresso geral
2. **Análise de Metas Atendidas** — Para cada meta: status (atingida/parcial/não atingida), percentual de aproximação, contingências relevantes
3. **Curva de Aquisição** — Descrição quantitativa da trajetória de aprendizagem (regressões, plateaus, saltos)
4. **Análise Funcional do Comportamento** — Antecedentes, comportamentos-alvo, consequências, função hipotetizada
5. **Recomendações para Próximo Trimestre** — MCR (Metas Curriculares Realistas) com critérios mensuráveis
6. **Indicadores de Generalização** — Evidências de transferência de habilidades entre contextos

TOM: Clínico, objetivo, baseado em evidências, com linguagem acessível para família e equipe pedagógica.`,
        tags: ['ABA', 'Evolução', 'Trimestral', 'Comportamental'],
      },
      {
        id: 'avaliacao-2',
        title: 'Análise Comparativa PCE (Perfil Cognitivo Evolutivo)',
        prompt: `Você é um neuropsicólogo educacional especializado em avaliação cognitiva de populações neurodivergentes. Realize uma Análise Comparativa entre dois ou mais Perfil Cognitivo Evolutivo (PCE) do mesmo aluno:

DADOS DE ENTRADA:
- Nome do aluno: [NOME]
- PCE Inicial (data): [DADOS_PCE_1]
- PCE Atual (data): [DADOS_PCE_2]
- Diagnóstico: [DIAGNÓSTICO]
- Intervenções realizadas no período: [INTERVENÇÕES]

ESTRUTURA EXIGIDA:
1. **Mapa de Evolução por Dimensão** — Comparação item a item das 19 dimensões do PCE (7 comportamentais, 7 cognitivas, 5 pedagógicas), indicando Δ (delta) de variação e tendência (↑↓→)
2. **Cluster de Evolução** — Agrupamento das dimensões que evoluíram conjuntamente, identificando correlações funcionais
3. **Zonas de Estagnação** — Dimensões sem variação significativa com hipótese explicativa
4. **Risco de Regressão** — Dimensões com queda ou instabilidade, com fatores de risco identificados
5. **Projeção de Curva Sensória-Cognitiva** — Estimativa de evolução para o próximo período considerando o ritmo atual
6. **Síntese Diagnóstica Funcional** — Reavaliação do perfil neuropsicológico à luz dos dados comparativos

BASE TEÓRICA: Referencie modelos de plasticidade neuronal, janelas críticas e princípios de neuroeducação adaptativa.`,
        tags: ['PCE', 'Comparativo', 'Neuropsicologia', 'Evolução Cognitiva'],
      },
      {
        id: 'avaliacao-3',
        title: 'Projeção de Curva de Tolerância Sensorial',
        prompt: `Você é um terapeuta ocupacional com especialização em integração sensorial e processamento sensorial em neurodivergentes. Elabore uma Projeção de Curva de Tolerância Sensorial:

DADOS DE ENTRADA:
- Nome do aluno: [NOME]
- Idade: [IDADE]
- Diagnóstico: [DIAGNÓSTICO]
- Perfil sensorial atual (hiporresponsividade/hiperresponsividade por sistema): [PERFIL_SENSORIAL]
- Histórico de crises sensoriais: [HISTÓRICO_CRISES]
- Ambientes de exposição: [AMBIENTES]
- Estratégias atuais de regulação: [ESTRATÉGIAS_ATUAIS]

ESTRUTURA EXIGIDA:
1. **Mapeamento dos 8 Sistemas Sensoriais** — Visual, auditivo, tátil, proprioceptivo, vestibular, olfativo, gustativo, interoceptivo — com nível de tolerância atual (1-10) e limiar de sobrecarga
2. **Gatilhos Identificados** — Estímulos que causam disregulação, classificados por intensidade (leve/moderado/intenso)
3. **Curva de Tolerância Projetada** — Para cada sistema, projeção de evolução em 3/6/12 meses considerando intervenção planejada
4. **Protocolo de Dessaibilização Gradativa** — Etapas para expansão da tolerância com marcos mensuráveis
5. **Sinais de Alerta e Botoerapia** — Indicadores precoces de sobrecarga e estratégias de autorregulação
6. **Adaptações Ambientais Recomendadas** — Modificações no espaço físico para otimizar processamento sensorial
7. **Plano de Comunicação com Equipe** — Como compartilhar a curva com professores e acompanhantes

REFERÊNCIA: Baseado no modelo de Dunn (Sensor Processing Framework) e Ayres Sensory Integration®.`,
        tags: ['Sensorial', 'Tolerância', 'Integração Sensorial', 'Projeção'],
      },
    ],
  },
  {
    id: 'pdi',
    label: 'Plano de Desenvolvimento Individual',
    icon: GraduationCap,
    color: '#1E5EFF',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    prompts: [
      {
        id: 'pdi-1',
        title: 'Geração de MCR (Metas Curriculares Realistas)',
        prompt: `Você é um pedagogo especialista em educação inclusiva com formação em adaptação curricular para neurodivergentes. Gere Metas Curriculares Realistas (MCR) para o PDI do aluno:

DADOS DE ENTRADA:
- Nome do aluno: [NOME]
- Idade: [IDADE] | Série: [SÉRIE]
- Diagnóstico: [DIAGNÓSTICO]
- Perfil Cognitivo Evolutivo (PCE): [DADOS_PCE]
- Histórico de metas anteriores: [METAS_ANTERIORES]
- BNCC — Competências e habilidades alvo: [BNCC_ALVO]
- Recursos disponíveis: [RECURSOS]

ESTRUTURA EXIGIDA (para cada MCR):
1. **Código da Meta** — MCR-[número]-[área]-[trimestre]
2. **Enunciado da Meta** — Descrição clara e mensurável do desempenho esperado
3. **Critério de Atingimento** — Percentual de acurácia, frequência ou duração exigida
4. **Linha de Base** — Desempenho atual do aluno na habilidade
5. **Estratégias de Ensino** — Mínimo 3 abordagens metodológicas diferenciadas
6. **Recursos Adaptativos** — Materiais, tecnologias assistivas, apoios humanos
7. **Cronograma de Avaliação** — Marcos parciais (30/60/90 dias)
8. **Critério de Revisão** — Quando e como a meta será revista se não houver progresso

GERE NO MÍNIMO 5 MCR cobrindo áreas: Linguagem, Matemática, Socioemocional, Autonomia, Motoridade.

PRINCÍPIO: Cada meta deve ser desafiadora porém alcançável (Zona de Desenvolvimento Proximal de Vygotsky).`,
        tags: ['MCR', 'Metas', 'PDI', 'Adaptação Curricular'],
      },
      {
        id: 'pdi-2',
        title: 'Adaptações Cognitivas (Anti-Ruído Cognitivo)',
        prompt: `Você é um neuropsicólogo educacional especializado em estratégias anti-ruído cognitivo para neurodivergentes. Elabore um plano de Adaptações Cognitivas:

DADOS DE ENTRADA:
- Nome do aluno: [NOME]
- Diagnóstico: [DIAGNÓSTICO]
- Fontes de ruído cognitivo identificadas: [RUÍDOS]
- Perfil atencional: [PERFIL_ATENÇÃO]
- Estilos de aprendizagem predominantes: [ESTILOS]
- Ambiente de aprendizagem: [AMBIENTE]

CONCEITO: Ruído cognitivo = estímulos, demandas ou condições internas/externas que competem por recursos atencionais e prejudicam o processamento de informação.

ESTRUTURA EXIGIDA:
1. **Diagnóstico de Ruído Cognitivo** — Mapeamento das fontes por categoria:
   - Interno: ansiedade, pensamento repetitivo, dor/disconforto, processamento sensorial
   - Externo: estímulos visuais, auditivos, sociais, organizacionais
   - Instrucional: ambiguidade, sobrecarga, ritmo inadequado, linguagem inacessível
2. **Matriz de Intervenção** — Para cada fonte de ruído: estratégia de eliminação, redução ou compensação
3. **Técnicas de Foco Direcionado** — Pomodoro adaptado, chunking informacional, carregamento cognitivo progressivo
4. **Protocolo de Sinalização** — Sistema não-verbal para o aluno comunicar sobrecarga
5. **Ambiente Cognitivamente Amigável** — Adaptações físicas e digitais do espaço de aprendizagem
6. **Monitoramento da Carga Cognitiva** — Instrumentos para avaliar dia a dia o nível de esforço cognitivo

FUNDAMENTAÇÃO: Teoria da Carga Cognitiva (Sweller), Modelo de Processamento de Informação (Baddeley), Neurociência da Atenção (Posner).`,
        tags: ['Ruído Cognitivo', 'Adaptação', 'Atenção', 'Processamento'],
      },
      {
        id: 'pdi-3',
        title: 'Protocolo de Apoio Sensorial Ativo',
        prompt: `Você é um terapeuta ocupacional especializado em regulação sensorial ativa para ambiente escolar. Elabore um Protocolo de Apoio Sensorial Ativo:

DADOS DE ENTRADA:
- Nome do aluno: [NOME]
- Idade: [IDADE]
- Diagnóstico: [DIAGNÓSTICO]
- Perfil sensorial (hipo/hiper por sistema): [PERFIL]
- Rotina escolar: [ROTINA]
- Espaços disponíveis: [ESPAÇOS]
- Equipe disponível: [EQUIPE]

ESTRUTURA EXIGIDA:
1. **Dieta Sensorial Personalizada** — Sequência de atividades sensoriais estruturadas ao longo do dia:
   - Manhã (antes das aulas): atividades alertantes ou organizadoras
   - Intervalos: atividades regulatórias
   - Transições: estratégias de modulação
   - Tarde: atividades de recarga ou calma
2. **Kit Sensorial do Aluno** — Lista de objetos/ferramentas pessoais com função sensorial específica
3. **Sala de Recursos Sensoriais** — Configuração ideal do espaço com zoneamento (alertante/calmante/regulatório)
4. **Protocolo de Crise Sensorial** — Passo a passo para situações de meltdown/shutdown
5. **Integração com PDI** — Como o apoio sensorial viabiliza o atingimento das MCR
6. **Treinamento da Equipe** — Conteúdo mínimo que professores e acompanhantes precisam dominar
7. **Avaliação de Eficácia** — Indicadores para monitorar se o protocolo está funcionando

BASE: Integração Sensorial de Ayres, Estratégias de Alerta (Williams Shellenberger), Abordagem SOS.`,
        tags: ['Sensorial', 'Dieta Sensorial', 'Regulação', 'Protocolo'],
      },
      {
        id: 'pdi-4',
        title: 'Critérios de Avaliação Adaptativa',
        prompt: `Você é um psicopedagogo especialista em avaliação inclusiva e critérios adaptativos para neurodivergentes. Elabore Critérios de Avaliação Adaptativa:

DADOS DE ENTRADA:
- Nome do aluno: [NOME]
- Série: [SÉRIE] | Disciplina(s): [DISCIPLINAS]
- Diagnóstico: [DIAGNÓSTICO]
- Perfil Cognitivo: [PERFIL_COGNITIVO]
- Adaptações curriculares em vigor: [ADAPTAÇÕES]
- MCR vigentes: [MCR_VIGENTES]

ESTRUTURA EXIGIDA:
1. **Matriz de Competências Adaptadas** — Para cada competência BNCC: indicador adaptado, nível esperado, nível ampliado
2. **Formatos de Avaliação Alternativa** — Portfólio, observação estruturada, autoavaliação guiada, avaliação por projetos, rubrica simplificada
3. **Critérios de Pontuação Diferenciada** — Escala adaptada (não comparativa, mas referenciada ao próprio aluno)
4. **Condições de Avaliação** — Tempo estendido, leitura de enunciados, uso de tecnologia assistiva, ambiente separado, pausas
5. **Rubrica de Evolução Individual** — Modelo de rubrica que avalia progresso relativo (não posição na turma)
6. **Relatório de Avaliação Adaptativa** — Template para registro oficial com linguagem positiva e foco em potencialidades
7. **Comunicação com Família** — Como traduzir os resultados para linguagem acessível e construtiva

PRINCÍPIO: A avaliação deve medir o que o aluno SABE, não o que sua condição IMPEDE de demonstrar (modelo universal de design para aprendizagem — UDL).`,
        tags: ['Avaliação', 'Adaptativa', 'Critérios', 'UDL'],
      },
    ],
  },
  {
    id: 'relatorios',
    label: 'Relatórios Institucionais',
    icon: FileText,
    color: '#00D4A0',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    prompts: [
      {
        id: 'relatorio-1',
        title: 'Relatório de Desempenho Escolar',
        prompt: `Você é um coordenador pedagógico com experiência em gestão de relatórios institucionais para educação inclusiva. Elabore um Relatório de Desempenho Escolar:

DADOS DE ENTRADA:
- Nome do aluno: [NOME]
- Série: [SÉRIE] | Turma: [TURMA]
- Instituição: [INSTITUIÇÃO]
- Período de referência: [PERÍODO]
- Notas por disciplina: [NOTAS]
- Frequência: [FREQUÊNCIA]
- Adaptações curriculares aplicadas: [ADAPTAÇÕES]
- Observações dos professores: [OBSERVAÇÕES]
- MCR vigentes e status: [MCR_STATUS]

ESTRUTURA EXIGIDA:
1. **Cabeçalho Institucional** — Logo, dados da escola, dados do aluno, código INEP
2. **Síntese de Desempenho** — Visão geral por área do conhecimento com indicadores quantitativos e qualitativos
3. **Análise Disciplinar** — Por disciplina: conteúdo trabalhado, adaptações realizadas, desempenho relativo ao MCR
4. **Indicadores de Evolução** — Comparação com período anterior, tendência de progresso
5. **Frequência e Engajamento** — Percentual de presença, padrão de ausências, participação em atividades
6. **Considerações Pedagógicas** — Pontos fortes, desafios, recomendações para o próximo período
7. **Assinaturas** — Professor(es), Coordenador, Diretor, Psicólogo responsável

TOM: Institucional, objetivo, com linguagem positiva e construtiva. Respeitar o princípio da não-comparação entre pares.`,
        tags: ['Desempenho', 'Escolar', 'Institucional', 'Período'],
      },
      {
        id: 'relatorio-2',
        title: 'Relatório para Família (Linguagem Acessível)',
        prompt: `Você é um psicólogo educacional com especialização em comunicação com famílias de neurodivergentes. Elabore um Relatório para Família em linguagem acessível e acolhedora:

DADOS DE ENTRADA:
- Nome do aluno: [NOME]
- Idade: [IDADE]
- Diagnóstico: [DIAGNÓSTICO]
- Evolução no período: [EVOLUÇÃO]
- MCR atingidas/parciais: [MCR_STATUS]
- Observações positivas: [PONTOS_FORTES]
- Desafios atuais: [DESAFIOS]
- Recomendações para casa: [RECOMENDAÇÕES]

PRINCÍPIOS DE COMUNICAÇÃO:
- Usar linguagem simples, sem jargões técnicos
- Começar sempre pelos pontos fortes e conquistas
- Apresentar desafios como "áreas em desenvolvimento" (nunca como falhas)
- Oferecer sugestões concretas e viáveis para o contexto familiar
- Usar analogias do cotidiano para explicar conceitos complexos
- Tom empático, respeitoso e esperançoso

ESTRUTURA EXIGIDA:
1. **Saudação e Contexto** — Apresentação do período avaliado e objetivo do relatório
2. **Conquistas do Período** — Lista de evoluções em linguagem positiva e concreta
3. **Áreas em Desenvolvimento** — Desafios apresentados com perspectiva de superação
4. **Como a Família Pode Ajudar** — 5 a 8 sugestões práticas para rotina doméstica
5. **Próximos Passos** — O que está planejado para o próximo período
6. **Canais de Comunicação** — Como e quando a família pode buscar a equipe
7. **Espaço para Dúvidas** — Convite aberto para diálogo

IMPORTANTE: Evitar termos como "deficit", "incapaz", "problema". Preferir "área em desenvolvimento", "está aprendendo a", "está descobrindo como".`,
        tags: ['Família', 'Acessível', 'Comunicação', 'Acolhimento'],
      },
      {
        id: 'relatorio-3',
        title: 'Relatório Psicológico com Análise Clínica',
        prompt: `Você é um psicólogo clínico com formação em neuropsicologia e CRP ativo. Elabore um Relatório Psicológico com Análise Clínica:

DADOS DE ENTRADA:
- Nome: [NOME] | Idade: [IDADE] | Sexo: [SEXO]
- Queixa principal: [QUEIXA]
- Histórico de atendimento: [HISTÓRICO]
- Instrumentos aplicados: [INSTRUMENTOS]
- Resultados dos testes: [RESULTADOS]
- Observações clínicas: [OBSERVAÇÕES]
- Histórico de saúde mental: [HISTÓRICO_SM]
- Contexto familiar e social: [CONTEXTO]

ESTRUTURA EXIGIDA (Resolução CFP 007/2003):
1. **Identificação** — Dados do avaliado e do avaliador (nome, CRP, número do documento)
2. **Demanda/Motivo da Avaliação** — Descrição da solicitação e contexto
3. **Procedimentos Utilizados** — Testes, entrevistas, observações, com referência ao manual
4. **Análise dos Resultados** — Interpretação qualitativa e quantitativa, comparando com normas
5. **Síntese Diagnóstica** — Impressão diagnóstica com CID-11/DSM-5, diferenciando características clínicas de variabilidade neurotípica
6. **Fatores Psicodinâmicos** — Dinâmica emocional, mecanismos de defesa, estilo de vinculação
7. **Funcionamento Cognitivo** — Perfil de strengths e weaknesses com base nos testes
8. **Conclusão e Recomendações** — Encaminhamentos, indicação terapêutica, adaptações necessárias
9. **Declaração** — Termo de responsabilidade profissional conforme Resolução CFP

ÉTICA: Manter sigilo profissional, linguagem respeitosa, evitar rotulações estigmatizantes, fundamentar interpretações em evidências.`,
        tags: ['Psicológico', 'Clínico', 'CRP', 'CID-11'],
      },
      {
        id: 'relatorio-4',
        title: 'Relatório de Evolução da Aprendizagem',
        prompt: `Você é um pedagogo com especialização em docência inclusiva e acompanhamento de evolução de aprendizagem em neurodivergentes. Elabore um Relatório de Evolução da Aprendizagem:

DADOS DE ENTRADA:
- Nome do aluno: [NOME]
- Série: [SÉRIE] | Instituição: [INSTITUIÇÃO]
- Período: [PERÍODO]
- MCR e status: [MCR_STATUS]
- Registros de observação: [REGISTROS]
- Produções do aluno: [PRODUÇÕES]
- Intervenções realizadas: [INTERVENÇÕES]

ESTRUTURA EXIGIDA:
1. **Linha do Tempo de Aprendizagem** — Marcos evolutivos cronológicos com evidências
2. **Análise por Competência BNCC** — Evolução em cada competência com nível anterior/atual/projetado
3. **Mapa de Habilidades** — Visualização das habilidades consolidadas/em desenvolvimento/a desenvolver
4. **Fatores Facilitadores** — Condições que otimizaram a aprendizagem
5. **Fatores Dificultadores** — Barreiras identificadas e estratégias de superação
6. **Generalização de Habilidades** — Evidências de transferência para contextos não-treinaados
7. **Projeção de Continuidade** — Metas e estratégias para o próximo período, com indicadores mensuráveis
8. **Anexos** — Referência a produções, registros e evidências documentais

FUNDAMENTAÇÃO: Pedagogia Histórico-Crítica, Teoria das Inteligências Múltiplas (Gardner), UDL (CAST).`,
        tags: ['Evolução', 'Aprendizagem', 'BNCC', 'Competências'],
      },
    ],
  },
  {
    id: 'intervencao',
    label: 'Intervenção Pedagógica',
    icon: BookOpen,
    color: '#0D2045',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-700',
    prompts: [
      {
        id: 'intervencao-1',
        title: 'Adaptações para Alfabetização (Analfabetos/Não-alfabetizados)',
        prompt: `Você é um pedagogo alfabetizador com experiência em métodos multissensoriais para alunos não-alfabetizados com deficiência intelectual ou TEA. Elabore um Plano de Adaptação para Alfabetização:

DADOS DE ENTRADA:
- Nome do aluno: [NOME]
- Idade: [IDADE]
- Diagnóstico: [DIAGNÓSTICO]
- Nível atual de letramento: [NÍVEL_ATUAL]
- Habilidades pré-alfabéticas: [HABILIDADES_PRÉ]
- Interesses e motivações: [INTERESSES]
- Tempo disponível: [TEMPO]
- Recursos: [RECURSOS]

ESTRUTURA EXIGIDA:
1. **Avaliação de Pré-requisitos** — Consciência fonológica, discriminação visual, coordenação motora, memória de trabalho
2. **Método Multissensorial Adaptado** — Integração visual-auditiva-tátil-cinestésica:
   - Letras táteis (lixa, massinha, areia)
   - Associação som-gesto-imagem (fonomímica adaptada)
   - Rastreio ocular com estímulos de alto contraste
3. **Sequência de Ensino** — Ordem de apresentação das famílias silábicas com justificativa fonética
4. **Adaptações para Deficiência Intelectual** — Repetição espaçada, overlearning, sistema de fichas com pictogramas
5. **Adaptações para TEA** — Uso de interesses restritos como ancoragem, rotina visual, social stories para contexto de escrita
6. **Critérios de Progressão** — Quando avançar para a próxima etapa (não por tempo, mas por domínio)
7. **Recursos Digitais Complementares** — Apps e plataformas recomendadas com acessibilidade
8. **Envolvimento da Família** — Atividades simples para reforço domiciliar

BASE: Método Fonovisuoarticulatório, Montessori Adaptado, ABA para aquisição de leitura (DIBELS).`,
        tags: ['Alfabetização', 'Multissensorial', 'Analfabeto', 'Letramento'],
      },
      {
        id: 'intervencao-2',
        title: 'Fragmentação de Tarefas para Deficiência Intelectual',
        prompt: `Você é um pedagogo especialista em educação especial com foco em deficiência intelectual. Elabore um sistema de Fragmentação de Tarefas:

DADOS DE ENTRADA:
- Nome do aluno: [NOME]
- Idade: [IDADE] | Série: [SÉRIE]
- Diagnóstico: [DIAGNÓSTICO] (especificar nível da DI)
- Capacidade atencional: [ATENÇÃO_MINUTOS]
- Habilidades de autonomia: [AUTONOMIA]
- Tarefa-alvo: [TAREFA]
- Contexto: [CONTEXTO]

ESTRUTURA EXIGIDA:
1. **Análise de Tarefa (Task Analysis)** — Decomposição da tarefa em micro-passos (máximo 8 por sequência)
2. **Sistema de Prompting** — Hierarquia de sugestões:
   - Físico (hand-over-hand) → Gestual → Verbal → Visual → Independente
3. **Tempo de Espera** — Duração de pausa entre prompt e resposta esperada (5-15 segundos)
4. **Reforçamento** — Sistema de reforço positivo imediato com tokens ou pontos
5. **Critério de Progressão** — 80% de acerto em 3 sessões consecutivas para avançar
6. **Protocolo de Regressão** — O que fazer quando houver perda de habilidade adquirida
7. **Registro de Dados** — Ficha de coleta com tipo de prompt, latência, precisão
8. **Generalização** — Como transferir a habilidade para contextos naturais

BASE: Análise Comportamental Aplicada (ABA), Ensino Incidente, Sistema TEACCH para estruturação visual.`,
        tags: ['Fragmentação', 'Deficiência Intelectual', 'Task Analysis', 'ABA'],
      },
      {
        id: 'intervencao-3',
        title: 'Estratégias de Apoio em Sala para TEA',
        prompt: `Você é um psicólogo educacional com especialização em Transtorno do Espectro Autista e prática em sala de aula inclusiva. Elabore Estratégias de Apoio em Sala de Aula para TEA:

DADOS DE ENTRADA:
- Nome do aluno: [NOME]
- Idade: [IDADE] | Série: [SÉRIE]
- Nível de suporte: [NÍVEL_SUPORTE] (1/2/3)
- Perfil sensorial: [PERFIL_SENSORIAL]
- Comunicação: verbal / funcional / alternativa (especificar)
- Interesses restritos: [INTERESSES]
- Comportamentos-desafio: [COMPORTAMENTOS]
- Equipe disponível: [EQUIPE]

ESTRUTURA EXIGIDA:
1. **Ambiente Físico Adaptado** — Zona de trabalho individual, redução de estímulos, marcadores visuais de fronteira, rotina visual na parede
2. **Rotina Visual Personalizada** — Sequência de atividades com imagens/fotos, tempo de cada atividade, transições sinalizadas
3. **Sistema de Comunicação** — PECS, prancha de comunicação, linguagem de sinais ou adaptação verbal com suporte visual
4. **Gestão de Transições** — Antecedência (timer visual), objeto de transição, música de transição, cartão "terminou/ainda não"
5. **Estratégias para Comportamentos-desafio** — Análise funcional (ABC), estratégias proativas, substituição comportamental, plano de crise
6. **Uso de Interesses Especiais como Recurso Pedagógico** — Incorporação nas atividades como motivador e ancoragem de conteúdo
7. **Apoio Social** — Sistema de buddies, script social, histórias sociais (Carol Gray), treinamento de habilidades sociais
8. **Avaliação Adaptada** — Formatos alternativos, tempo estendido, ambiente reduzido

BASE: TEACCH, PECS (Bondy & Frost), Social Stories (Carol Gray), Modelo DENVER, Princípios ABA.`,
        tags: ['TEA', 'Autismo', 'Sala de Aula', 'Estratégias'],
      },
      {
        id: 'intervencao-4',
        title: 'Gestão de Atenção para TDAH',
        prompt: `Você é um neuropsicólogo especializado em TDAH com experiência em intervenções não-farmacológicas em contexto escolar. Elabore um Plano de Gestão de Atenção para TDAH:

DADOS DE ENTRADA:
- Nome do aluno: [NOME]
- Idade: [IDADE] | Série: [SÉRIE]
- Subtipo TDAH: [SUBTIPO] (desatento/hiperativo-impulsivo/combinado)
- Perfil atencional: [PERFIL_ATENCIONAL]
- Comorbidades: [COMORBIDADES]
- Medicação (se aplicável): [MEDICAÇÃO]
- Rotina escolar: [ROTINA]

ESTRUTURA EXIGIDA:
1. **Higiene Atencional** — Organização do ambiente para minimizar distrações:
   - Posicionamento estratégico na sala (perto do professor, longe de janelas)
   - Redução de estímulos visuais no campo periférico
   - Cancelamento de ruído (fones ou protetores)
2. **Estruturação de Tarefas** — Chunking, instruções claras, checklist visual, micro-prazos
3. **Sistema de Prompts Externos** — Códigos visuais entre professor-aluno, timer visível, vibração no pulso
4. **Movimento Regulado** — Pausas motoras programadas, fidget tools, estações de trabalho alternativas
5. **Gamificação do Engajamento** — Sistema de pontos, níveis, desafios com recompensa imediata
6. **Regulação Emocional** — Estratégias para frustração por distração, autoinstrução, reframe de falhas atencionais
7. **Protocolo de Provas/Avaliações** — Tempo adicional, ambiente reduzido, leitura de enunciados, pausas programadas
8. **Parceria Professor-Família** — Caderno de comunicação diária, alinhamento de estratégias casa-escola

BASE: Modelos de Funções Executivas (Barkley), Treinamento em Autoinstrução (Meichenbaum), Intervenção Comportamental Escolar (Pelham).`,
        tags: ['TDAH', 'Atenção', 'Funções Executivas', 'Gestão'],
      },
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance Legal',
    icon: Shield,
    color: '#8B5CF6',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-700',
    prompts: [
      {
        id: 'compliance-1',
        title: 'Verificação de Conformidade com Art. 28 da LBI',
        prompt: `Você é um advogado especialista em direito da pessoa com deficiência e educação inclusiva. Realize uma Verificação de Conformidade com o Artigo 28 da Lei Brasileira de Inclusão (LBI — Lei 13.146/2015):

DADOS DE ENTRADA:
- Instituição: [INSTITUIÇÃO]
- Total de alunos com deficiência matriculados: [TOTAL_NEE]
- Salas de recursos funcionando: [SALAS_RECURSOS]
- Profissionais de apoio disponíveis: [PROFISSIONAIS_APOIO]
- Adaptações curriculares documentadas: [ADAPTAÇÕES]
- Acessibilidade arquitetônica: [ACESSIBILIDADE]
- Tecnologias assistivas disponíveis: [TECNOLOGIAS]
- Formação continuada dos professores: [FORMAÇÃO]

VERIFICAR CONFORMIDADE COM:
Art. 28 — Inciso I: Educação inclusiva em todos os níveis
Art. 28 — Inciso II: AEE complementar/suplementar
Art. 28 — Inciso III: Projeto pedagógico que contemple a inclusão
Art. 28 — Inciso IV: Oferta de recursos de acessibilidade
Art. 28 — Inciso V: Profissionais de apoio escolar
Art. 28 — Inciso VI: Adaptações razoáveis
Art. 28 — Inciso VII: Terminalidade específica
Art. 28 — Inciso VIII: Planejamento de estudo individualizado

ESTRUTURA EXIGIDA:
1. **Checklist de Conformidade** — Para cada inciso: status (conforme/parcialmente/não conforme), evidência, lacuna identificada
2. **Análise de Risco Jurídico** — Classificação do nível de exposição (alto/médio/baixo) por item
3. **Plano de Adequação** — Ações prioritárias com prazo e responsável para cada não conformidade
4. **Documentação Necessária** — Laudos, relatórios, atas, registros faltantes
5. **Referências Normativas** — LBI, Decreto 10.502/2020, Nota Técnica 04/2014, Resolução CNE/CEB 4/2009
6. **Parecer Conclusivo** — Síntese do estado de conformidade e recomendações finais

IMPORTANTE: Este documento tem caráter consultivo e orientativo, não substitui parecer jurídico formal.`,
        tags: ['LBI', 'Art. 28', 'Inclusão', 'Conformidade'],
      },
      {
        id: 'compliance-2',
        title: 'Revisão de Governança de Dados de Saúde (LGPD)',
        prompt: `Você é um consultor em proteção de dados pessoais com especialização em dados de saúde sensíveis no contexto educacional (LGPD — Lei 13.709/2018). Realize uma Revisão de Governança de Dados de Saúde:

DADOS DE ENTRADA:
- Instituição: [INSTITUIÇÃO]
- Tipos de dados de saúde coletados: [TIPOS_DADOS]
- Formas de coleta: [FORMAS_COLETA]
- Armazenamento: [ARMAZENAMENTO]
- Compartilhamento: [COMPARTILHAMENTO]
- Profissionais com acesso: [PROFISSIONAIS_ACESSO]
- Consentimentos obtidos: [CONSENTIMENTOS]
- Incidentes registrados: [INCIDENTES]

VERIFICAR CONFORMIDADE COM:
Art. 5º — Dados pessoais sensíveis (saúde, genética, biometria)
Art. 7º — Bases legais para tratamento (consentimento, obrigação legal, exercício de direitos)
Art. 11º — Tratamento de dados sensíveis (regras específicas)
Art. 46º — Segurança da informação
Art. 48º — Comunicação de incidentes

ESTRUTURA EXIGIDA:
1. **Inventário de Dados Sensíveis** — Mapeamento completo dos dados de saúde coletados, com finalidade, base legal, prazo de retenção
2. **Análise de Bases Legais** — Verificação se cada tratamento está amparado em base legal adequada
3. **Política de Acesso** — Quem acessa, quando, com qual justificativa, rastreabilidade
4. **Consentimento** — Modelos de TCLE para famílias, verificação de validade, revogabilidade
5. **Segurança da Informação** — Criptografia, controle de acesso, backup, log de auditoria
6. **Compartilhamento de Dados** — Com quem, para quê, com quais salvaguardas (convênios, contratos)
7. **Plano de Resposta a Incidentes** — Notificação à ANPD, comunicação ao titular, medidas de contenção
8. **Recomendações de Adequação** — Ações prioritárias classificadas por urgência

IMPORTANTE: Dados de saúde de menores são duplamente sensíveis. Exigir consentimento dos responsáveis legais com informação clara e específica.`,
        tags: ['LGPD', 'Dados Saúde', 'Privacidade', 'Governança'],
      },
      {
        id: 'compliance-3',
        title: 'Implementação de AEE conforme LDB',
        prompt: `Você é um consultor em políticas educacionais inclusivas com expertise na LDB (Lei 9.394/96) e nas normativas sobre Atendimento Educacional Especializado. Elabore um Guia de Implementação de AEE conforme LDB:

DADOS DE ENTRADA:
- Instituição: [INSTITUIÇÃO]
- Modalidade: [MODALIDADE] (regular/EJA/Especial)
- Alunos com NEE matriculados: [ALUNOS_NEE]
- Tipos de deficiência: [TIPOS_DEFICIÊNCIA]
- Sala de recursos existente: [SALA_EXISTENTE]
- Profissionais de AEE: [PROFISSIONAIS_AEE]
- Formação dos profissionais: [FORMAÇÃO]
- Orçamento disponível: [ORÇAMENTO]

BASE NORMATIVA:
- LDB Art. 58-60 — Educação especial como modalidade transversal
- Decreto 7.611/2011 — AEE complementar e suplementar
- Resolução CNE/CEB 4/2009 — Diretrizes operacionais para AEE
- Nota Técnica 04/2014 — AEE e Inclusão
- Parecer CNE/CEB 13/2009 — Orientações para AEE na educação básica

ESTRUTURA EXIGIDA:
1. **Diagnóstico Institucional** — Estado atual da implementação de AEE com gap analysis
2. **Sala de Recursos Multifuncionais** — Especificações do MEC, mobiliário, equipamentos, materiais
3. **Plano de Atendimento** — Cronograma semanal de atendimentos por aluno, tipo de NEE, profissional responsável
4. **Elaboração do Plano de AEE** — Template para cada aluno: identificação, deficiência/NEE, objetivos, atividades, cronograma, avaliação
5. **Formação Continuada** — Plano de capacitação para professores do AEE e professores regentes
6. **Articulação com Ensino Comum** — Protocolo de comunicação entre professor regente e professor do AEE
7. **Documentação e Registros** — Frequência, planos individuais, relatórios trimestrais, atas
8. **Indicadores de Qualidade** — Metas e métricas para avaliar a eficácia do AEE
9. **Cronograma de Implementação** — Fases com marcos e responsáveis

IMPORTANTE: O AEE não substitui a escolarização, é complementar/suplementar. Deve ocorrer no turno contrário ou em horário específico, nunca em substituição às aulas regulares.`,
        tags: ['AEE', 'LDB', 'Sala de Recursos', 'Implementação'],
      },
    ],
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function HubPromptsModule() {
  const [activeCategory, setActiveCategory] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = useCallback(async (promptId: string, promptText: string) => {
    try {
      await navigator.clipboard.writeText(promptText)
      setCopiedId(promptId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = promptText
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiedId(promptId)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }, [])

  const filteredCategories = CATEGORIES
    .filter((cat) => activeCategory === 'todos' || cat.id === activeCategory)
    .map((cat) => ({
      ...cat,
      prompts: cat.prompts.filter((p) => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          p.prompt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        )
      }),
    }))
    .filter((cat) => cat.prompts.length > 0)

  const totalPrompts = CATEGORIES.reduce((sum, cat) => sum + cat.prompts.length, 0)

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#0A1628' }}
          >
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#0A1628' }}>
              Hub de Prompts
            </h2>
            <p className="text-sm text-muted-foreground">
              Coleção curada de prompts profissionais para educação inclusiva
            </p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="text-xs px-3 py-1 self-start sm:self-auto"
          style={{ backgroundColor: '#FFF3ED', color: '#FF6B2B' }}
        >
          <Sparkles className="w-3 h-3 mr-1" />
          {totalPrompts} prompts disponíveis
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar prompts por título, conteúdo ou tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <ScrollArea className="w-full">
          <TabsList className="w-full sm:w-auto flex gap-1 p-1 bg-muted/50">
            <TabsTrigger value="todos" className="text-xs sm:text-sm gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Todos</span>
            </TabsTrigger>
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="text-xs sm:text-sm gap-1.5"
              >
                <cat.icon className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{cat.label}</span>
                <span className="lg:hidden">
                  {cat.label.split(' ')[0]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {/* Content for each tab */}
        <TabsContent value="todos" className="mt-6">
          <PromptGrid
            categories={filteredCategories}
            copiedId={copiedId}
            onCopy={handleCopy}
          />
        </TabsContent>

        {CATEGORIES.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="mt-6">
            <PromptGrid
              categories={filteredCategories.filter((c) => c.id === cat.id)}
              copiedId={copiedId}
              onCopy={handleCopy}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Empty state */}
      {filteredCategories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Search className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">Nenhum prompt encontrado</p>
          <p className="text-sm mt-1">
            Tente buscar com outros termos ou altere a categoria
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Prompt Grid Component ───────────────────────────────────────────────────

interface PromptGridProps {
  categories: CategoryData[]
  copiedId: string | null
  onCopy: (id: string, text: string) => void
}

function PromptGrid({ categories, copiedId, onCopy }: PromptGridProps) {
  return (
    <div className="space-y-8">
      {categories.map((cat) => (
        <div key={cat.id}>
          {/* Category Header */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: cat.color + '18' }}
            >
              <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
            </div>
            <h3 className="font-semibold text-base" style={{ color: cat.color }}>
              {cat.label}
            </h3>
            <Badge
              variant="outline"
              className="text-xs ml-1"
              style={{
                borderColor: cat.color + '40',
                color: cat.color,
              }}
            >
              {cat.prompts.length} prompt{cat.prompts.length > 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Prompt Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {cat.prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                category={cat}
                isCopied={copiedId === prompt.id}
                onCopy={onCopy}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Prompt Card Component ───────────────────────────────────────────────────

interface PromptCardProps {
  prompt: PromptData
  category: CategoryData
  isCopied: boolean
  onCopy: (id: string, text: string) => void
}

function PromptCard({ prompt, category, isCopied, onCopy }: PromptCardProps) {
  const [expanded, setExpanded] = useState(false)
  const isLong = prompt.prompt.length > 300
  const displayText = isLong && !expanded
    ? prompt.prompt.slice(0, 300) + '...'
    : prompt.prompt

  return (
    <Card
      className="border overflow-hidden transition-all duration-200 hover:shadow-md group"
      style={{ borderColor: category.color + '30' }}
    >
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <Badge
                className="text-[10px] px-2 py-0 border-0 font-medium"
                style={{
                  backgroundColor: category.color + '18',
                  color: category.color,
                }}
              >
                {category.label.split(' ').slice(0, 2).join(' ')}
              </Badge>
            </div>
            <CardTitle className="text-sm font-bold leading-tight" style={{ color: '#0A1628' }}>
              {prompt.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0 space-y-3">
        {/* Prompt code block */}
        <div
          className="relative rounded-lg p-3 overflow-hidden"
          style={{ backgroundColor: '#0A1628' }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-400/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
            <div className="w-2 h-2 rounded-full bg-green-400/60" />
            <span className="text-[10px] text-white/30 ml-2 font-mono">
              prompt.conecta
            </span>
          </div>
          <ScrollArea className="max-h-48">
            <pre className="text-[11px] leading-relaxed font-mono whitespace-pre-wrap break-words" style={{ color: '#C8D6E5' }}>
              {displayText}
            </pre>
          </ScrollArea>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[10px] font-medium mt-2 hover:underline"
              style={{ color: category.color }}
            >
              {expanded ? '← Ver menos' : 'Ver prompt completo →'}
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {prompt.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-[10px] px-1.5 py-0 font-normal"
              style={{
                borderColor: category.color + '30',
                color: category.color + 'CC',
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Copy Button */}
        <Separator className="opacity-50" />
        <Button
          onClick={() => onCopy(prompt.id, prompt.prompt)}
          variant={isCopied ? 'default' : 'outline'}
          size="sm"
          className="w-full text-xs h-8 transition-all duration-300"
          style={
            isCopied
              ? {
                  backgroundColor: '#00D4A0',
                  borderColor: '#00D4A0',
                  color: '#fff',
                }
              : {
                  borderColor: category.color + '40',
                  color: category.color,
                }
          }
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1.5" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copiar Prompt
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
