import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowRight, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { getAnalysisHistory, type AnalysisRecord } from "@/lib/analysisHistory";

const Dashboard = () => {
  const history = getAnalysisHistory();
  const totalSpent = history.reduce((s, h) => s + h.cost, 0);
  const avgCost = history.length > 0 ? totalSpent / history.length : 0;
  const navigate = useNavigate();
  const { toast } = useToast();

  const viewReport = (record: AnalysisRecord) => {
    if (!record.fullResults) {
      toast({ title: "Report unavailable", description: "Full results were not stored for this analysis.", variant: "destructive" });
      return;
    }
    navigate("/results/history", {
      state: { result: record.fullResults, isHistorical: true, analysisDate: record.date },
    });
  };

  const downloadReport = (e: React.MouseEvent, record: AnalysisRecord) => {
    e.stopPropagation();
    if (!record.fullResults) {
      toast({ title: "No data", description: "Full results not available.", variant: "destructive" });
      return;
    }
    const blob = new Blob([JSON.stringify(record.fullResults, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${record.symbol}_${record.tier}_${record.date.split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground">ANALYSIS HISTORY</h1>

        {/* Stats */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Total Analyses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{history.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">${totalSpent.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Avg Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">${avgCost.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Empty state or table */}
        {history.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground/30" />
            <h2 className="mt-6 text-lg font-bold text-foreground">No analyses yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Run your first analysis to see results here.
            </p>
            <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
              <a href="/analyze">
                Run Analysis <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        ) : (
          <Card className="mt-6 border-border bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px] uppercase">Date</TableHead>
                    <TableHead className="text-[10px] uppercase">Symbol</TableHead>
                    <TableHead className="text-[10px] uppercase">Tier</TableHead>
                    <TableHead className="text-[10px] uppercase">Cost</TableHead>
                    <TableHead className="text-[10px] uppercase">Verdict</TableHead>
                    <TableHead className="text-[10px] uppercase">Status</TableHead>
                    <TableHead className="text-[10px] uppercase">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h) => (
                    <TableRow
                      key={h.id}
                      className={h.fullResults ? "cursor-pointer hover:bg-secondary/50 transition-colors" : ""}
                      onClick={() => h.fullResults && viewReport(h)}
                    >
                      <TableCell className="text-xs">{h.date.split("T")[0]}</TableCell>
                      <TableCell className="text-xs font-bold">{h.symbol}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {h.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">${h.cost.toFixed(2)}</TableCell>
                      <TableCell className="text-xs font-mono">{h.verdict || "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={h.status === "complete" ? "default" : "destructive"}
                          className="text-[10px]"
                        >
                          {h.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            disabled={!h.fullResults}
                            onClick={(e) => { e.stopPropagation(); viewReport(h); }}
                            aria-label={`View ${h.symbol} report`}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" /> View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            disabled={!h.fullResults}
                            onClick={(e) => downloadReport(e, h)}
                            aria-label={`Download ${h.symbol} report`}
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
