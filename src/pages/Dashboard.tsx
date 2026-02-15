import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowRight, Eye, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { getAnalysisHistory, type AnalysisRecord } from "@/lib/analysisHistory";

const Dashboard = () => {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    getAnalysisHistory().then((data) => {
      setHistory(data);
      setLoading(false);
    });
  }, []);

  const totalSpent = history.reduce((s, h) => s + Number(h.cost), 0);
  const avgCost = history.length > 0 ? totalSpent / history.length : 0;

  const viewReport = (record: AnalysisRecord) => {
    if (!record.full_results) {
      toast({ title: "Report unavailable", description: "Full results were not stored for this analysis.", variant: "destructive" });
      return;
    }
    navigate("/results/history", {
      state: { result: record.full_results, isHistorical: true, analysisDate: record.created_at },
    });
  };

  const downloadReport = (e: React.MouseEvent, record: AnalysisRecord) => {
    e.stopPropagation();
    if (!record.full_results) {
      toast({ title: "No data", description: "Full results not available.", variant: "destructive" });
      return;
    }
    const blob = new Blob([JSON.stringify(record.full_results, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${record.symbol}_${record.tier}_${record.created_at.split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground">ANALYSIS HISTORY</h1>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{history.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">${totalSpent.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">Avg Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">${avgCost.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {history.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground/30" />
            <h2 className="mt-6 text-lg font-bold text-foreground">No analyses yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Run your first analysis to see results here.</p>
            <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
              <a href="/analyze">Run Analysis <ArrowRight className="ml-2 h-4 w-4" /></a>
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
                    <TableHead className="text-[10px] uppercase">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h) => (
                    <TableRow
                      key={h.id}
                      className="cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => viewReport(h)}
                    >
                      <TableCell className="text-xs">{h.created_at.split("T")[0]}</TableCell>
                      <TableCell className="text-xs font-bold">{h.symbol}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase">{h.tier}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">${Number(h.cost).toFixed(2)}</TableCell>
                      <TableCell className="text-xs font-mono">{h.verdict || "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs"
                            onClick={(e) => { e.stopPropagation(); viewReport(h); }}
                            aria-label={`View ${h.symbol} report`}>
                            <Eye className="h-3.5 w-3.5 mr-1" /> View
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs"
                            onClick={(e) => downloadReport(e, h)}
                            aria-label={`Download ${h.symbol} report`}>
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
