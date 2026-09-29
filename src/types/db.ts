export type Plan = 'free' | 'pro' | 'scale';
export type ApplicationStatus = 'saved' | 'in_progress' | 'submitted' | 'awarded' | 'rejected';
export type ClusterStatus = 'not_started' | 'drafting' | 'ready';
export type RequestStatus = 'not_requested' | 'requested' | 'reminded' | 'received';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  school: string | null;
  graduation_year: number | null;
  gpa: number | null;
  major: string | null;
  state: string | null;
  demographic_tags: string[] | null;
  goal: string | null;
  primary_use_case: string | null;
  onboarded: boolean;
  plan: Plan;
  created_at?: string;
  updated_at?: string;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount_cents: number;
  deadline: string | null;
  essay_required: boolean;
  essay_word_count: number | null;
  recommendations_required: number;
  eligibility_summary: string | null;
  prompt_text: string | null;
  prompt_theme: string | null;
  applicant_pool_estimate: number | null;
  effort_score: number;
  win_probability: number;
  external_url: string | null;
  tags: string[] | null;
}

export interface Application {
  id: string;
  user_id: string;
  scholarship_id: string;
  status: ApplicationStatus;
  progress: number;
  submitted_at: string | null;
  awarded_cents: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationWithScholarship extends Application {
  scholarship: Scholarship;
}

export interface EssayCluster {
  id: string;
  user_id: string;
  theme: string;
  master_draft: string | null;
  word_count: number;
  status: ClusterStatus;
  created_at: string;
  updated_at: string;
}

export interface EssayAssignment {
  id: string;
  user_id: string;
  cluster_id: string;
  application_id: string;
  tailored_notes: string | null;
}

export interface Recommender {
  id: string;
  user_id: string;
  name: string;
  role: string | null;
  email: string | null;
  created_at: string;
}

export interface RecommendationRequest {
  id: string;
  user_id: string;
  recommender_id: string;
  application_id: string;
  status: RequestStatus;
  requested_at: string | null;
  due_date: string | null;
}

export interface FundingGoal {
  id: string;
  user_id: string;
  tuition_cents: number;
  already_covered_cents: number;
  academic_year: string | null;
}
