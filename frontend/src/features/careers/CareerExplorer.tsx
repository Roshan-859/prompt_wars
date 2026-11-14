import React, { useState } from 'react'
import {
  useCareers, useCareerCompatibility, useProfile,
  useUpdateProfile, useGenerateRoadmap
} from '@/api/hooks'
import { Card, Badge, ProgressBar, Button, ReadinessMeter } from '@/components/ui'
import { Target, CheckCircle2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Career } from '@/types'

export default function CareerExplorer() {
  const { data: careers } = useCareers()
  const { data: profile } = useProfile()
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null)
  const { data: compatibility, isLoading } = useCareerCompatibility(selectedCareer?.id)

  const updateProfile = useUpdateProfile()
  const generateRoadmap = useGenerateRoadmap()

  async function handleSetGoal(career: Career) {
    try {
      await updateProfile.mutateAsync({ target_career_id: career.id })
      await generateRoadmap.mutateAsync()
      toast.success(`Target career switched to ${career.name}! Adaptive roadmap recalculated.`)
    } catch {
      toast.error('Failed to change target career')
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary-text">Career Explorer & Intelligence</h1>
        <p className="text-secondary-text text-sm mt-1">
          Career Intelligence Agent maps target prerequisites against your live skill matrix.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-lg text-primary-text">Track Catalog</h3>
          {careers?.map((c) => {
            const isTarget = profile?.target_career_id === c.id
            const isSelected = selectedCareer?.id === c.id

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCareer(c)}
                className={`w-full text-left p-4 rounded-[14px] border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-royal-gold bg-royal-gold/10'
                    : 'border-border bg-white hover:border-royal-gold/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.icon || '💼'}</span>
                  <div>
                    <p className="font-semibold text-sm text-primary-text">{c.name}</p>
                    <p className="text-xs text-secondary-text">{c.avg_salary}</p>
                  </div>
                </div>
                {isTarget && <Badge variant="gold" className="text-[10px]">CURRENT</Badge>}
              </button>
            )
          })}
        </div>

        {/* Compatibility Engine Output */}
        <div className="lg:col-span-2">
          {selectedCareer ? (
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{selectedCareer.icon}</span>
                    <h2 className="font-display font-bold text-2xl text-primary-text">{selectedCareer.name}</h2>
                  </div>
                  <p className="text-secondary-text text-xs max-w-md">{selectedCareer.description}</p>
                </div>

                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => handleSetGoal(selectedCareer)}
                  loading={updateProfile.isPending || generateRoadmap.isPending}
                >
                  Adopt as Target Goal
                </Button>
              </div>

              {isLoading ? (
                <div className="py-12 flex justify-center">
                  <span className="w-8 h-8 border-2 border-royal-gold border-t-transparent rounded-full animate-spin" />
                </div>
              ) : compatibility && (
                <div className="space-y-6">
                  {/* Gauge & Metrics */}
                  <div className="flex flex-col sm:flex-row items-center gap-8 justify-around p-4 rounded-[16px] bg-cream">
                    <ReadinessMeter score={compatibility.readiness_score} size={140} />
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-white rounded-[12px] border border-border">
                        <p className="text-2xl font-bold font-display text-emerald">{compatibility.strong_count}</p>
                        <p className="text-xs text-secondary-text">Strong Matches</p>
                      </div>
                      <div className="p-3 bg-white rounded-[12px] border border-border">
                        <p className="text-2xl font-bold font-display text-royal-gold">{compatibility.intermediate_count}</p>
                        <p className="text-xs text-secondary-text">In Progress</p>
                      </div>
                      <div className="p-3 bg-white rounded-[12px] border border-border">
                        <p className="text-2xl font-bold font-display text-copper">{compatibility.weak_count}</p>
                        <p className="text-xs text-secondary-text">Needs Work</p>
                      </div>
                      <div className="p-3 bg-white rounded-[12px] border border-border">
                        <p className="text-2xl font-bold font-display text-warm-grey">{compatibility.missing_count}</p>
                        <p className="text-xs text-secondary-text">Missing Skills</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills Gap Matrix */}
                  <div>
                    <h4 className="font-semibold text-sm text-primary-text mb-3">Target Skill Requirements & Gap Analysis</h4>
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {compatibility.gaps.map((item) => (
                        <div key={item.skill_id} className="p-3 rounded-[12px] bg-white border border-border flex items-center justify-between gap-3 text-xs">
                          <div className="w-36 font-semibold text-primary-text truncate">{item.skill_name}</div>
                          <div className="flex-1">
                            <ProgressBar
                              value={item.user_proficiency}
                              max={item.required_proficiency}
                              color={
                                item.status === 'strong'
                                  ? 'emerald'
                                  : item.status === 'intermediate'
                                  ? 'gold'
                                  : item.status === 'beginner'
                                  ? 'copper'
                                  : 'grey'
                              }
                              size="sm"
                            />
                          </div>
                          <span className="text-secondary-text w-20 text-right font-medium">
                            {item.user_proficiency} / {item.required_proficiency}%
                          </span>
                          <Badge
                            variant={
                              item.status === 'strong'
                                ? 'emerald'
                                : item.status === 'intermediate'
                                ? 'gold'
                                : item.status === 'beginner'
                                ? 'copper'
                                : 'grey'
                            }
                            className="w-24 justify-center capitalize"
                          >
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center p-16 text-center text-secondary-text">
              <Target className="w-12 h-12 text-warm-grey mb-3" />
              <p className="text-sm">Select any career track to trigger real-time AI compatibility benchmarking.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

