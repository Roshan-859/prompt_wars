import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import {
  LayoutDashboard, User, Zap, Compass, Map, BookOpen,
  ClipboardList, TrendingUp, MessageCircle, Settings,
  LogOut, Sparkles, Bot
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui'

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/app/skills', icon: Zap, label: 'Skill Intelligence' },
  { to: '/app/careers', icon: Compass, label: 'Career Explorer' },
  { to: '/app/roadmap', icon: Map, label: 'Learning Roadmap' },
  { to: '/app/resources', icon: BookOpen, label: 'Resources' },
  { to: '/app/assessments', icon: ClipboardList, label: 'Assessments' },
  { to: '/app/analytics', icon: TrendingUp, label: 'Analytics' },
  { to: '/app/mentor', icon: MessageCircle, label: 'AI Mentor' },
  { to: '/app/agents', icon: Bot, label: 'Agent Center' },
  { to: '/app/profile', icon: User, label: 'My Profile' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
]

export function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-ivory overflow-hidden">
      {/* Royal Night Sidebar */}
      <aside className="w-64 bg-royal-night border-r border-royal-gold/20 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-royal-gold/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-royal-night" />
              </div>
              <div>
                <span className="font-display font-bold text-champagne text-lg">SkillPilot</span>
                <span className="text-gold-gradient font-bold text-lg ml-1">AI</span>
              </div>
            </div>
            <div className="mt-3">
              <Badge variant="demo" className="text-[10px]">✦ DEMO MODE</Badge>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-sm font-medium transition-all',
                    isActive
                      ? 'bg-royal-gold/20 text-bright-gold border border-royal-gold/30'
                      : 'text-secondary-text hover:bg-white/5 hover:text-champagne'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-royal-gold/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gold-gradient text-royal-night font-bold text-xs flex items-center justify-center shrink-0">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-ivory truncate">{user?.full_name || 'Alex Chen'}</p>
              <p className="text-[10px] text-secondary-text truncate">{user?.email || 'demo@skillpilot.ai'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-secondary-text hover:text-red-400 p-1 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto bg-ivory">
        <Outlet />
      </main>
    </div>
  )
}

