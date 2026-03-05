import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import { useBullBearColors } from "@/hooks/useBullBearColors";

interface OptionsAnalysis {
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
}

const OptionsTab = ({ options }: { options: OptionsAnalysis | null }) => {
  const bb = useBullBearColors();

  if (!options || !options.sentiment) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-16 text-center">
          <p className="text-sm text-muted-foreground">No options data available for this tier.</p>
        </CardContent>
      </Card>
    );
  }

  const s = options.sentiment.toLowerCase();
  const sentimentColor =
    s === "bullish" ? `${bb.bull} ${bb.bullBg}` :
    s === "bearish" ? `${bb.bear} ${bb.bearBg}` :
    "text-yellow-300 bg-yellow-500/10";

  const hasImpliedLevels = options.implied_levels?.support || options.implied_levels?.resistance || options.implied_levels?.max_pain;
  const hasObservations = options.key_observations && options.key_observations.length > 0;
  const unusualActivity = options.unusual_activity && options.unusual_activity !== "None detected" && options.unusual_activity !== "None" ? options.unusual_activity : null;

  return (
    <div className="space-y-6">
      {/* Sentiment */}
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-3">
          <Badge className={`${sentimentColor} border-0 text-xs uppercase tracking-wider`}>
            {options.sentiment.toUpperCase()}
          </Badge>
          {options.sentiment_reasoning && (
            <p className="text-xs text-foreground leading-relaxed">{options.sentiment_reasoning}</p>
          )}
        </CardContent>
      </Card>

      {/* Implied Levels + Key Observations side by side */}
      <div className="grid gap-6 md:grid-cols-2">
        {hasImpliedLevels && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest">Implied Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px] uppercase">Level</TableHead>
                    <TableHead className="text-[10px] uppercase text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {options.implied_levels?.support && (
                    <TableRow>
                      <TableCell className={`text-xs ${bb.bull}`}>Support</TableCell>
                      <TableCell className="text-xs text-right font-mono">{options.implied_levels.support}</TableCell>
                    </TableRow>
                  )}
                  {options.implied_levels?.resistance && (
                    <TableRow>
                      <TableCell className={`text-xs ${bb.bear}`}>Resistance</TableCell>
                      <TableCell className="text-xs text-right font-mono">{options.implied_levels.resistance}</TableCell>
                    </TableRow>
                  )}
                  {options.implied_levels?.max_pain && (
                    <TableRow>
                      <TableCell className="text-xs text-muted-foreground">Max Pain</TableCell>
                      <TableCell className="text-xs text-right font-mono">{options.implied_levels.max_pain}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {hasObservations && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest">Key Observations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5" role="list">
                {options.key_observations!.map((obs, i) => (
                  <li key={i} className="flex gap-2 text-xs text-foreground leading-relaxed">
                    <span className="text-primary mt-0.5 shrink-0" aria-hidden="true">•</span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Positioning Summary */}
      {options.positioning_summary && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-widest">Positioning Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-foreground leading-relaxed">{options.positioning_summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Unusual Activity */}
      {unusualActivity && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-widest">Unusual Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-foreground leading-relaxed">{unusualActivity}</p>
          </CardContent>
        </Card>
      )}

      {/* Risk Flags */}
      {options.risk_flags && options.risk_flags.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
              <CardTitle className="text-xs uppercase tracking-widest">Risk Flags</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {options.risk_flags.map((flag, i) => (
              <Badge key={i} variant="outline" className="text-[10px] text-destructive border-destructive/30">
                {flag}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OptionsTab;
