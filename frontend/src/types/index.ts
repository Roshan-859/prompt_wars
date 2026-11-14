export interface User {
  id: number
  email: string
  full_name: string
  role: 'student' | 'organization' | 'admin'
  is_active: boolean
  is_verified: boolean
  created_at: string
}

export interface Profile {
  id: number
  user_id: number
  bio?: string
  location?: string
  education_level?: string
  institution?: string
  graduation_year?: number
  target_career_id?: number
  linkedin_url?: string
  github_url?: string
  portfolio_url?: string
  certifications: string[]
  completed_projects: string[]
  preferred_learning_style?: string
  weekly_study_hours?: number
  onboarding_completed: boolean
}

export interface Skill {
  id: number
  name: string
  slug: string
  description?: string
  skill_type: 'technical' | 'soft'
  icon?: string
}

export interface UserSkill {
  id: number
  skill_id: number
  proficiency: number
  level: 'beginner' | 'intermediate' | 'strong'
  source: string
  notes?: string
  updated_at: string
  skill: Skill
}

export interface Career {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  category?: string
  avg_salary?: string
  demand_level: string
}

export interface SkillGapItem {
  skill_id: number
  skill_name: string
  skill_slug: string
  required_proficiency: number
  user_proficiency: number
  gap: number
  importance: number
  demand: string
  status: 'strong' | 'intermediate' | 'beginner' | 'missing'
}

export interface CareerCompatibility {
  career_id: number
  readiness_score: number
  total_skills: number
  strong_count: number
  intermediate_count: number
  missing_count: number
  weak_count: number
  gaps: SkillGapItem[]
}

export interface RoadmapModule {
  id: number
  title: string
  description?: string
  order: number
  duration_hours: number
  status: 'pending' | 'active' | 'completed'
  skill_id?: number
  resource_id?: number
}

export interface RoadmapPhase {
  id: number
  title: string
  description?: string
  order: number
  duration_weeks: number
  status: 'pending' | 'active' | 'completed'
  objectives: string[]
  modules: RoadmapModule[]
}

export interface Roadmap {
  id: number
  user_id: number
  career_id: number
  title: string
  description?: string
  status: string
  total_duration_weeks: number
  completion_percentage: number
  created_at: string
  phases: RoadmapPhase[]
}

export interface Resource {
  id: number
  title: string
  description?: string
  url?: string
  resource_type: string
  platform?: string
  difficulty: string
  duration_hours?: number
  is_free: boolean
  rating: number
}

export interface AssessmentQuestion {
  id: number
  question_text: string
  question_type: string
  options: string[]
  points: number
  order: number
  topic_tags: string[]
}

export interface Assessment {
  id: number
  title: string
  description?: string
  skill_id?: number
  difficulty: string
  time_limit_minutes: number
  passing_score: number
  questions: AssessmentQuestion[]
}

export interface AssessmentAttempt {
  id: number
  assessment_id: number
  score?: number
  max_score?: number
  percentage?: number
  weak_topics: string[]
  status: string
  started_at: string
  completed_at?: string
}

export interface AgentMessage {
  id: number
  run_id: string
  from_agent: string
  to_agent: string
  event: string
  payload: Record<string, any>
  status: string
  timestamp: string
}

export interface AgentRun {
  id: number
  run_id: string
  trigger_event: string
  status: string
  started_at: string
  messages: AgentMessage[]
}

export interface MentorMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface MentorConversation {
  id: number
  title: string
  created_at: string
  messages: MentorMessage[]
}

export interface ProgressOverview {
  readiness_score: number
  assessments_completed: number
  avg_assessment_score: number
  modules_completed: number
  total_modules: number
  roadmap_completion: number
}

