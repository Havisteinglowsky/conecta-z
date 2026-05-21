// ============================================
// NEUROLYNX - Constants for Brazilian Education
// ============================================

// ---- UF (Unidades Federativas) - 27 Brazilian States ----
export const UF_LIST = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
] as const

// ---- Cor / Raça ----
export const COR_RACA_OPTIONS = [
  { value: 'Branca', label: 'Branca' },
  { value: 'Preta', label: 'Preta' },
  { value: 'Parda', label: 'Parda' },
  { value: 'Amarela', label: 'Amarela' },
  { value: 'Indígena', label: 'Indígena' },
  { value: 'Não declarada', label: 'Não declarada' },
] as const

// ---- Sexo ----
export const SEXO_OPTIONS = [
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Feminino', label: 'Feminino' },
  { value: 'Não-binário', label: 'Não-binário' },
] as const

// ---- Nacionalidade ----
export const NACIONALIDADE_OPTIONS = [
  { value: 'Brasileira', label: 'Brasileira' },
  { value: 'Brasileira naturalizada', label: 'Brasileira naturalizada' },
  { value: 'Estrangeira', label: 'Estrangeira' },
] as const

// ---- Tipo de Deficiência ----
export const TIPO_DEFICIENCIA_OPTIONS = [
  { value: 'Auditiva', label: 'Auditiva' },
  { value: 'Visual', label: 'Visual' },
  { value: 'Física', label: 'Física' },
  { value: 'Intelectual', label: 'Intelectual' },
  { value: 'Múltipla', label: 'Múltipla' },
  { value: 'Autismo', label: 'Transtorno do Espectro Autista (TEA)' },
  { value: 'TDAH', label: 'TDAH' },
  { value: 'Outra', label: 'Outra' },
] as const

// ---- Turno ----
export const TURNO_OPTIONS = [
  { value: 'Matutino', label: 'Matutino' },
  { value: 'Vespertino', label: 'Vespertino' },
  { value: 'Noturno', label: 'Noturno' },
  { value: 'Integral', label: 'Integral' },
] as const

// ---- Situação do Aluno ----
export const SITUACAO_ALUNO_OPTIONS = [
  { value: 'Ativo', label: 'Ativo' },
  { value: 'Transferido', label: 'Transferido' },
  { value: 'Evadido', label: 'Evadido' },
  { value: 'Afastado', label: 'Afastado' },
] as const

// ---- Modalidade ----
export const MODALIDADE_OPTIONS = [
  { value: 'Regular', label: 'Regular' },
  { value: 'EJA', label: 'EJA (Educação de Jovens e Adultos)' },
  { value: 'Especial', label: 'Especial' },
  { value: 'Profissionalizante', label: 'Profissionalizante' },
] as const

// ---- Escolaridade ----
export const ESCOLARIDADE_OPTIONS = [
  { value: 'Ensino Fundamental', label: 'Ensino Fundamental' },
  { value: 'Ensino Médio', label: 'Ensino Médio' },
  { value: 'Superior Incompleto', label: 'Superior Incompleto' },
  { value: 'Superior Completo', label: 'Superior Completo' },
  { value: 'Especialização', label: 'Especialização' },
  { value: 'Mestrado', label: 'Mestrado' },
  { value: 'Doutorado', label: 'Doutorado' },
  { value: 'Pós-Doutorado', label: 'Pós-Doutorado' },
] as const

// ---- Regime Jurídico ----
export const REGIME_JURIDICO_OPTIONS = [
  { value: 'Efetivo', label: 'Efetivo' },
  { value: 'Contrato', label: 'Contrato' },
  { value: 'Estágio', label: 'Estágio' },
  { value: 'Temporário', label: 'Temporário' },
] as const

// ---- Tipo de Instituição ----
export const TIPO_INSTITUICAO_OPTIONS = [
  { value: 'Federal', label: 'Federal' },
  { value: 'Estadual', label: 'Estadual' },
  { value: 'Municipal', label: 'Municipal' },
  { value: 'Particular', label: 'Particular' },
] as const

// ---- Dependência Administrativa ----
export const DEPENDENCIA_ADMIN_OPTIONS = [
  { value: 'Federal', label: 'Federal' },
  { value: 'Estadual', label: 'Estadual' },
  { value: 'Municipal', label: 'Municipal' },
  { value: 'Privada', label: 'Privada' },
] as const

// ---- Rede ----
export const REDE_OPTIONS = [
  { value: 'Pública', label: 'Pública' },
  { value: 'Privada', label: 'Privada' },
] as const

