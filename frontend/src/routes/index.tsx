import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { AppLayout } from '@/layouts/AppLayout'

import Landing from '@/features/landing/Landing'
import Login from '@/features/auth/Login'
import Register from '@/features/auth/Register'
import Onboarding from '@/features/onboarding/Onboarding'
import Dashboard from '@/features/dashboard/Dashboard'
import SkillIntelligence from '@/features/skills/SkillIntelligence'
import CareerExplorer from '@/features/careers/CareerExplorer'
import LearningRoadmap from '@/features/roadmap/LearningRoadmap'
import Resources from '@/features/resources/Resources'
import Assessments from '@/features/assessments/Assessments'
import Analytics from '@/features/analytics/Analytics'
import AIMentor from '@/features/mentor/AIMentor'
import AgentCenter from '@/features/agents/AgentCenter'
import Profile from '@/features/profile/Profile'
import Settings from '@/features/settings/Settings'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="skills" element={<SkillIntelligence />} />
        <Route path="careers" element={<CareerExplorer />} />
        <Route path="roadmap" element={<LearningRoadmap />} />
        <Route path="resources" element={<Resources />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="mentor" element={<AIMentor />} />
        <Route path="agents" element={<AgentCenter />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

