import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTiers } from "@/lib/tierConfig";
import { useToast } from "@/hooks/use-toast";
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
  { value: "1d", label: "1 Day" },
  { value: "5d", label: "1 Week" },
  { value: "1mo", label: "1 Month" },
  { value: "3mo", label: "3 Months" },
  { value: "6mo", label: "6 Months" },
  { value: "1y", label: "1 Year" },
  { value: "2y", label: "2 Years" },
];

interface QuickAnalysisFormProps {
  ticker: string;
  onTickerChange: (v: string) => void;
  timeframe: string;
  onTimeframeChange: (v: string) => void;
  tier: string;
  onTierChange: (v: string) => void;
  disabled?: boolean;
}

const QuickAnalysisForm = ({
  ticker, onTickerChange,
  timeframe, onTimeframeChange,
  tier, onTierChange,
  disabled = false,
}: QuickAnalysisFormProps) => {
  const { tiers } = useTiers();

  const handleTickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z0-9.]/g, "").toUpperCase().slice(0, 6);
    onTickerChange(value);
  };

  return (
    <div className="space-y-4">
      {/* Ticker */}
      <div>
        <label htmlFor="ticker-input" className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
          Stock Ticker
        </label>
         <Input
          id="ticker-input"
          placeholder="e.g. AAPL, BRK.A"
          value={ticker}
          onChange={handleTickerChange}
          maxLength={6}
          className="bg-card text-foreground"
          disabled={disabled}
          required
        />
        <p className="mt-1 text-[10px] text-muted-foreground">
          Enter symbol (e.g., AAPL, MSFT, TSLA)
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Timeframe */}
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
            Timeframe
          </label>
          <Select value={timeframe} onValueChange={onTimeframeChange} disabled={disabled}>
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

        {/* Tier */}
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
            Analysis Tier
          </label>
          <Select value={tier} onValueChange={onTierChange} disabled={disabled}>
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
