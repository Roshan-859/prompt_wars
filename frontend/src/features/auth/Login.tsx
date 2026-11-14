import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import api from '@/api/client'
import { Button, Input, Badge } from '@/components/ui'
import { Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('demo@skillpilot.ai')
  const [password, setPassword] = useState('demo1234')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      setAuth(res.data.user, res.data.access_token)
      toast.success(`Welcome, ${res.data.user.full_name}!`)
      navigate('/app/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Invalid email or password')
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
          <h1 className="font-display text-2xl font-bold text-ivory">Sign in to your account</h1>
          <p className="text-secondary-text text-sm mt-1">Autonomous career development engine</p>
        </div>

        <div className="bg-dark-surface border border-royal-gold/20 rounded-[20px] p-6 shadow-xl">
          <div className="mb-5 p-3 rounded-[12px] bg-royal-gold/10 border border-royal-gold/20">
            <Badge variant="demo" className="mb-1 text-[10px]">PRELOADED DEMO CREDENTIALS</Badge>
            <p className="text-xs text-champagne">Email: <span className="font-mono">demo@skillpilot.ai</span></p>
            <p className="text-xs text-champagne">Password: <span className="font-mono">demo1234</span></p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              dark
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              dark
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="gold" size="md" className="w-full mt-2" loading={loading}>
              Sign In to SkillPilot
            </Button>
          </form>

          <p className="text-center text-xs text-secondary-text mt-6">
            New to SkillPilot?{' '}
            <Link to="/register" className="text-bright-gold hover:underline font-medium">Create student profile</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

