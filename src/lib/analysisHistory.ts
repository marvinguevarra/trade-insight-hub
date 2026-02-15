export interface AnalysisRecord {
  id: string;
  symbol: string;
  date: string;
  tier: string;
  cost: number;
  status: "complete" | "failed";
  verdict?: string;
  fullResults?: any;
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
    date: new Date().toISOString(),
  };
  const updated = [newRecord, ...history].slice(0, MAX_RECORDS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // If storage full, try without fullResults on oldest entries
    const trimmed = updated.map((r, i) => i > 4 ? { ...r, fullResults: undefined } : r);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }
}

export function getAnalysisById(id: string): AnalysisRecord | undefined {
  return getAnalysisHistory().find((r) => r.id === id);
}

export function getStorageSizeMB(): string {
  const raw = localStorage.getItem(STORAGE_KEY) || "[]";
  return (new Blob([raw]).size / (1024 * 1024)).toFixed(2);
}
