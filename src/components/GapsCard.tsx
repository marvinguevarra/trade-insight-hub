import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GapData } from "@/types/analysis";

const GapsCard = ({ gaps }: { gaps: GapData[] }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Price Gaps</CardTitle>
          <Badge variant="secondary">{gaps.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Dir</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gaps.slice(0, 5).map((gap, i) => (
              <TableRow key={i}>
                <TableCell className="text-muted-foreground text-sm">
                  {gap.date}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      gap.direction === "up"
                        ? "text-success"
                        : "text-destructive"
                    }
                  >
                    {gap.direction === "up" ? "⬆️" : "⬇️"}
                  </span>
                </TableCell>
                <TableCell
                  className={
                    gap.direction === "up"
                      ? "text-success font-medium"
                      : "text-destructive font-medium"
                  }
                >
                  {gap.size_percent.toFixed(1)}%
                </TableCell>
                <TableCell className="text-sm">{gap.type}</TableCell>
                <TableCell>{gap.filled ? "✅" : "❌"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default GapsCard;
