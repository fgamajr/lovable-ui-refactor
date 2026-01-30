import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Database, Globe, FileJson } from "lucide-react";

interface Source {
  id: string;
  name: string;
  type: "pdf" | "database" | "website" | "api";
  documents: number;
  discovery: number;
  sync: number;
  processing: number;
  indexing: number;
  embedding: number;
}

interface SourcesTableProps {
  sources: Source[];
  className?: string;
}

const typeIcons = {
  pdf: FileText,
  database: Database,
  website: Globe,
  api: FileJson,
};

const typeLabels = {
  pdf: "PDF",
  database: "Database",
  website: "Website",
  api: "API",
};

function MiniProgress({ value, colorScheme }: { value: number; colorScheme: string }) {
  const colors: Record<string, { bg: string; fill: string }> = {
    blue: { bg: "bg-apple-blue/20", fill: "bg-apple-blue" },
    green: { bg: "bg-apple-green/20", fill: "bg-apple-green" },
    orange: { bg: "bg-apple-orange/20", fill: "bg-apple-orange" },
    purple: { bg: "bg-apple-purple/20", fill: "bg-apple-purple" },
    teal: { bg: "bg-apple-teal/20", fill: "bg-apple-teal" },
  };
  const c = colors[colorScheme] || colors.blue;

  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className={cn("flex-1 h-1.5 rounded-full overflow-hidden", c.bg)}>
        <div
          className={cn("h-full rounded-full transition-all duration-300", c.fill)}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right">{value}%</span>
    </div>
  );
}

export function SourcesTable({ sources, className }: SourcesTableProps) {
  return (
    <div className={cn("bg-card rounded-2xl border border-border/50 shadow-apple overflow-hidden", className)}>
      <div className="p-4 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground">Sources Pipeline Status</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Individual progress for each data source
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/50">
            <TableHead className="text-xs font-medium">Source</TableHead>
            <TableHead className="text-xs font-medium">Type</TableHead>
            <TableHead className="text-xs font-medium text-right">Docs</TableHead>
            <TableHead className="text-xs font-medium">Discovery</TableHead>
            <TableHead className="text-xs font-medium">Sync</TableHead>
            <TableHead className="text-xs font-medium">Processing</TableHead>
            <TableHead className="text-xs font-medium">Indexing</TableHead>
            <TableHead className="text-xs font-medium">Embedding</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.map((source, index) => {
            const Icon = typeIcons[source.type];
            return (
              <TableRow 
                key={source.id} 
                className={cn(
                  "border-border/50 transition-apple hover:bg-muted/50",
                  index % 2 === 0 && "bg-muted/20"
                )}
              >
                <TableCell className="font-medium text-sm">{source.name}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className="gap-1.5 font-normal text-xs bg-secondary/80"
                  >
                    <Icon className="h-3 w-3" />
                    {typeLabels[source.type]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm tabular-nums">
                  {source.documents.toLocaleString()}
                </TableCell>
                <TableCell>
                  <MiniProgress value={source.discovery} colorScheme="blue" />
                </TableCell>
                <TableCell>
                  <MiniProgress value={source.sync} colorScheme="green" />
                </TableCell>
                <TableCell>
                  <MiniProgress value={source.processing} colorScheme="orange" />
                </TableCell>
                <TableCell>
                  <MiniProgress value={source.indexing} colorScheme="purple" />
                </TableCell>
                <TableCell>
                  <MiniProgress value={source.embedding} colorScheme="teal" />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
