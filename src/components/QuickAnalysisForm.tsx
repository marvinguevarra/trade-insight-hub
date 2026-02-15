import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTiers } from "@/lib/tierConfig";
import { Check, DollarSign, Crown } from "lucide-react";

const tierIcons: Record<string, React.ReactNode> = {
  lite: <Check className="h-3.5 w-3.5 text-success" />,
  standard: <DollarSign className="h-3.5 w-3.5 text-primary" />,
  premium: <Crown className="h-3.5 w-3.5 text-accent" />,
};

const tierBorderColors: Record<string, string> = {
  lite: "border-l-success",
  standard: "border-l-primary",
  premium: "border-l-accent",
};

const timeframes = [
  { value: "1w", label: "1 Week" },
  { value: "1m", label: "1 Month" },
  { value: "3m", label: "3 Months" },
  { value: "6m", label: "6 Months" },
  { value: "1y", label: "1 Year" },
];

interface QuickAnalysisFormProps {
  ticker: string;
  onTickerChange: (v: string) => void;
  timeframe: string;
  onTimeframeChange: (v: string) => void;
  tier: string;
  onTierChange: (v: string) => void;
}

const QuickAnalysisForm = ({
  ticker, onTickerChange,
  timeframe, onTimeframeChange,
  tier, onTierChange,
}: QuickAnalysisFormProps) => {
  const { tiers } = useTiers();

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
          Ticker Symbol
        </label>
        <Input
          placeholder="e.g. AAPL"
          value={ticker}
          onChange={(e) => onTickerChange(e.target.value.toUpperCase().slice(0, 5))}
          maxLength={5}
          className="bg-card text-foreground"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
            Timeframe
          </label>
          <Select value={timeframe} onValueChange={onTimeframeChange}>
            <SelectTrigger className="bg-card text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {timeframes.map((tf) => (
                <SelectItem key={tf.value} value={tf.value}>
                  {tf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
            Analysis Tier
          </label>
          <Select value={tier} onValueChange={onTierChange}>
            <SelectTrigger className="bg-card text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {(tiers || []).map((t) => {
                const isSelected = tier === t.id;
                return (
                  <SelectItem
                    key={t.id}
                    value={t.id}
                    className={`border-l-[3px] ${
                      isSelected
                        ? `${tierBorderColors[t.id] || ""} bg-secondary text-foreground`
                        : "border-l-transparent text-muted-foreground"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {tierIcons[t.id]}
                      {t.label}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default QuickAnalysisForm;
