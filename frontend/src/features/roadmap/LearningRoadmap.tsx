import React from 'react'
import { useActiveRoadmap, useCompleteModule, useGenerateRoadmap } from '@/api/hooks'
import { Card, Badge, ProgressBar, Button } from '@/components/ui'
import { CheckCircle2, Circle, Clock, Layers, Sparkles, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LearningRoadmap() {
  const { data: roadmap, isLoading } = useActiveRoadmap()
  const completeModule = useCompleteModule()
  const generateRoadmap = useGenerateRoadmap()

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4">
        <div className="h-8 w-60 bg-cream rounded-md animate-pulse" />
        <div className="h-64 bg-white border border-border rounded-[16px] animate-pulse" />
      </div>
    )
  }

  if (!roadmap) {
    return (
      <div className="p-16 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <Layers className="w-16 h-16 text-warm-grey mb-4" />
        <h2 className="font-display font-bold text-2xl text-primary-text mb-2">No Active Roadmap</h2>
        <p className="text-secondary-text text-sm mb-6">
          Path Architect Agent requires a target career goal to build your customized milestone roadmap.
        </p>
        <Button variant="gold" onClick={() => generateRoadmap.mutate()} loading={generateRoadmap.isPending}>
          Generate Personalized Roadmap
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
      {/* Roadmap Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-bold text-primary-text">{roadmap.title}</h1>
            <Sparkles className="w-5 h-5 text-royal-gold" />
          </div>
          <p className="text-secondary-text text-sm mt-1">
            {roadmap.total_duration_weeks} Total Weeks · {roadmap.phases?.length || 0} Phased Milestones
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold font-display text-gold-gradient">{roadmap.completion_percentage}%</p>
            <p className="text-xs text-secondary-text">Completed</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => generateRoadmap.mutate()}
            loading={generateRoadmap.isPending}
            title="Re-architect roadmap based on recent skill progress"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ProgressBar value={roadmap.completion_percentage} size="md" />

      {/* Vertical Golden Milestone Path */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-royal-gold/40 space-y-8 my-6">
        {roadmap.phases?.map((phase, pIdx) => {
          const isComplete = phase.status === 'completed'
          const isActive = phase.status === 'active'

          return (
            <div key={phase.id} className="relative">
              {/* Golden Phase Marker */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isComplete
                    ? 'bg-emerald border-emerald text-white'
                    : isActive
                    ? 'bg-gold-gradient border-champagne text-royal-night font-bold text-xs'
                    : 'bg-ivory border-border text-secondary-text text-xs'
                }`}
              >
                {isComplete ? <CheckCircle2 className="w-4 h-4" /> : pIdx + 1}
              </div>

              {/* Phase Card */}
              <Card className={`p-6 ${isActive ? 'border-royal-gold/50 shadow-gold' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-display font-bold text-xl text-primary-text">
                      Phase {pIdx + 1}: {phase.title}
                    </h3>
                    <p className="text-xs text-secondary-text mt-0.5">{phase.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-text flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {phase.duration_weeks} wks
                    </span>
                    <Badge variant={isComplete ? 'emerald' : isActive ? 'gold' : 'grey'}>
                      {phase.status}
                    </Badge>
                  </div>
                </div>

                {/* Objectives */}
                {phase.objectives?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {phase.objectives.map((obj, i) => (
                      <span key={i} className="px-2.5 py-0.5 bg-cream rounded-full border border-border text-[11px] text-secondary-text">
                        • {obj}
                      </span>
                    ))}
                  </div>
                )}

                {/* Modules list */}
                <div className="space-y-2 mt-4 pt-3 border-t border-border">
                  {phase.modules?.map((mod) => {
                    const isModDone = mod.status === 'completed'
                    return (
                      <div
                        key={mod.id}
                        className={`p-3 rounded-[10px] border flex items-center justify-between gap-3 text-xs transition-all ${
                          isModDone ? 'bg-cream/40 border-border text-secondary-text' : 'bg-white border-border text-primary-text'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              if (!isModDone) {
                                completeModule.mutate(mod.id)
                                toast.success(`Completed ${mod.title}`)
                              }
                            }}
                            className="hover:scale-110 transition-transform"
                          >
                            {isModDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald" />
                            ) : (
                              <Circle className="w-4 h-4 text-royal-gold hover:text-deep-gold" />
                            )}
                          </button>
                          <span className={isModDone ? 'line-through opacity-70 font-medium' : 'font-semibold'}>
                            {mod.title}
                          </span>
                        </div>

                        <span className="text-[11px] text-secondary-text font-medium">
                          {mod.duration_hours} hrs
                        </span>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}

