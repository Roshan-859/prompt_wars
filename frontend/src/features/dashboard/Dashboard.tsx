import React from 'react'
import { Link } from 'react-router-dom'
import {
  useMe, useProfile, useReadiness, useProgressOverview,
  useActiveRoadmap, useRecommendedResources
} from '@/api/hooks'
import { Card, Badge, Button, ProgressBar, ReadinessMeter } from '@/components/ui'
import { Target, Map, BookOpen, TrendingUp, Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'

export default function Dashboard() {
  const { data: user } = useMe()
  const { data: profile } = useProfile()
  const { data: readiness } = useReadiness()
  const { data: progress } = useProgressOverview()
  const { data: roadmap } = useActiveRoadmap()
  const { data: resources } = useRecommendedResources()

  const readinessScore = readiness?.readiness_score ?? 0

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display text-3xl font-bold text-primary-text">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Alex'}
            </h1>
            <Sparkles className="w-5 h-5 text-royal-gold" />
          </div>
          <p className="text-secondary-text text-sm">
            Target Career:{' '}
            <span className="font-semibold text-primary-text">
              {readiness?.career_name || 'Full Stack Developer'}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="demo">DEMO MODE ACTIVE</Badge>
          <Link to="/app/agents">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Zap className="w-3.5 h-3.5 text-royal-gold" /> Agent Center
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5">
          <p className="text-xs font-medium text-secondary-text">Career Readiness</p>
          <p className="text-2xl sm:text-3xl font-bold font-display text-gold-gradient mt-1">{readinessScore}%</p>
          <p className="text-[11px] text-emerald mt-1 font-medium">↑ +14% this month</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <p className="text-xs font-medium text-secondary-text">Modules Completed</p>
          <p className="text-2xl sm:text-3xl font-bold font-display text-primary-text mt-1">
            {progress?.modules_completed ?? 0} / {progress?.total_modules ?? 0}
          </p>
          <p className="text-[11px] text-secondary-text mt-1">{progress?.roadmap_completion ?? 0}% overall</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <p className="text-xs font-medium text-secondary-text">Assessments Passed</p>
          <p className="text-2xl sm:text-3xl font-bold font-display text-primary-text mt-1">
            {progress?.assessments_completed ?? 0}
          </p>
          <p className="text-[11px] text-royal-gold mt-1">Avg Score: {progress?.avg_assessment_score ?? 0}%</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <p className="text-xs font-medium text-secondary-text">Active Study Streak</p>
          <p className="text-2xl sm:text-3xl font-bold font-display text-copper mt-1">12 Days 🔥</p>
          <p className="text-[11px] text-secondary-text mt-1">{profile?.weekly_study_hours || 15} hrs / week goal</p>
        </Card>
      </div>

      {/* Primary Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Meter Card */}
        <Card className="flex flex-col items-center justify-center text-center p-8">
          <h3 className="font-display font-bold text-lg text-primary-text mb-4">Readiness Gauge</h3>
          <ReadinessMeter score={readinessScore} size={180} />
          <p className="text-xs text-secondary-text mt-4 max-w-xs">
            Calculated across weighted skill requirements for <span className="font-semibold text-primary-text">{readiness?.career_name || 'Full Stack Developer'}</span>.
          </p>
          <Link to="/app/careers" className="mt-5 w-full">
            <Button variant="secondary" size="sm" className="w-full">
              Inspect Compatibility Details
            </Button>
          </Link>
        </Card>

        {/* Active Roadmap Overview */}
        <Card className="lg:col-span-2 flex flex-col justify-between p-6 sm:p-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-primary-text">Active Roadmap Path</h3>
                <p className="text-xs text-secondary-text mt-0.5">{roadmap?.title || 'Personalized Full Stack Track'}</p>
              </div>
              <Link to="/app/roadmap">
                <Button variant="ghost" size="sm" className="text-deep-gold">
                  Full Roadmap <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-secondary-text mb-1.5 font-medium">
                <span>Phase Progression</span>
                <span>{roadmap?.completion_percentage ?? 0}%</span>
              </div>
              <ProgressBar value={roadmap?.completion_percentage ?? 0} size="md" />
            </div>

            <div className="space-y-3">
              {roadmap?.phases?.slice(0, 3).map((phase) => (
                <div key={phase.id} className="p-3.5 rounded-[12px] bg-cream border border-border/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        phase.status === 'completed'
                          ? 'bg-emerald'
                          : phase.status === 'active'
                          ? 'bg-royal-gold animate-pulse'
                          : 'bg-warm-grey'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-primary-text">{phase.title}</p>
                      <p className="text-xs text-secondary-text">{phase.modules?.length || 0} modules · {phase.duration_weeks} weeks</p>
                    </div>
                  </div>
                  <Badge variant={phase.status === 'completed' ? 'emerald' : phase.status === 'active' ? 'gold' : 'grey'}>
                    {phase.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-secondary-text">
            <span>Powered by Path Architect & Performance Evaluation Agents</span>
            <Link to="/app/assessments" className="text-deep-gold hover:underline font-semibold">
              Take skill assessment →
            </Link>
          </div>
        </Card>
      </div>

      {/* Recommended Resources Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-xl text-primary-text">Resource Recommendations</h3>
            <p className="text-xs text-secondary-text">Driven by Resource Discovery Agent matching your real skill gaps</p>
          </div>
          <Link to="/app/resources">
            <Button variant="ghost" size="sm" className="text-deep-gold">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources?.slice(0, 3).map((r) => (
            <Card key={r.id} className="p-5 flex flex-col justify-between hover:border-royal-gold/40 transition-all">
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <Badge variant="gold" className="text-[10px] uppercase tracking-wide">{r.resource_type}</Badge>
                  <span className="text-xs text-secondary-text font-medium">{r.platform}</span>
                </div>
                <h4 className="font-semibold text-sm text-primary-text leading-snug line-clamp-2">{r.title}</h4>
                <p className="text-xs text-secondary-text mt-1.5 line-clamp-2">{r.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-royal-gold">★ {r.rating}</span>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="gold" size="sm" className="text-xs py-1 px-3">
                      Start
                    </Button>
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

