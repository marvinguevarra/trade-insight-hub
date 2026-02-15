import { Card } from "@/components/ui/card";
import type { AnalysisResult } from "@/types/analysis";
import { TrendingUp, Calendar, Clock, DollarSign } from "lucide-react";

const TickerBanner = ({ data }: { data: AnalysisResult }) => {
  return (
    <Card className="bg-primary/5 border-primary/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="text-xl font-bold text-foreground">{data.symbol}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-lg font-semibold text-success">
            ${data.current_price.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{data.timeframe}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {data.date_range.start} → {data.date_range.end}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TickerBanner;
