import { supabase } from "@/integrations/supabase/client";

export interface AnalysisRecord {
  id: string;
  symbol: string;
  created_at: string;
  tier: string;
  cost: number;
  verdict?: string;
  full_results?: any;
}

export async function getAnalysisHistory(): Promise<AnalysisRecord[]> {
  const { data, error } = await supabase
    .from("analyses")
    .select("id, symbol, tier, cost, verdict, full_results, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load analyses:", error);
    return [];
  }
  return data || [];
}

export async function saveAnalysis(record: {
  symbol: string;
  tier: string;
  cost: number;
  verdict?: string;
  fullResults: any;
}): Promise<{ saved: boolean; reason?: string; id?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { saved: false, reason: "not_authenticated" };

  const { data, error } = await supabase.from("analyses").insert({
    user_id: user.id,
    symbol: record.symbol,
    tier: record.tier,
    cost: record.cost,
    verdict: record.verdict || null,
    full_results: record.fullResults || {},
  }).select("id").single();

  if (error) {
    console.error("Failed to save analysis:", error);
    return { saved: false, reason: "db_error" };
  }
  return { saved: true, id: data.id };
}

export async function getAnalysisById(id: string): Promise<AnalysisRecord | null> {
  const { data } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data || null;
}
