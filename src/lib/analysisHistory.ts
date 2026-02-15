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
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("analyses").insert({
    user_id: user.id,
    symbol: record.symbol,
    tier: record.tier,
    cost: record.cost,
    verdict: record.verdict || null,
    full_results: record.fullResults || {},
  });

  if (error) console.error("Failed to save analysis:", error);
}

export async function getAnalysisById(id: string): Promise<AnalysisRecord | null> {
  const { data } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data || null;
}
