'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Bot,
  Send,
  User,
  Sparkles,
  Brain,
  BookOpen,
  Heart,
  GraduationCap,
  Lightbulb,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_PROMPTS = [
  {
    icon: Brain,
    label: 'Estratégias para TDAH',
    prompt: 'Quais estratégias pedagógicas são mais eficazes para alunos com TDAH em sala de aula?',
  },
  {
    icon: Heart,
    label: 'Inclusão de TEA',
    prompt: 'Como adaptar o ambiente escolar para incluir alunos com Transtorno do Espectro Autista?',
  },
  {
    icon: GraduationCap,
    label: 'Adaptação curricular',
    prompt: 'Como elaborar uma adaptação curricular para um aluno com deficiência intelectual no ensino fundamental?',
  },
  {
    icon: BookOpen,
    label: 'Avaliação inclusiva',
    prompt: 'Quais práticas de avaliação são mais inclusivas para alunos neurodivergentes?',
  },
  {
    icon: Lightbulb,
    label: 'LAEE e BNCC',
    prompt: 'Como articular o LAEE com as diretrizes da BNCC para garantir a inclusão escolar?',
  },
  {
    icon: Sparkles,
    label: 'Intervenção multidisciplinar',
    prompt: 'Como estruturar uma intervenção multidisciplinar para um aluno com dificuldades de aprendizagem e aspectos emocionais?',
  },
]

export default function AIAssistantModule() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMessage: ChatMessage = { role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Build context from last 10 messages
      const context = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, context }),
      })

      if (!res.ok) {
        throw new Error('Erro na comunicação com a IA')
      }

      const data = await res.json()
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      toast.error('Erro ao enviar mensagem. Tente novamente.')
      // Remove the user message if failed
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
          <Bot className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Assistente de IA</h2>
          <p className="text-sm text-muted-foreground">
            Orientações pedagógicas e estratégias de inclusão
          </p>
        </div>
      </div>

      {/* Main Chat Card */}
      <Card className="border-0 shadow-sm flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        {/* Messages Area */}
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollRef}>
            <div className="p-4 space-y-4">
              {messages.length === 0 ? (
                /* Welcome State */
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Olá! Sou o assistente NeuroLynx
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                    Posso ajudar com recomendações pedagógicas, estratégias de inclusão,
                    adaptações curriculares e muito mais. Escolha uma sugestão ou faça
                    sua pergunta:
                  </p>

                  {/* Suggested Prompts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl">
                    {SUGGESTED_PROMPTS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(s.prompt)}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center shrink-0">
                          <s.icon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Message List */
                <>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          msg.role === 'assistant'
                            ? 'bg-emerald-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          <Bot className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <User className="w-4 h-4 text-gray-600" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.role === 'assistant'
                            ? 'bg-gray-50 text-gray-800 rounded-tl-sm'
                            : 'bg-emerald-600 text-white rounded-tr-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Quick Suggestions (when chat has messages) */}
        {messages.length > 0 && messages.length < 2 && (
          <>
            <Separator />
            <div className="px-4 py-2">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {SUGGESTED_PROMPTS.slice(0, 3).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s.prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-xs font-medium text-gray-600 hover:text-emerald-700 whitespace-nowrap"
                  >
                    <s.icon className="w-3 h-3" />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Input Area */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Faça uma pergunta sobre pedagogia, inclusão, adaptações..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
