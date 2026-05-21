import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json()

    const ZAI = await import('z-ai-web-dev-sdk').then(m => m.default)
    const zai = await ZAI.create()

    const systemPrompt = `Você é o assistente de IA do NeuroLynx, um sistema nacional de educação adaptativa e inclusão cognitiva. Você ajuda professores, psicólogos e coordenadores com:
- Recomendações pedagógicas personalizadas
- Estratégias de inclusão escolar
- Adaptações curriculares para alunos neurodivergentes
- Análises de desenvolvimento cognitivo
- Sugestões de intervenções multidisciplinares
- Orientações sobre educação especial e LAEE

Responda sempre em português brasileiro, de forma didática e profissional. Baseie-se em evidências científicas e nas diretrizes da BNCC, ECA e LGPD quando aplicável.`

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...(context || []).map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'user', content: message },
      ],
      thinking: { type: 'disabled' },
    })

    const reply =
      completion.choices[0]?.message?.content ||
      'Desculpe, não consegui gerar uma resposta.'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('AI Chat error:', error)
    return NextResponse.json(
      { error: 'Erro ao processar mensagem' },
      { status: 500 }
    )
  }
}
