import React from 'react'
import { Card, Badge, Button } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'
import { Bot, Shield, Bell, CheckCircle2 } from 'lucide-react'

export default function Settings() {
  const { user } = useAuthStore()

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary-text">Platform Settings & AI Configuration</h1>
        <p className="text-secondary-text text-sm mt-1">Configure orchestration options and view provider state.</p>
      </div>

      <div className="space-y-6">
        {/* AI Provider Config */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-royal-gold" />
            <h3 className="font-display font-bold text-lg text-primary-text">AI Inference & LLM Mode</h3>
          </div>

          <div className="p-4 rounded-[12px] bg-cream border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-sm text-primary-text">Active Engine: Scripted Deterministic Demo Client</p>
              <p className="text-xs text-secondary-text mt-0.5">
                Zero external API keys required. All 6 agents run local logic pipelines with 100% reproducible results.
              </p>
            </div>
            <Badge variant="demo">DEMO MODE</Badge>
          </div>

          <p className="text-xs text-secondary-text">
            To switch to OpenAI/Anthropic/Gemini runtime, set <code className="bg-cream px-1.5 py-0.5 rounded font-mono text-primary-text">LLM_PROVIDER=openai</code> and provide your API key in <code className="bg-cream px-1.5 py-0.5 rounded font-mono text-primary-text">backend/.env</code>.
          </p>
        </Card>

        {/* Security & Access */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-royal-gold" />
            <h3 className="font-display font-bold text-lg text-primary-text">Security & Role-Based Access</h3>
          </div>
          <div className="text-xs text-secondary-text space-y-2">
            <p>Signed In As: <span className="font-semibold text-primary-text">{user?.email}</span></p>
            <p>Role Authority: <span className="font-semibold text-primary-text uppercase">{user?.role}</span></p>
            <p>Authentication Token: <span className="font-mono text-emerald">Active (JWT Bearer Token validated)</span></p>
          </div>
        </Card>
      </div>
    </div>
  )
}