// ---- Regulamentação ----
export const REGULAMENTACAO_OPTIONS = [
  { value: 'Ativa', label: 'Ativa' },
  { value: 'Em regularização', label: 'Em regularização' },
] as const

// ---- Etapas de Ensino ----
export const ETAPAS_ENSINO_OPTIONS = [
  { value: 'Educação Infantil', label: 'Educação Infantil' },
  { value: 'Ensino Fundamental I', label: 'Ensino Fundamental I' },
  { value: 'Ensino Fundamental II', label: 'Ensino Fundamental II' },
  { value: 'Ensino Médio', label: 'Ensino Médio' },
  { value: 'Ensino Superior', label: 'Ensino Superior' },
] as const

// ---- Nível da Turma ----
export const NIVEL_TURMA_OPTIONS = [
  { value: 'Infantil', label: 'Infantil' },
  { value: 'Fundamental I', label: 'Fundamental I' },
  { value: 'Fundamental II', label: 'Fundamental II' },
  { value: 'Médio', label: 'Médio' },
] as const

// ---- Tipo de Registro ----
export const TIPO_REGISTRO_OPTIONS = [
  { value: 'Pedagógica', label: 'Pedagógica' },
  { value: 'Psicológica', label: 'Psicológica' },
  { value: 'Comportamental', label: 'Comportamental' },
  { value: 'Evolução', label: 'Evolução' },
  { value: 'Familiar', label: 'Familiar' },
  { value: 'Outra', label: 'Outra' },
] as const

// ---- Categoria de Registro ----
export const CATEGORIA_REGISTRO_OPTIONS = [
  { value: 'Observação', label: 'Observação' },
  { value: 'Intervenção', label: 'Intervenção' },
  { value: 'Avaliação', label: 'Avaliação' },
  { value: 'Acompanhamento', label: 'Acompanhamento' },
] as const

// ---- Tipo de Relatório ----
export const TIPO_RELATORIO_OPTIONS = [
  { value: 'Pedagógico', label: 'Pedagógico' },
  { value: 'Psicológico', label: 'Psicológico' },
  { value: 'Multidisciplinar', label: 'Multidisciplinar' },
  { value: 'Governamental', label: 'Governamental' },
  { value: 'Familiar', label: 'Familiar' },
] as const

// ---- Prioridade ----
export const PRIORIDADE_OPTIONS = [
  { value: 'Baixa', label: 'Baixa' },
  { value: 'Média', label: 'Média' },
  { value: 'Alta', label: 'Alta' },
  { value: 'Urgente', label: 'Urgente' },
] as const

// ---- Status do Registro ----
export const STATUS_REGISTRO_OPTIONS = [
  { value: 'Aberto', label: 'Aberto' },
  { value: 'Em andamento', label: 'Em andamento' },
  { value: 'Concluído', label: 'Concluído' },
] as const

// ---- Status do Relatório ----
export const STATUS_RELATORIO_OPTIONS = [
  { value: 'Rascunho', label: 'Rascunho' },
  { value: 'Revisão', label: 'Revisão' },
  { value: 'Finalizado', label: 'Finalizado' },
] as const

// ---- Nível de Evolução ----
export const NIVEL_EVOLUCAO_OPTIONS = [
  { value: 'Regressão', label: 'Regressão' },
  { value: 'Estável', label: 'Estável' },
  { value: 'Evolução lenta', label: 'Evolução lenta' },
  { value: 'Evolução satisfatória', label: 'Evolução satisfatória' },
  { value: 'Evolução excelente', label: 'Evolução excelente' },
] as const

// ---- Estado Emocional ----
export const ESTADO_EMOCIONAL_OPTIONS = [
  { value: 'Estável', label: 'Estável' },
  { value: 'Instável', label: 'Instável' },
  { value: 'Em transição', label: 'Em transição' },
] as const

// ---- Área de Especialização do Psicólogo ----
export const AREA_ESPECIALIZACAO_PSICOLOGO_OPTIONS = [
  { value: 'Neuropsicologia', label: 'Neuropsicologia' },
  { value: 'Psicologia Escolar', label: 'Psicologia Escolar' },
  { value: 'Psicologia Clínica', label: 'Psicologia Clínica' },
  { value: 'Psicologia Educacional', label: 'Psicologia Educacional' },
  { value: 'Psicopedagogia', label: 'Psicopedagogia' },
  { value: 'Outra', label: 'Outra' },
] as const

