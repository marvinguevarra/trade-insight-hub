import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import type { SupportResistanceLevel } from "@/types/analysis";

const LevelsCard = ({ levels }: { levels: SupportResistanceLevel[] }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Key Levels</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Price</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Strength</TableHead>
              <TableHead>Dist %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {levels.slice(0, 5).map((level, i) => (
              <TableRow key={i}>
                <TableCell className="font-mono font-medium">
                  ${level.price.toFixed(2)}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      level.type === "support"
                        ? "text-success"
                        : "text-destructive"
                    }
                  >
                    {level.type === "support" ? "🟢 Support" : "🔴 Resistance"}
                  </span>
                </TableCell>
                <TableCell className="w-28">
                  <div className="flex items-center gap-2">
                    <Progress
                      value={level.strength}
                      className="h-2 flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-8">
                      {level.strength}
                    </span>
                  </div>
                </TableCell>
                <TableCell
                  className={`font-mono text-sm ${
                    level.distance_percent > 0
                      ? "text-success"
                      : "text-destructive"
                  }`}
                >
                  {level.distance_percent > 0 ? "+" : ""}
                  {level.distance_percent.toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LevelsCard;
