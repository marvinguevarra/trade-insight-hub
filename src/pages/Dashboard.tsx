import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";

const mockHistory = [
  { id: "1", date: "2026-02-15", symbol: "AAPL", tier: "standard", cost: 2.40, status: "complete" },
  { id: "2", date: "2026-02-14", symbol: "WHR", tier: "premium", cost: 5.80, status: "complete" },
  { id: "3", date: "2026-02-13", symbol: "MSFT", tier: "lite", cost: 0.35, status: "complete" },
  { id: "4", date: "2026-02-12", symbol: "TSLA", tier: "standard", cost: 2.10, status: "failed" },
  { id: "5", date: "2026-02-10", symbol: "NVDA", tier: "premium", cost: 6.20, status: "complete" },
];

const totalSpent = mockHistory.reduce((s, h) => s + h.cost, 0);

const Dashboard = () => {
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
              <p className="text-3xl font-bold text-foreground">{mockHistory.length}</p>
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
              <p className="text-3xl font-bold text-foreground">
                ${(totalSpent / mockHistory.length).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Input placeholder="Filter symbol..." className="w-40 bg-card text-xs" />
          <Select>
            <SelectTrigger className="w-32 bg-card text-xs">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="lite">Lite</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="mt-4 border-border bg-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] uppercase">Date</TableHead>
                  <TableHead className="text-[10px] uppercase">Symbol</TableHead>
                  <TableHead className="text-[10px] uppercase">Tier</TableHead>
                  <TableHead className="text-[10px] uppercase">Cost</TableHead>
                  <TableHead className="text-[10px] uppercase">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHistory.map((h) => (
                  <TableRow key={h.id} className="cursor-pointer" onClick={() => {}}>
                    <Link to={`/results/${h.id}`} className="contents">
                      <TableCell className="text-xs">{h.date}</TableCell>
                      <TableCell className="text-xs font-bold">{h.symbol}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {h.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">${h.cost.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={h.status === "complete" ? "default" : "destructive"}
                          className="text-[10px]"
                        >
                          {h.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </Link>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
