export interface AnalysisRecord {
  id: string;
  symbol: string;
  date: string;
  tier: string;
  cost: number;
  status: "complete" | "failed";
  verdict?: string;
}

const STORAGE_KEY = "analysis_history";
const MAX_RECORDS = 10;

export function getAnalysisHistory(): AnalysisRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAnalysis(record: Omit<AnalysisRecord, "id" | "date">): void {
  const history = getAnalysisHistory();
  const newRecord: AnalysisRecord = {
    ...record,
    id: crypto.randomUUID(),
    date: new Date().toISOString().split("T")[0],
  };
  const updated = [newRecord, ...history].slice(0, MAX_RECORDS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
