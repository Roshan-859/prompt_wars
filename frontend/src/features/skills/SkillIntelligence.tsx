import React, { useState } from 'react'
import { useMySkills, useSkills, useAddSkill, useDeleteSkill, useCareerCompatibility, useProfile } from '@/api/hooks'
import { Card, Badge, ProgressBar, Button, Input } from '@/components/ui'
import { Plus, Trash2, Zap } from 'lucide-react'
import { getSkillStatusBadge } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { UserSkill } from '@/types'

export default function SkillIntelligence() {
  const { data: mySkills } = useMySkills()
  const { data: allSkills } = useSkills()
  const { data: profile } = useProfile()
  const { data: compatibility } = useCareerCompatibility(profile?.target_career_id)
  const addSkill = useAddSkill()
  const deleteSkill = useDeleteSkill()

  const [search, setSearch] = useState('')
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null)
  const [proficiency, setProficiency] = useState(60)

  const mySkillIds = new Set(mySkills?.map((s) => s.skill_id) ?? [])
  const availableSkills = allSkills?.filter(
    (s) => !mySkillIds.has(s.id) && s.name.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  async function handleAdd() {
    if (!selectedSkillId) return
    try {
      await addSkill.mutateAsync({
        skill_id: selectedSkillId,
        proficiency,
        level: proficiency >= 75 ? 'strong' : proficiency >= 50 ? 'intermediate' : 'beginner',
      })
      toast.success('Skill added to profile')
      setSelectedSkillId(null)
    } catch {
      toast.error('Failed to add skill')
    }
  }

  const strong = mySkills?.filter((s) => s.proficiency >= 75) ?? []
  const intermediate = mySkills?.filter((s) => s.proficiency >= 50 && s.proficiency < 75) ?? []
  const beginner = mySkills?.filter((s) => s.proficiency < 50) ?? []

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary-text">Skill Intelligence</h1>
        <p className="text-secondary-text text-sm mt-1">
          Real-time competency mapping evaluated by the Skill Analyzer AI Agent.
        </p>
      </div>

      {/* Distribution Tiers */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center p-4">
          <p className="text-3xl font-display font-bold text-emerald">{strong.length}</p>
          <Badge variant="emerald" className="mt-1">Strong (≥75%)</Badge>
        </Card>
        <Card className="text-center p-4">
          <p className="text-3xl font-display font-bold text-royal-gold">{intermediate.length}</p>
          <Badge variant="gold" className="mt-1">Intermediate (50-74%)</Badge>
        </Card>
        <Card className="text-center p-4">
          <p className="text-3xl font-display font-bold text-copper">{beginner.length}</p>
          <Badge variant="copper" className="mt-1">Beginner (&lt;50%)</Badge>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Skill Panel */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-lg text-primary-text mb-4">Add Competency</h3>
          <Input
            placeholder="Search skills (e.g. Docker, Python)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3"
          />
          <div className="max-h-48 overflow-y-auto space-y-1 mb-4 border border-border rounded-[10px] p-2 bg-cream/40">
            {availableSkills.slice(0, 15).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSkillId(s.id)}
                className={`w-full text-left px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all ${
                  selectedSkillId === s.id
                    ? 'bg-royal-gold/20 text-deep-gold font-semibold'
                    : 'hover:bg-cream text-secondary-text'
                }`}
              >
                {s.name} <span className="opacity-60 text-[10px] ml-1">({s.skill_type})</span>
              </button>
            ))}
          </div>

          {selectedSkillId && (
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex justify-between text-xs text-secondary-text">
                <span>Declared Proficiency:</span>
                <span className="font-bold text-primary-text">{proficiency}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={proficiency}
                onChange={(e) => setProficiency(Number(e.target.value))}
                className="w-full accent-royal-gold"
              />
              <Button variant="gold" size="sm" className="w-full" onClick={handleAdd} loading={addSkill.isPending}>
                <Plus className="w-4 h-4" /> Save Skill
              </Button>
            </div>
          )}
        </Card>

        {/* Existing Skills List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <h3 className="font-display font-bold text-lg text-primary-text mb-4">Your Skill Inventory</h3>
            <div className="space-y-3">
              {mySkills?.map((us) => (
                <div key={us.id} className="p-3.5 rounded-[12px] bg-cream border border-border/70 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-semibold text-sm text-primary-text">{us.skill.name}</span>
                      <Badge variant={us.level === 'strong' ? 'emerald' : us.level === 'intermediate' ? 'gold' : 'copper'}>
                        {us.level}
                      </Badge>
                      <span className="text-[11px] text-secondary-text ml-auto">{us.source}</span>
                    </div>
                    <ProgressBar
                      value={us.proficiency}
                      color={us.level === 'strong' ? 'emerald' : us.level === 'intermediate' ? 'gold' : 'copper'}
                      size="sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-primary-text">{us.proficiency}%</span>
                    <button
                      onClick={() => deleteSkill.mutate(us.id)}
                      className="text-secondary-text hover:text-red-500 p-1"
                      title="Remove skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

