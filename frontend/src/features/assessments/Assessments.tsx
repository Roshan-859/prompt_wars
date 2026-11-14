import React, { useState } from 'react'
import { useAssessments, useSubmitAssessment } from '@/api/hooks'
import { Card, Badge, Button } from '@/components/ui'
import { ClipboardList, Clock, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Assessment, AssessmentAttempt } from '@/types'

export default function Assessments() {
  const { data: assessments } = useAssessments()
  const submitAssessment = useSubmitAssessment()

  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [lastAttempt, setLastAttempt] = useState<AssessmentAttempt | null>(null)

  async function handleSubmit() {
    if (!activeAssessment) return
    try {
      const res = await submitAssessment.mutateAsync({
        id: activeAssessment.id,
        answers,
      })
      setLastAttempt(res)
      setActiveAssessment(null)
      toast.success('Assessment scored! Multi-agent pipeline triggered.')
    } catch {
      toast.error('Failed to submit assessment')
    }
  }

  // Score Screen Modal / Banner
  if (lastAttempt) {
    const isPassed = (lastAttempt.percentage ?? 0) >= 70

    return (
      <div className="p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
        <Card className="p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-royal-gold/15 text-royal-gold">
            {isPassed ? <CheckCircle2 className="w-8 h-8 text-emerald" /> : <AlertTriangle className="w-8 h-8 text-copper" />}
          </div>

          <div>
            <h2 className="font-display font-bold text-2xl text-primary-text">Assessment Evaluation Complete</h2>
            <p className="text-secondary-text text-xs mt-1">Autonomous evaluation by Assessment Evaluator & Skill Analyzer Agents</p>
          </div>

          <div className="p-6 rounded-[16px] bg-cream border border-border inline-block min-w-[200px]">
            <p className="text-xs text-secondary-text uppercase font-semibold">Attained Score</p>
            <p className="text-4xl font-bold font-display text-gold-gradient mt-1">{lastAttempt.percentage}%</p>
            <Badge variant={isPassed ? 'emerald' : 'copper'} className="mt-2">
              {isPassed ? 'PASSED CRITERIA' : 'NEEDS RECOVERY'}
            </Badge>
          </div>

          {lastAttempt.weak_topics?.length > 0 && (
            <div className="text-left p-4 rounded-[12px] bg-royal-gold/10 border border-royal-gold/20 space-y-2">
              <p className="text-xs font-semibold text-deep-gold">Detected Weak Focus Areas:</p>
              <div className="flex flex-wrap gap-1.5">
                {lastAttempt.weak_topics.map((topic) => (
                  <span key={topic} className="px-2.5 py-0.5 rounded-full bg-white border border-royal-gold/30 text-xs font-medium text-primary-text">
                    {topic}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-secondary-text pt-1">
                Notice: The Path Architect Agent has been commanded to insert prerequisites into your roadmap. Check the Agent Control Center!
              </p>
            </div>
          )}

          <Button variant="gold" size="md" onClick={() => setLastAttempt(null)} className="w-full">
            Done & Return to Assessments
          </Button>
        </Card>
      </div>
    )
  }

  // Active Test Runner Screen
  if (activeAssessment) {
    return (
      <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h2 className="font-display font-bold text-2xl text-primary-text">{activeAssessment.title}</h2>
            <p className="text-xs text-secondary-text mt-0.5">{activeAssessment.description}</p>
          </div>
          <Badge variant="gold" className="text-xs">
            <Clock className="w-3.5 h-3.5" /> {activeAssessment.time_limit_minutes} Mins
          </Badge>
        </div>

        <div className="space-y-6">
          {activeAssessment.questions?.map((q, idx) => (
            <Card key={q.id} className="p-6 space-y-4">
              <p className="font-semibold text-sm text-primary-text">
                <span className="text-royal-gold font-bold mr-2">Q{idx + 1}.</span> {q.question_text}
              </p>

              <div className="space-y-2">
                {q.options?.map((opt) => {
                  const isChecked = answers[String(q.id)] === opt
                  return (
                    <label
                      key={opt}
                      className={`flex items-center gap-3 p-3 rounded-[12px] border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'border-royal-gold bg-royal-gold/10 font-semibold text-primary-text'
                          : 'border-border bg-white hover:border-royal-gold/30 text-secondary-text'
                      }`}
                    >
                      <input
                        type="radio"
                        name={String(q.id)}
                        value={opt}
                        checked={isChecked}
                        onChange={() => setAnswers({ ...answers, [String(q.id)]: opt })}
                        className="accent-royal-gold"
                      />
                      <span>{opt}</span>
                    </label>
                  )
                })}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="ghost" size="sm" onClick={() => setActiveAssessment(null)}>
            Cancel Attempt
          </Button>
          <Button
            variant="gold"
            size="md"
            onClick={handleSubmit}
            loading={submitAssessment.isPending}
            disabled={Object.keys(answers).length === 0}
          >
            Submit for Agent Evaluation
          </Button>
        </div>
      </div>
    )
  }

  // Catalog Screen
  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary-text">Skill Diagnostic Assessments</h1>
        <p className="text-secondary-text text-sm mt-1">
          Take assessments to dynamically recalibrate your skill proficiency score and trigger autonomous learning paths.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assessments?.map((a) => (
          <Card key={a.id} className="p-6 flex flex-col justify-between hover:border-royal-gold/50 transition-all">
            <div>
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="w-10 h-10 rounded-[12px] bg-royal-gold/15 flex items-center justify-center text-royal-gold">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <Badge variant="gold" className="capitalize">{a.difficulty}</Badge>
              </div>

              <h3 className="font-display font-bold text-lg text-primary-text">{a.title}</h3>
              <p className="text-xs text-secondary-text mt-1.5 leading-relaxed">{a.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-secondary-text flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {a.time_limit_minutes}m · {a.questions?.length || 5} Qs
              </span>

              <Button
                variant="gold"
                size="sm"
                onClick={() => {
                  setAnswers({})
                  setActiveAssessment(a)
                }}
              >
                Start Test <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

