import { useAccessibility } from "@/contexts/AccessibilityContext";

type BullBearColors = {
  bull: string;
  bear: string;
  bullBg: string;
  bearBg: string;
  bullBorder: string;
  bearBorder: string;
  bullIcon: string;
  bearIcon: string;
};

const colorMap: Record<string, BullBearColors> = {
  standard: {
    bull: "text-green-400",
    bear: "text-red-400",
    bullBg: "bg-green-500/5",
    bearBg: "bg-red-500/5",
    bullBorder: "border-l-green-500",
    bearBorder: "border-l-red-500",
    bullIcon: "text-green-400",
    bearIcon: "text-red-400",
  },
  protanopia: {
    bull: "text-blue-400",
    bear: "text-orange-400",
    bullBg: "bg-blue-500/5",
    bearBg: "bg-orange-500/5",
    bullBorder: "border-l-blue-500",
    bearBorder: "border-l-orange-500",
    bullIcon: "text-blue-400",
    bearIcon: "text-orange-400",
  },
  deuteranopia: {
    bull: "text-blue-400",
    bear: "text-orange-400",
    bullBg: "bg-blue-500/5",
    bearBg: "bg-orange-500/5",
    bullBorder: "border-l-blue-500",
    bearBorder: "border-l-orange-500",
    bullIcon: "text-blue-400",
    bearIcon: "text-orange-400",
  },
  tritanopia: {
    bull: "text-teal-400",
    bear: "text-red-400",
    bullBg: "bg-teal-500/5",
    bearBg: "bg-red-500/5",
    bullBorder: "border-l-teal-500",
    bearBorder: "border-l-red-500",
    bullIcon: "text-teal-400",
    bearIcon: "text-red-400",
  },
};

export function useBullBearColors(): BullBearColors {
  const { colorVision } = useAccessibility();
  return colorMap[colorVision] || colorMap.standard;
}
