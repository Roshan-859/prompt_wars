import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from './client'
import type {
  User, Profile, UserSkill, Skill, Career, CareerCompatibility,
  Roadmap, Resource, Assessment, AssessmentAttempt,
  ProgressOverview, AgentRun, MentorConversation
} from '@/types'

export function useMe() {
  return useQuery<User>({
    queryKey: ['me'],
    queryFn: () => api.get('/users/me').then((r) => r.data),
  })
}

export function useProfile() {
  return useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: () => api.get('/users/me/profile').then((r) => r.data),
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Profile>) => api.patch('/users/me/profile', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      qc.invalidateQueries({ queryKey: ['readiness'] })
    },
  })
}

export function useReadiness() {
  return useQuery({
    queryKey: ['readiness'],
    queryFn: () => api.get('/users/me/readiness').then((r) => r.data),
  })
}

export function useSkills(skillType?: string) {
  return useQuery<Skill[]>({
    queryKey: ['skills', skillType],
    queryFn: () => api.get('/skills', { params: { skill_type: skillType } }).then((r) => r.data),
  })
}

export function useMySkills() {
  return useQuery<UserSkill[]>({
    queryKey: ['my-skills'],
    queryFn: () => api.get('/skills/me').then((r) => r.data),
  })
}

export function useAddSkill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { skill_id: number; proficiency: number; level: string }) =>
      api.post('/skills/me', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-skills'] })
      qc.invalidateQueries({ queryKey: ['readiness'] })
    },
  })
}

export function useDeleteSkill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/skills/me/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-skills'] })
      qc.invalidateQueries({ queryKey: ['readiness'] })
    },
  })
}

export function useCareers() {
  return useQuery<Career[]>({
    queryKey: ['careers'],
    queryFn: () => api.get('/careers').then((r) => r.data),
  })
}

export function useCareerCompatibility(careerId?: number) {
  return useQuery<CareerCompatibility>({
    queryKey: ['career-compat', careerId],
    queryFn: () => api.get(`/careers/${careerId}/compatibility`).then((r) => r.data),
    enabled: !!careerId,
  })
}

export function useActiveRoadmap() {
  return useQuery<Roadmap>({
    queryKey: ['active-roadmap'],
    queryFn: () => api.get('/roadmaps/active').then((r) => r.data),
    retry: false,
  })
}

export function useGenerateRoadmap() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.post('/roadmaps/generate').then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['active-roadmap'] })
    },
  })
}

export function useCompleteModule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (moduleId: number) =>
      api.patch(`/roadmaps/modules/${moduleId}`, { status: 'completed' }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['active-roadmap'] })
      qc.invalidateQueries({ queryKey: ['progress'] })
    },
  })
}

export function useRecommendedResources() {
  return useQuery<Resource[]>({
    queryKey: ['recommended-resources'],
    queryFn: () => api.get('/resources/recommended').then((r) => r.data),
  })
}

export function useResources(resourceType?: string) {
  return useQuery<Resource[]>({
    queryKey: ['resources', resourceType],
    queryFn: () => api.get('/resources', { params: { resource_type: resourceType } }).then((r) => r.data),
  })
}

export function useAssessments() {
  return useQuery<Assessment[]>({
    queryKey: ['assessments'],
    queryFn: () => api.get('/assessments').then((r) => r.data),
  })
}

export function useSubmitAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, answers }: { id: number; answers: Record<string, string> }) =>
      api.post(`/assessments/${id}/submit`, { answers }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['active-roadmap'] })
      qc.invalidateQueries({ queryKey: ['readiness'] })
      qc.invalidateQueries({ queryKey: ['agent-runs'] })
      qc.invalidateQueries({ queryKey: ['progress'] })
    },
  })
}

export function useProgressOverview() {
  return useQuery<ProgressOverview>({
    queryKey: ['progress'],
    queryFn: () => api.get('/progress/overview').then((r) => r.data),
  })
}

export function useAgentRuns() {
  return useQuery<AgentRun[]>({
    queryKey: ['agent-runs'],
    queryFn: () => api.get('/agents/runs').then((r) => r.data),
  })
}

export function useTriggerEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { event: string; payload: Record<string, any> }) =>
      api.post('/agents/trigger', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['agent-runs'] })
      qc.invalidateQueries({ queryKey: ['active-roadmap'] })
    },
  })
}

export function useMentorChat() {
  return useMutation({
    mutationFn: (data: { message: string; conversation_id?: number }) =>
      api.post('/mentor/chat', data).then((r) => r.data),
  })
}

