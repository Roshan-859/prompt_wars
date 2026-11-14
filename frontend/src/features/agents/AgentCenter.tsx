import React, { useState } from 'react'
import { useAgentRuns, useTriggerEvent } from '@/api/hooks'
import { Card, Badge, Button } from '@/components/ui'
import { Bot, Zap, Activity, RefreshCw, Send, CheckCircle2, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import type { AgentMessage } from '@/types'

const AGENTS = [
  { id: 'orchestrator', name: 'Central Orchestrator', role: 'Event Routing & Transaction Broker', color: 'border-royal-gold text-bright-gold', emoji: '⚙️' },
  { id: 'assessment_evaluator', name: 'Performance Eval', role: 'Diagnostic Scoring & Anomaly Detection', color: 'border-copper text-copper', emoji: '📊' },
  { id: 'skill_analyzer', name: 'Skill Analyzer', role: 'Skill Proficiencies & Gap Identification', color: 'border-emerald text-emerald', emoji: '🔍' },
  { id: 'career_intelligence', name: 'Career Intelligence', role: 'Market Matching & Readiness Calculation', color: 'border-royal-gold text-royal-gold', emoji: '🎯' },
  { id: 'path_architect', name: 'Path Architect', role: 'Dynamic Phased Roadmap Restructuring', color: 'border-champagne text-champagne', emoji: '🗺️' },
  { id: 'resource_discovery', name: 'Resource Discovery', role: 'Contextual Material Recommendation', color: 'border-warm-grey text-secondary-text', emoji: '📚' },
  { id: 'ai_mentor', name: 'AI Mentor', role: 'Learner Guidance & Strategy Advisory', color: 'border-bright-gold text-bright-gold', emoji: '🤖' },
]

export default function AgentCenter() {
  const { data: runs, refetch } = useAgentRuns()
  const triggerEvent = useTriggerEvent()

  const [activeRunId, setActiveRunId] = useState<string | null>(null)
  const [streamMessages, setStreamMessages] = useState<AgentMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  // Scenario 1: Low JavaScript assessment score (42%)
  async function triggerScenario1() {
    try {
      const res = await triggerEvent.mutateAsync({
        event: 'assessment_completed',
        payload: {
          skill: 'JavaScript',
          score: 42,
          weak_topics: ['closures', 'async/await', 'promises'],
        },
      })
      toast.success('Scenario 1 Triggered: Poor JS Assessment (42%)')
      startStream(res.run_id)
    } catch {
      toast.error('Failed to trigger scenario')
    }
  }

  // Scenario 2: Change target career to AI/ML Engineer
  async function triggerScenario2() {
    try {
      const res = await triggerEvent.mutateAsync({
        event: 'career_changed',
        payload: {
          target_career: 'AI/ML Engineer',
          career_id: 2,
        },
      })
      toast.success('Scenario 2 Triggered: Career switched to AI Engineer')
      startStream(res.run_id)
    } catch {
      toast.error('Failed to trigger scenario')
    }
  }

  function startStream(runId: string) {
    setActiveRunId(runId)
    setStreamMessages([])
    setIsStreaming(true)

    const es = new EventSource(`/api/v1/agents/stream/${runId}`)
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.done) {
          es.close()
          setIsStreaming(false)
          refetch()
        } else {
          setStreamMessages((prev) => [...prev, data as AgentMessage])
        }
      } catch (err) {
        console.error(err)
      }
    }
    es.onerror = () => {
      es.close()
      setIsStreaming(false)
      refetch()
    }
  }

  const displayedMessages = streamMessages.length > 0 ? streamMessages : (runs?.[0]?.messages || [])

  return (
    <div className="min-h-full bg-royal-night p-6 sm:p-8 space-y-8 text-ivory">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-royal-gold/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-bold text-ivory">Multi-Agent Intelligence Center</h1>
            <Badge variant="demo">LIVE ORCHESTRATION</Badge>
          </div>
          <p className="text-secondary-text text-xs sm:text-sm mt-1">
            Six specialized AI agents communicate via structured JSON messages routed by the Central Orchestrator.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            className="bg-white/5 border-royal-gold/20 text-champagne hover:bg-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* Adaptive Scenarios Simulation Trigger Bar */}
      <Card dark className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-bright-gold" />
          <h2 className="font-display font-bold text-lg text-champagne">Simulate Adaptive Learning Scenarios</h2>
        </div>
        <p className="text-xs text-secondary-text">
          Fire end-to-end multi-agent pipelines and inspect the live inter-agent message payload flow below.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <Button
            variant="gold"
            size="sm"
            onClick={triggerScenario1}
            disabled={isStreaming}
            loading={triggerEvent.isPending && !isStreaming}
          >
            Trigger Scenario 1: Low JS Assessment (42%)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={triggerScenario2}
            disabled={isStreaming}
            className="bg-royal-gold/20 border-royal-gold text-bright-gold hover:bg-royal-gold/30"
          >
            Trigger Scenario 2: Target Switch to AI Engineer
          </Button>
        </div>
      </Card>

      {/* Agent Workflow Topology Grid */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg text-champagne flex items-center gap-2">
          <Bot className="w-4 h-4 text-bright-gold" /> Registered Agent Grid & Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AGENTS.map((agent) => (
            <div
              key={agent.id}
              className={`p-4 rounded-[14px] bg-dark-surface border transition-all ${
                isStreaming ? 'border-royal-gold/60 shadow-gold' : 'border-royal-gold/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{agent.emoji}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-ivory truncate">{agent.name}</p>
                  <p className="text-[10px] text-secondary-text truncate">{agent.role}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-royal-gold/10">
                <span className="text-secondary-text">Status:</span>
                <span className="text-emerald font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" /> Ready & Online
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Agent Message Stream Log */}
      <Card dark className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-bright-gold" />
            <h3 className="font-display font-bold text-lg text-champagne">
              Orchestrator Message Stream
            </h3>
            {isStreaming && (
              <span className="text-xs bg-royal-gold/20 text-bright-gold px-2 py-0.5 rounded-full animate-pulse">
                Streaming Pipeline...
              </span>
            )}
          </div>
          <span className="text-xs text-secondary-text">
            {displayedMessages.length} Messages in Run {activeRunId ? `(${activeRunId.slice(0, 8)}...)` : ''}
          </span>
        </div>

        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 font-mono text-xs">
          {displayedMessages.length === 0 ? (
            <p className="text-center py-10 text-secondary-text font-sans">
              No recent pipeline execution log. Click one of the Scenario buttons above to see the agents collaborate in real-time.
            </p>
          ) : (
            displayedMessages.map((msg, i) => (
              <div
                key={msg.id || i}
                className="p-3.5 rounded-[12px] bg-royal-night border border-royal-gold/20 space-y-2 hover:border-royal-gold/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 font-sans font-semibold text-bright-gold">
                    <span>{msg.from_agent}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-secondary-text" />
                    <span className="text-champagne">{msg.to_agent}</span>
                  </div>
                  <Badge variant="gold" className="text-[10px] font-mono">{msg.event}</Badge>
                </div>

                <div className="bg-dark-surface/90 p-2.5 rounded-[8px] border border-royal-gold/10 overflow-x-auto text-champagne">
                  <pre className="text-[11px] leading-relaxed whitespace-pre-wrap">
                    {JSON.stringify(msg.payload, null, 2)}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