// ---- Abordagem Terapêutica ----
export const ABORDAGEM_TERAPEUTICA_OPTIONS = [
  { value: 'Cognitivo-Comportamental', label: 'Cognitivo-Comportamental (TCC)' },
  { value: 'Psicanalítica', label: 'Psicanalítica' },
  { value: 'Humanista', label: 'Humanista' },
  { value: 'Sistêmica', label: 'Sistêmica' },
  { value: 'Existencial', label: 'Existencial' },
  { value: 'Integrativa', label: 'Integrativa' },
  { value: 'Neuropsicológica', label: 'Neuropsicológica' },
  { value: 'Outra', label: 'Outra' },
] as const

// ---- Vínculo do Acompanhante ----
export const VINCULO_ACOMPANHANTE_OPTIONS = [
  { value: 'Pai', label: 'Pai' },
  { value: 'Mãe', label: 'Mãe' },
  { value: 'Tutor', label: 'Tutor' },
  { value: 'Acompanhante Terapêutico', label: 'Acompanhante Terapêutico' },
  { value: 'Cuidador', label: 'Cuidador' },
  { value: 'Estagiário', label: 'Estagiário' },
] as const

// ---- Função do Acompanhante ----
export const FUNCAO_ACOMPANHANTE_OPTIONS = [
  { value: 'Acompanhante escolar', label: 'Acompanhante escolar' },
  { value: 'Cuidador', label: 'Cuidador' },
  { value: 'Tradutor intérprete de Libras', label: 'Tradutor intérprete de Libras' },
  { value: 'Guia-intérprete', label: 'Guia-intérprete' },
  { value: 'Auxiliar de sala', label: 'Auxiliar de sala' },
  { value: 'Mediador escolar', label: 'Mediador escolar' },
] as const

// ---- Formação do Acompanhante ----
export const FORMACAO_ACOMPANHANTE_OPTIONS = [
  { value: 'Pedagogia', label: 'Pedagogia' },
  { value: 'Psicologia', label: 'Psicologia' },
  { value: 'Terapia Ocupacional', label: 'Terapia Ocupacional' },
  { value: 'Fisioterapia', label: 'Fisioterapia' },
  { value: 'Fonoaudiologia', label: 'Fonoaudiologia' },
  { value: 'Serviço Social', label: 'Serviço Social' },
  { value: 'Outra', label: 'Outra' },
] as const

// ---- Estilos de Aprendizagem ----
export const ESTILOS_APRENDIZAGEM_OPTIONS = [
  { value: 'Visual', label: 'Visual' },
  { value: 'Auditivo', label: 'Auditivo' },
  { value: 'Cinestésico', label: 'Cinestésico' },
  { value: 'Leitor/Escritor', label: 'Leitor/Escritor' },
] as const

// ---- Parentesco do Responsável ----
export const PARENTESCO_RESPONSAVEL_OPTIONS = [
  { value: 'Pai', label: 'Pai' },
  { value: 'Mãe', label: 'Mãe' },
  { value: 'Tutor', label: 'Tutor' },
  { value: 'Avó/Avô', label: 'Avó/Avô' },
  { value: 'Irmão/Irmã', label: 'Irmão/Irmã' },
  { value: 'Outro', label: 'Outro' },
] as const

// ---- Cargo do Professor ----
export const CARGO_PROFESSOR_OPTIONS = [
  { value: 'Professor', label: 'Professor' },
  { value: 'Coordenador', label: 'Coordenador' },
  { value: 'Diretor', label: 'Diretor' },
  { value: 'Vice-Diretor', label: 'Vice-Diretor' },
  { value: 'Orientador Educacional', label: 'Orientador Educacional' },
  { value: 'Pedagogo', label: 'Pedagogo' },
] as const

// ---- Alimentação ----
export const ALIMENTACAO_OPTIONS = [
  { value: 'Integral', label: 'Integral' },
  { value: 'Parcial', label: 'Parcial' },
  { value: 'Nenhum', label: 'Nenhum' },
] as const

// ---- Estado Civil ----
export const ESTADO_CIVIL_OPTIONS = [
  { value: 'Solteiro(a)', label: 'Solteiro(a)' },
  { value: 'Casado(a)', label: 'Casado(a)' },
  { value: 'Divorciado(a)', label: 'Divorciado(a)' },
  { value: 'Viúvo(a)', label: 'Viúvo(a)' },
  { value: 'União estável', label: 'União estável' },
] as const

