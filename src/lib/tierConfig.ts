import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface TierConfig {
  id: string;
  label: string;
  price_display: string;
  icon: "free" | "std" | "pro";
  features?: string[];
}

// In-memory cache
let cachedTiers: TierConfig[] | null = null;
let fetchPromise: Promise<TierConfig[]> | null = null;

const fallbackTiers: TierConfig[] = [
  { id: "lite", label: "Lite", price_display: "Free", icon: "free" },
  { id: "standard", label: "Standard", price_display: "", icon: "std" },
  { id: "premium", label: "Premium", price_display: "", icon: "pro" },
];

async function fetchTiers(): Promise<TierConfig[]> {
  if (cachedTiers) return cachedTiers;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch(`${API_URL}/config/tiers`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch tiers");
      return res.json();
    })
    .then((data: TierConfig[]) => {
      cachedTiers = data;
      return data;
    })
    .catch(() => {
      cachedTiers = fallbackTiers;
      return fallbackTiers;
    })
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
}

export function useTiers() {
  const [tiers, setTiers] = useState<TierConfig[]>(cachedTiers || fallbackTiers);
  const [loading, setLoading] = useState(!cachedTiers);

  useEffect(() => {
    if (cachedTiers) {
      setTiers(cachedTiers);
      setLoading(false);
      return;
    }
    fetchTiers().then((data) => {
      setTiers(data);
      setLoading(false);
    });
  }, []);

  return { tiers, loading };
}

export function getTierById(tiers: TierConfig[], id: string): TierConfig | undefined {
  return tiers.find((t) => t.id === id);
}
