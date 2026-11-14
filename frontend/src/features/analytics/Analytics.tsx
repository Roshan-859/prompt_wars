import React from 'react'
import { useProgressOverview, useReadiness, useMySkills } from '@/api/hooks'
import { Card, Badge, ReadinessMeter, ProgressBar } from '@/components/ui'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts'

const WEEKLY_HOURS = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.0 },
  { day: 'Wed', hours: 1.5 },
  { day: 'Thu', hours: 4.0 },
  { day: 'Fri', hours: 3.5 },
  { day: 'Sat', hours: 2.0 },
  { day: 'Sun', hours: 1.0 },
]

export default function Analytics() {
  const { data: progress } = useProgressOverview()
  const { data: readiness } = useReadiness()
  const { data: mySkills } = useMySkills()

  // Format skills for radar visualization
  const radarData = mySkills?.slice(0, 6).map((us) => ({
    subject: us.skill.name,
    proficiency: us.proficiency,
    fullMark: 100,
  })) || [
    { subject: 'Frontend', proficiency: 80, fullMark: 100 },
    { subject: 'Backend', proficiency: 60, fullMark: 100 },
    { subject: 'Databases', proficiency: 70, fullMark: 100 },
    { subject: 'DevOps', proficiency: 45, fullMark: 100 },
    { subject: 'Algorithms', proficiency: 75, fullMark: 100 },
    { subject: 'System Design', proficiency: 50, fullMark: 100 },
  ]

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary-text">Progress Analytics & Metrics</h1>
        <p className="text-secondary-text text-sm mt-1">
          Longitudinal skill evolution and learning cadence analytics.
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 text-center">
          <p className="text-xs text-secondary-text uppercase font-semibold">Career Readiness</p>
          <p className="text-3xl font-display font-bold text-gold-gradient mt-1">{readiness?.readiness_score || 0}%</p>
        </Card>
        <Card className="p-5 text-center">
          <p className="text-xs text-secondary-text uppercase font-semibold">Assessments Passed</p>
          <p className="text-3xl font-display font-bold text-emerald mt-1">{progress?.assessments_completed || 0}</p>
        </Card>
        <Card className="p-5 text-center">
          <p className="text-xs text-secondary-text uppercase font-semibold">Average Test Score</p>
          <p className="text-3xl font-display font-bold text-royal-gold mt-1">{progress?.avg_assessment_score || 0}%</p>
        </Card>
        <Card className="p-5 text-center">
          <p className="text-xs text-secondary-text uppercase font-semibold">Curriculum Modules</p>
          <p className="text-3xl font-display font-bold text-primary-text mt-1">
            {progress?.modules_completed || 0} / {progress?.total_modules || 0}
          </p>
        </Card>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Competency Map */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-lg text-primary-text mb-2">Competency Radar</h3>
          <p className="text-xs text-secondary-text mb-4">Multi-axis proficiency mapping</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#E8E1D0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B6254', fontSize: 11 }} />
                <Radar name="Proficiency" dataKey="proficiency" stroke="#C9A227" fill="#C9A227" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weekly Study Activity Bar Chart */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-lg text-primary-text mb-2">Weekly Learning Hours</h3>
          <p className="text-xs text-secondary-text mb-4">Total: 17.5 hrs recorded this week</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_HOURS}>
                <XAxis dataKey="day" stroke="#6B6254" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B6254" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E1913',
                    borderColor: 'rgba(201,162,39,0.2)',
                    borderRadius: '12px',
                    color: '#FFFDF7',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="hours" fill="#C9A227" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}