// ---- Pós-Graduação ----
export const POS_GRADUACAO_OPTIONS = [
  { value: 'Especialização', label: 'Especialização' },
  { value: 'Mestrado', label: 'Mestrado' },
  { value: 'Doutorado', label: 'Doutorado' },
  { value: 'Pós-Doutorado', label: 'Pós-Doutorado' },
] as const

// ---- BNCC Competências Gerais (10 competências) ----
export const BNCC_COMPETENCIAS_GERAIS = [
  {
    value: '1',
    label: 'Competência 1',
    description:
      'Valorizar e utilizar os conhecimentos historicamente construídos sobre o mundo físico, social, cultural e digital para entender e explicar a realidade, continuar aprendendo e colaborar para a construção de uma sociedade justa, democrática e inclusiva.',
  },
  {
    value: '2',
    label: 'Competência 2',
    description:
      'Exercitar a curiosidade intelectual e recorrer à abordagem própria das ciências, incluindo a investigação, a reflexão, a análise crítica, a imaginação e a criatividade, para investigar causas, elaborar e testar hipóteses, formular e resolver problemas e criar soluções (inclusive tecnológicas) com base nos conhecimentos das diferentes áreas.',
  },
  {
    value: '3',
    label: 'Competência 3',
    description:
      'Valorizar e fruir as diversas manifestações artísticas e culturais, das locais às mundiais, e também participar de práticas diversificadas da produção artístico-cultural.',
  },
  {
    value: '4',
    label: 'Competência 4',
    description:
      'Utilizar diferentes linguagens – verbal (oral ou visual-motora, como Libras, e escrita), corporal, visual, sonora e digital –, bem como conhecimentos das linguagens artística, matemática e científica, para se expressar e partilhar informações, experiências, ideias e sentimentos em diferentes contextos e produzir sentidos que levem ao entendimento mútuo.',
  },
  {
    value: '5',
    label: 'Competência 5',
    description:
      'Compreender, utilizar e criar tecnologias digitais de informação e comunicação de forma crítica, significativa, reflexiva e ética nas diversas práticas sociais (incluindo as escolares) para se comunicar, acessar e disseminar informações, produzir conhecimentos, resolver problemas e exercer protagonismo e autoria na vida pessoal e coletiva.',
  },
  {
    value: '6',
    label: 'Competência 6',
    description:
      'Argumentar com base em fatos, dados e informações confiáveis, para formular, negociar e defender ideias, pontos de vista e decisões comuns que respeitem e promovam os direitos humanos, a consciência socioambiental e o consumo responsável em âmbito local, regional e global, com posicionamento ético em relação ao cuidado de si mesmo, dos outros e do planeta.',
  },
  {
    value: '7',
    label: 'Competência 7',
    description:
      'Reconhecer que a educação é um direito público e um bem comum, e que a escola é um espaço de discussão e reflexão, de acolhimento e de valorização da diversidade, de combate às diversas formas de preconceito, discriminação e violência, e de construção de uma cultura de paz.',
  },
  {
    value: '8',
    label: 'Competência 8',
    description:
      'Conhecer-se, apreender-se e cuidar de sua saúde física e emocional, compreendendo-se na diversidade humana e reconhecendo seus sentimentos, emoções e sensações, sem cair em estereótipos, e contribuindo para o equilíbrio e bem-estar de si mesmo e dos outros.',
  },
  {
    value: '9',
    label: 'Competência 9',
    description:
      'Exercitar a empatia, o diálogo, a resolução de conflitos e a cooperação, fazendo-se respeitar e promovendo o respeito ao outro e aos direitos humanos, com acolhimento e valorização da diversidade de indivíduos e de grupos sociais, seus saberes, identidades, culturas e potencialidades, sem preconceitos de qualquer natureza.',
  },
  {
    value: '10',
    label: 'Competência 10',
    description:
      'Localizar, distinguir e utilizar, de forma crítica e reflexiva, as diversas fontes de informação, adotando estratégias de seleção, validação, verificação e comparação, para produzir e socializar novos conhecimentos, problematizando soluções e conclusões.',
  },
] as const

// ---- Author Role (for Records) ----
export const AUTHOR_ROLE_OPTIONS = [
  { value: 'Professor', label: 'Professor' },
  { value: 'Psicólogo', label: 'Psicólogo' },
  { value: 'Coordenador', label: 'Coordenador' },
  { value: 'Outro', label: 'Outro' },
] as const

// ---- Tipo Sanguíneo ----
export const TIPO_SANGUINEO_OPTIONS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
] as const
