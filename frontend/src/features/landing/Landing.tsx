import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Zap, Map, Bot, TrendingUp, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui'

const agents = [
  { name: 'Skill Analyzer', desc: 'Deeply assesses your technical foundations, gaps & proficiency trends.', emoji: '🔍' },
  { name: 'Career Intelligence', desc: 'Calculates live role fit percentages & market demand weights.', emoji: '🎯' },
  { name: 'Path Architect', desc: 'Generates progressive, prerequisite-aware phased roadmaps.', emoji: '🗺️' },
  { name: 'Resource Discovery', desc: 'Ranks targeted courses, documentation & mini-projects.', emoji: '📚' },
  { name: 'Performance Eval', desc: 'Monitors assessment answers and triggers learning recovery paths.', emoji: '📊' },
  { name: 'AI Mentor', desc: 'Answers questions, explains concepts & orchestrates the agent team.', emoji: '🤖' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Navigation */}
      <nav className="border-b border-border bg-ivory/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-royal-night" />
            </div>
            <span className="font-display font-bold text-primary-text text-xl">
              SkillPilot <span className="text-gold-gradient">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="gold" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-royal-night text-ivory relative overflow-hidden py-24 px-6 border-b border-royal-gold/20">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-royal-gold/30 bg-royal-gold/10 text-bright-gold text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" /> 6 Specialized AI Agents · Zero Guesswork
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-tight mb-6">
            Your Career Doesn't Need Guesswork.{' '}
            <span className="text-gold-gradient block mt-1">It Needs Intelligence.</span>
          </h1>
          <p className="text-secondary-text text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            SkillPilot AI evaluates your current competencies, benchmarks gaps against top-tier tech roles, and autonomously coordinates six AI agents to orchestrate your adaptive career path.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button variant="gold" size="lg" className="w-full sm:w-auto">
                Start Your Career Journey <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white/5 border-royal-gold/30 text-champagne hover:bg-white/10">
                Explore Platform
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Agents Architecture */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold text-primary-text mb-3">Six Collaborating AI Agents</h2>
          <p className="text-secondary-text max-w-xl mx-auto">
            All agents communicate strictly through a central orchestrator using typed message contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.name} className="p-6 rounded-[16px] bg-white border border-border shadow-warm hover:border-royal-gold/50 transition-all">
              <div className="text-3xl mb-3">{agent.emoji}</div>
              <h3 className="font-display font-bold text-lg text-primary-text mb-2">{agent.name}</h3>
              <p className="text-sm text-secondary-text leading-relaxed">{agent.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

