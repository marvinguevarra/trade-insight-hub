/**
 * Bull/Bear color hook — now returns CSS-variable-backed utility classes.
 * Colors automatically adapt based on the cv-* class on <html>.
 */
export type BullBearColors = {
  bull: string;
  bear: string;
  bullBg: string;
  bearBg: string;
  bullBorder: string;
  bearBorder: string;
  bullIcon: string;
  bearIcon: string;
};

const colors: BullBearColors = {
  bull: "text-bull",
  bear: "text-bear",
  bullBg: "bg-bull/5",
  bearBg: "bg-bear/5",
  bullBorder: "border-l-bull",
  bearBorder: "border-l-bear",
  bullIcon: "text-bull",
  bearIcon: "text-bear",
};

export function useBullBearColors(): BullBearColors {
  return colors;
}
