export interface GapData {
  date: string;
  direction: "up" | "down";
  size_percent: number;
  type: string;
  filled: boolean;
}

export interface SupportResistanceLevel {
  price: number;
  type: "support" | "resistance";
  strength: number;
  distance_percent: number;
}

export interface SupplyDemandZone {
  type: "supply" | "demand";
  range_low: number;
  range_high: number;
  pattern: string;
  strength: number;
  fresh: boolean;
}

export interface OptionsAnalysis {
  sentiment: string;
  sentiment_reasoning?: string;
  key_observations?: string[];
  positioning_summary?: string;
  implied_levels?: {
    support?: string;
    resistance?: string;
    max_pain?: string;
  };
  unusual_activity?: string;
  risk_flags?: string[];
  cost?: number;
  input_tokens?: number;
  output_tokens?: number;
}

export interface ETFFundQuality {
  expense_assessment: string;
  diversification: string;
  size_assessment: string;
  overall_grade: string;
}

export interface ETFInfo {
  name: string;
  category: string;
  fund_family: string;
  expense_ratio: number | null;
  total_assets: number | null;
  holdings_count: number;
  sector_count: number;
}

export interface FilingInfo {
  filing_type: string;
  filing_date: string;
  filing_url: string;
  accession_number: string;
}

export interface CostSummary {
  total_cost: number;
  breakdown: Record<string, number>;
  budget: number;
  budget_remaining: number;
  execution_time_ms: number;
  total_calls: number;
  timings?: Record<string, number>;
}

export interface AnalysisResult {
  symbol: string;
  current_price: number;
  timeframe: string;
  date_range: { start: string; end: string };
  gaps: GapData[];
  levels: SupportResistanceLevel[];
  zones: SupplyDemandZone[];
}

// Mock data for development
export const mockResult: AnalysisResult = {
  symbol: "AAPL",
  current_price: 189.84,
  timeframe: "1D",
  date_range: { start: "2025-01-01", end: "2026-02-14" },
  gaps: [
    { date: "2026-02-10", direction: "up", size_percent: 2.3, type: "Breakaway", filled: false },
    { date: "2026-02-05", direction: "down", size_percent: 1.1, type: "Common", filled: true },
    { date: "2026-01-28", direction: "up", size_percent: 3.7, type: "Runaway", filled: false },
    { date: "2026-01-15", direction: "down", size_percent: 0.8, type: "Common", filled: true },
    { date: "2026-01-08", direction: "up", size_percent: 1.5, type: "Exhaustion", filled: true },
  ],
  levels: [
    { price: 185.50, type: "support", strength: 92, distance_percent: -2.3 },
    { price: 195.00, type: "resistance", strength: 88, distance_percent: 2.7 },
    { price: 178.20, type: "support", strength: 75, distance_percent: -6.1 },
    { price: 200.00, type: "resistance", strength: 70, distance_percent: 5.4 },
    { price: 172.00, type: "support", strength: 65, distance_percent: -9.4 },
  ],
  zones: [
    { type: "demand", range_low: 183.00, range_high: 186.50, pattern: "Rally-Base-Rally", strength: 85, fresh: true },
    { type: "supply", range_low: 194.00, range_high: 197.20, pattern: "Drop-Base-Drop", strength: 78, fresh: true },
    { type: "demand", range_low: 175.50, range_high: 179.00, pattern: "Rally-Base-Drop", strength: 60, fresh: false },
  ],
};
