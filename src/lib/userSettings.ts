const STORAGE_KEY = "user_settings";

export interface UserSettings {
  defaultTier: string;
  budgetLimit: string;
}

const defaults: UserSettings = {
  defaultTier: "standard",
  budgetLimit: "10",
};

export function getSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch {}
  return { ...defaults };
}

export function saveSettings(settings: Partial<UserSettings>): void {
  const current = getSettings();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...settings }));
}
