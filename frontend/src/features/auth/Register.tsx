import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import api from '@/api/client'
import { Button, Input } from '@/components/ui'
import { Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'student' | 'organization'>('student')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        full_name: fullName,
        email,
        password,
        role,
      })
      setAuth(res.data.user, res.data.access_token)
      toast.success('Account created! Welcome.')
      navigate('/onboarding')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-royal-night flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-royal-night" />
            </div>
            <span className="font-display text-2xl font-bold text-ivory">SkillPilot <span className="text-gold-gradient">AI</span></span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ivory">Create your account</h1>
          <p className="text-secondary-text text-sm mt-1">Join the intelligent career acceleration system</p>
        </div>

        <div className="bg-dark-surface border border-royal-gold/20 rounded-[20px] p-6 shadow-xl">
          <div className="flex gap-2 mb-5">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-2 text-xs font-semibold rounded-[10px] border transition-all ${
                role === 'student'
                  ? 'bg-royal-gold/20 border-royal-gold text-bright-gold'
                  : 'border-royal-gold/10 text-secondary-text hover:border-royal-gold/30'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('organization')}
              className={`flex-1 py-2 text-xs font-semibold rounded-[10px] border transition-all ${
                role === 'organization'
                  ? 'bg-royal-gold/20 border-royal-gold text-bright-gold'
                  : 'border-royal-gold/10 text-secondary-text hover:border-royal-gold/30'
              }`}
            >
              Organization / Univ
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full Name"
              dark
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Jordan Smith"
              required
            />
            <Input
              label="Email Address"
              dark
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
            />
            <Input
              label="Password"
              dark
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />
            <Button type="submit" variant="gold" size="md" className="w-full mt-2" loading={loading}>
              Get Started
            </Button>
          </form>

          <p className="text-center text-xs text-secondary-text mt-6">
            Already registered?{' '}
            <Link to="/login" className="text-bright-gold hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

