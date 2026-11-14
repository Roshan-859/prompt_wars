import React, { useState, useRef, useEffect } from 'react'
import { useMentorChat } from '@/api/hooks'
import { Card, Badge, Button } from '@/components/ui'
import { Bot, User, Send, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const QUICK_PROMPTS = [
  'What should I learn next?',
  'Analyze my skill gaps.',
  'Explain my career readiness.',
  'Create a weekly learning plan.',
]

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIMentor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello Alex! I am your SkillPilot AI Mentor. I synthesize data from our Skill Analyzer, Career Intelligence, and Path Architect agents to keep your learning trajectory on track. How can I guide you today?",
    },
  ])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<number | undefined>(undefined)
  const mentorChat = useMentorChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(textToSend?: string) {
    const text = textToSend || input
    if (!text.trim()) return

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')

    try {
      const res = await mentorChat.mutateAsync({
        message: text,
        conversation_id: conversationId,
      })
      if (res.conversation_id) setConversationId(res.conversation_id)
      setMessages([...newMessages, { role: 'assistant', content: res.message }])
    } catch {
      toast.error('AI Mentor is temporarily unreachable')
    }
  }

  return (
    <div className="flex flex-col h-full bg-ivory">
      {/* Top Bar */}
      <div className="bg-royal-night border-b border-royal-gold/20 p-6 flex items-center justify-between text-ivory shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-gradient text-royal-night flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-ivory">SkillPilot AI Mentor</h1>
            <p className="text-xs text-secondary-text">Context-aware conversational career strategist</p>
          </div>
        </div>
        <Badge variant="demo">✦ DETERMINISTIC DEMO LLM</Badge>
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-3 bg-cream border-b border-border flex flex-wrap gap-2 shrink-0">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handleSend(p)}
            className="px-3 py-1 rounded-full bg-white border border-border text-xs text-secondary-text hover:border-royal-gold hover:text-primary-text transition-all font-medium"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl w-full mx-auto">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gold-gradient text-royal-night flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-4 rounded-[16px] text-xs sm:text-sm max-w-xl leading-relaxed ${
                m.role === 'user'
                  ? 'bg-royal-night text-ivory rounded-tr-none'
                  : 'bg-white border border-border text-primary-text shadow-warm rounded-tl-none'
              }`}
            >
              {m.content}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-cream border border-border text-primary-text flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {mentorChat.isPending && (
          <div className="flex gap-3 items-center text-xs text-secondary-text">
            <div className="w-8 h-8 rounded-full bg-gold-gradient text-royal-night flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-white border border-border rounded-[14px]">
              AI Mentor is thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-4 bg-white border-t border-border shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="max-w-4xl mx-auto flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI Mentor about skill gaps, roadmaps, or career paths..."
            className="flex-1 px-4 py-2.5 rounded-[12px] border border-border text-sm focus:outline-none focus:ring-2 focus:ring-royal-gold/40 focus:border-royal-gold/50"
          />
          <Button variant="gold" size="md" type="submit" loading={mentorChat.isPending}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

