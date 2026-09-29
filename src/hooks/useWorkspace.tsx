import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type {
  Application,
  ApplicationWithScholarship,
  EssayAssignment,
  EssayCluster,
  FundingGoal,
  RecommendationRequest,
  Recommender,
  Scholarship,
} from '@/types/db';

interface WorkspaceData {
  loading: boolean;
  scholarships: Scholarship[];
  applications: ApplicationWithScholarship[];
  clusters: EssayCluster[];
  assignments: EssayAssignment[];
  recommenders: Recommender[];
  requests: RecommendationRequest[];
  fundingGoal: FundingGoal | null;
  refetch: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceData | null>(null);

export function useWorkspace(): WorkspaceData {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used inside WorkspaceProvider');
  return ctx;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<ApplicationWithScholarship[]>([]);
  const [clusters, setClusters] = useState<EssayCluster[]>([]);
  const [assignments, setAssignments] = useState<EssayAssignment[]>([]);
  const [recommenders, setRecommenders] = useState<Recommender[]>([]);
  const [requests, setRequests] = useState<RecommendationRequest[]>([]);
  const [fundingGoal, setFundingGoal] = useState<FundingGoal | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const [sch, apps, cls, asg, recs, reqs, goal] = await Promise.all([
      supabase.from('scholarships').select('*').order('deadline', { ascending: true }),
      supabase.from('applications').select('*, scholarship:scholarships(*)'),
      supabase.from('essay_clusters').select('*').order('created_at'),
      supabase.from('essay_assignments').select('*'),
      supabase.from('recommenders').select('*').order('created_at'),
      supabase.from('recommendation_requests').select('*'),
      supabase.from('funding_goals').select('*').eq('user_id', user.id).maybeSingle(),
    ]);

    setScholarships((sch.data as Scholarship[]) ?? []);
    setApplications((apps.data as ApplicationWithScholarship[]) ?? []);
    setClusters((cls.data as EssayCluster[]) ?? []);
    setAssignments((asg.data as EssayAssignment[]) ?? []);
    setRecommenders((recs.data as Recommender[]) ?? []);
    setRequests((reqs.data as RecommendationRequest[]) ?? []);
    setFundingGoal((goal.data as FundingGoal) ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    void load();
  }, [user, load]);

  const value = useMemo<WorkspaceData>(
    () => ({
      loading,
      scholarships,
      applications,
      clusters,
      assignments,
      recommenders,
      requests,
      fundingGoal,
      refetch: load,
    }),
    [loading, scholarships, applications, clusters, assignments, recommenders, requests, fundingGoal, load],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export type { Application };
