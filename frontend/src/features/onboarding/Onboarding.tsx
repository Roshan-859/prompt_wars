import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUpdateProfile, useGenerateRoadmap } from '@/api/hooks'
import api from '@/api/client'
import { Button, Input, Badge } from '@/components/ui'
import { Check, ChevronRight, ChevronLeft, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Career } from '@/types'

const STEPS = ['Education', 'Skills', 'Certifications', 'Projects', 'Target Career']

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [educationLevel, setEducationLevel] = useState('bachelor')
  const [institution, setInstitution] = useState('UC Berkeley')
  const [graduationYear, setGraduationYear] = useState(2025)
  const [skillsInput, setSkillsInput] = useState('')
  const [skillsList, setSkillsList] = useState<string[]>(['JavaScript', 'React', 'Git'])
  const [certInput, setCertInput] = useState('')
  const [certs, setCerts] = useState<string[]>(['AWS Cloud Practitioner'])
  const [projectInput, setProjectInput] = useState('')
  const [projects, setProjects] = useState<string[]>(['Portfolio Website', 'Task Management App'])
  const [careers, setCareers] = useState<Career[]>([])
  const [selectedCareerId, setSelectedCareerId] = useState<number | null>(null)

  const updateProfile = useUpdateProfile()
  const generateRoadmap = useGenerateRoadmap()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/careers').then((res) => {
      setCareers(res.data)
      if (res.data.length > 0) {
        setSelectedCareerId(res.data[0].id)
      }
    })
  }, [])

  function addSkill() {
    if (skillsInput.trim() && !skillsList.includes(skillsInput.trim())) {
      setSkillsList([...skillsList, skillsInput.trim()])
      setSkillsInput('')
    }
  }

  function addCert() {
    if (certInput.trim() && !certs.includes(certInput.trim())) {
      setCerts([...certs, certInput.trim()])
      setCertInput('')
    }
  }

  function addProject() {
    if (projectInput.trim() && !projects.includes(projectInput.trim())) {
      setProjects([...projects, projectInput.trim()])
      setProjectInput('')
    }
  }

  async function handleFinish() {
    try {
      await updateProfile.mutateAsync({
        education_level: educationLevel,
        institution,
        graduation_year: Number(graduationYear),
        certifications: certs,
        completed_projects: projects,
        target_career_id: selectedCareerId || undefined,
        onboarding_completed: true,
      })
      await generateRoadmap.mutateAsync()
      toast.success('Onboarding complete! Your personalized roadmap is ready.')
      navigate('/app/dashboard')
    } catch {
      toast.error('Failed to complete onboarding')
    }
  }

  return (
    <div className="min-h-screen bg-royal-night flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            {STEPS.map((s, idx) => (
              <div key={s} className="flex items-center gap-1.5 text-xs">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    idx < step
                      ? 'bg-emerald text-white'
                      : idx === step
                      ? 'bg-gold-gradient text-royal-night'
                      : 'bg-white/10 text-secondary-text'
                  }`}
                >
                  {idx < step ? <Check className="w-3 h-3" /> : idx + 1}
                </span>
                <span className={idx === step ? 'text-champagne font-medium' : 'text-secondary-text hidden sm:inline'}>
                  {s}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <div
              className="bg-gold-gradient h-full transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card */}
        <div className="bg-dark-surface border border-royal-gold/20 rounded-[20px] p-6 sm:p-8 min-h-[340px] flex flex-col justify-between shadow-2xl">
          <div>
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-ivory">Academic & Education Profile</h2>
                <p className="text-secondary-text text-xs">SkillPilot calibrates learning velocity based on your foundations.</p>
                <div>
                  <label className="block text-xs font-medium text-champagne mb-1.5">Education Degree / Level</label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-[12px] bg-royal-night border border-royal-gold/20 text-ivory text-sm"
                  >
                    <option value="bachelor">Bachelor of Science / Arts</option>
                    <option value="master">Master's Degree</option>
                    <option value="phd">PhD / Research</option>
                    <option value="bootcamp">Engineering Bootcamp</option>
                    <option value="self-taught">Self-Taught / Industry Experience</option>
                  </select>
                </div>
                <Input dark label="Institution / University" value={institution} onChange={(e) => setInstitution(e.target.value)} />
                <Input dark label="Graduation Year" type="number" value={graduationYear} onChange={(e) => setGraduationYear(Number(e.target.value))} />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-ivory">Skills & Technologies</h2>
                <p className="text-secondary-text text-xs">What technologies have you worked with so far?</p>
                <div className="flex gap-2">
                  <Input dark placeholder="e.g. TypeScript, Python, SQL" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill()} />
                  <Button variant="gold" size="sm" onClick={addSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {skillsList.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-royal-gold/15 border border-royal-gold/30 text-bright-gold text-xs rounded-full flex items-center gap-1.5">
                      {skill}
                      <button onClick={() => setSkillsList(skillsList.filter((s) => s !== skill))} className="text-secondary-text hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-ivory">Verified Certifications</h2>
                <p className="text-secondary-text text-xs">Add industry credentials or online certifications.</p>
                <div className="flex gap-2">
                  <Input dark placeholder="e.g. AWS Solutions Architect, CompTIA Security+" value={certInput} onChange={(e) => setCertInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCert()} />
                  <Button variant="gold" size="sm" onClick={addCert}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {certs.map((c) => (
                    <span key={c} className="px-3 py-1 bg-emerald/15 border border-emerald/30 text-emerald text-xs rounded-full flex items-center gap-1.5">
                      {c}
                      <button onClick={() => setCerts(certs.filter((item) => item !== c))} className="text-secondary-text hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-ivory">Completed Projects</h2>
                <p className="text-secondary-text text-xs">Real-world applications you have built or shipped.</p>
                <div className="flex gap-2">
                  <Input dark placeholder="e.g. Fullstack E-Commerce, Distributed Cache" value={projectInput} onChange={(e) => setProjectInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addProject()} />
                  <Button variant="gold" size="sm" onClick={addProject}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {projects.map((p) => (
                    <span key={p} className="px-3 py-1 bg-copper/15 border border-copper/30 text-copper text-xs rounded-full flex items-center gap-1.5">
                      {p}
                      <button onClick={() => setProjects(projects.filter((item) => item !== p))} className="text-secondary-text hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-ivory">Select Target Career Goal</h2>
                <p className="text-secondary-text text-xs">Six AI agents will generate your adaptive curriculum around this target.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {careers.map((career) => (
                    <button
                      key={career.id}
                      type="button"
                      onClick={() => setSelectedCareerId(career.id)}
                      className={`p-3 rounded-[12px] border text-left flex items-center gap-3 transition-all ${
                        selectedCareerId === career.id
                          ? 'border-royal-gold bg-royal-gold/15 text-bright-gold'
                          : 'border-royal-gold/10 bg-royal-night text-secondary-text hover:border-royal-gold/30 hover:text-champagne'
                      }`}
                    >
                      <span className="text-xl">{career.icon || '🎯'}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate text-ivory">{career.name}</p>
                        <p className="text-[10px] text-secondary-text">{career.avg_salary}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stepper Buttons */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t border-royal-gold/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="text-champagne hover:bg-white/5"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button variant="gold" size="sm" onClick={() => setStep((s) => s + 1)}>
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="gold" size="sm" onClick={handleFinish} loading={updateProfile.isPending || generateRoadmap.isPending}>
                Complete Profile & Build Roadmap
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

