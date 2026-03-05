import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, AlertTriangle, Sparkles } from "lucide-react";
import { useBullBearColors } from "@/hooks/useBullBearColors";

interface ETFFundamentalTabProps {
  fundamental: any;
}

const gradeColors: Record<string, string> = {
  A: "text-bull bg-bull/10 border-bull/30",
  "A+": "text-bull bg-bull/10 border-bull/30",
  B: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  "B+": "text-blue-400 bg-blue-400/10 border-blue-400/30",
  C: "text-yellow-300 bg-yellow-500/10 border-yellow-500/30",
  "C+": "text-yellow-300 bg-yellow-500/10 border-yellow-500/30",
  D: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  F: "text-bear bg-bear/10 border-bear/30",
};

const titleCase = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatAssets = (val: number | null | undefined): string => {
  if (val == null) return "N/A";
  if (val >= 1e12) return `$${(val / 1e12).toFixed(1)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
  return `$${val.toLocaleString()}`;
};

const formatExpenseRatio = (val: number | null | undefined): string => {
  if (val == null) return "N/A";
  return `${(val * 100).toFixed(2)}%`;
};

const ETFFundamentalTab = ({ fundamental }: ETFFundamentalTabProps) => {
  const bb = useBullBearColors();
  const fq = fundamental?.fund_quality;
  const info = fundamental?.etf_info;
  const grade = fq?.overall_grade || "";
  const gradeClass = gradeColors[grade] || "text-foreground bg-muted border-border";

  const hasStrengths = (fundamental?.key_strengths?.length ?? 0) > 0;
  const hasRisks = (fundamental?.key_risks?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      {/* ETF Header + Grade */}
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-foreground">
                  {info?.name && info.name !== "Unknown" ? info.name : "ETF Analysis"}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {info?.category && info.category !== "Unknown" && (
                  <span>{info.category}</span>
                )}
                {info?.fund_family && info.fund_family !== "Unknown" && (
                  <>
                    <span>·</span>
                    <span>{info.fund_family}</span>
                  </>
                )}
              </div>
            </div>
            {grade && (
              <span className={`text-4xl font-bold font-mono border px-3 py-1 ${gradeClass}`}>
                {grade}
              </span>
            )}
          </div>

          {/* Metrics Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Metric</TableHead>
                <TableHead className="text-xs text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fq?.expense_assessment && (
                <TableRow>
                  <TableCell className="text-xs text-muted-foreground">Expense Assessment</TableCell>
                  <TableCell className="text-xs text-right font-mono">{titleCase(fq.expense_assessment)}</TableCell>
                </TableRow>
              )}
              {fq?.diversification && (
                <TableRow>
                  <TableCell className="text-xs text-muted-foreground">Diversification</TableCell>
                  <TableCell className="text-xs text-right font-mono">{titleCase(fq.diversification)}</TableCell>
                </TableRow>
              )}
              {fq?.size_assessment && (
                <TableRow>
                  <TableCell className="text-xs text-muted-foreground">Size Assessment</TableCell>
                  <TableCell className="text-xs text-right font-mono">{titleCase(fq.size_assessment)}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell className="text-xs text-muted-foreground">Expense Ratio</TableCell>
                <TableCell className="text-xs text-right font-mono">{formatExpenseRatio(info?.expense_ratio)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-xs text-muted-foreground">Total Assets</TableCell>
                <TableCell className="text-xs text-right font-mono">{formatAssets(info?.total_assets)}</TableCell>
              </TableRow>
              {info?.holdings_count != null && (
                <TableRow>
                  <TableCell className="text-xs text-muted-foreground">Holdings Count</TableCell>
                  <TableCell className="text-xs text-right font-mono">{info.holdings_count}</TableCell>
                </TableRow>
              )}
              {info?.sector_count != null && (
                <TableRow>
                  <TableCell className="text-xs text-muted-foreground">Sector Count</TableCell>
                  <TableCell className="text-xs text-right font-mono">{info.sector_count}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Concentration Risk */}
      {fundamental?.concentration_risk && (
        <Card className="border-border bg-card">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/70">Concentration Risk</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{fundamental.concentration_risk}</p>
          </CardContent>
        </Card>
      )}

      {/* Sector Analysis */}
      {fundamental?.sector_analysis && (
        <Card className="border-border bg-card">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/70">Sector Analysis</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{fundamental.sector_analysis}</p>
          </CardContent>
        </Card>
      )}

      {/* Key Strengths + Key Risks side-by-side */}
      <div className="grid gap-6 md:grid-cols-2">
        {hasStrengths && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest text-bull">Key Strengths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {fundamental.key_strengths.map((s: string, i: number) => (
                <p key={i} className="text-xs text-foreground flex items-start gap-2">
                  <Sparkles className={`h-3 w-3 ${bb.bullIcon} shrink-0 mt-0.5`} aria-hidden="true" />
                  {s}
                </p>
              ))}
            </CardContent>
          </Card>
        )}
        {hasRisks && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest text-bear">Key Risks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {fundamental.key_risks.map((r: string, i: number) => (
                <p key={i} className="text-xs text-foreground flex items-start gap-2">
                  <AlertTriangle className={`h-3 w-3 ${bb.bearIcon} shrink-0 mt-0.5`} aria-hidden="true" />
                  {r}
                </p>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Competitive Position */}
      {fundamental?.competitive_position && (
        <Card className="border-border bg-card">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/70">Competitive Position</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{fundamental.competitive_position}</p>
          </CardContent>
        </Card>
      )}

      {/* Suitability */}
      {fundamental?.suitability && (
        <Card className="border-border bg-card">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/70">Suitability</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{fundamental.suitability}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ETFFundamentalTab;
