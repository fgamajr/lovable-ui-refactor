import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FileText, Database, Globe, FileJson, ChevronDown } from "lucide-react";
import { useState } from "react";

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
    <div className="flex items-center gap-1.5 min-w-0">
      <div className={cn("flex-1 h-1.5 rounded-full overflow-hidden min-w-[40px]", c.bg)}>
        <div
          className={cn("h-full rounded-full transition-all duration-300", c.fill)}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[11px] text-muted-foreground w-8 text-right tabular-nums flex-shrink-0">
        {value}%
      </span>
    </div>
  );
}

// Mobile card view for a single source
function SourceCard({ source }: { source: Source }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = typeIcons[source.type];

  return (
    <div className="bg-card rounded-xl border border-border/50 p-4 shadow-apple-sm">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Badge 
            variant="secondary" 
            className="gap-1 font-normal text-[10px] bg-secondary/80 px-1.5 py-0.5 flex-shrink-0"
          >
            <Icon className="h-3 w-3" />
            {typeLabels[source.type]}
          </Badge>
          <span className="font-medium text-sm truncate">{source.name}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-muted-foreground tabular-nums">
            {source.documents.toLocaleString()} docs
          </span>
          <ChevronDown className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            expanded && "rotate-180"
          )} />
        </div>
      </div>
      
      {expanded && (
        <div className="mt-4 space-y-3 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Discovery</span>
            <MiniProgress value={source.discovery} colorScheme="blue" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Sync</span>
            <MiniProgress value={source.sync} colorScheme="green" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Processing</span>
            <MiniProgress value={source.processing} colorScheme="orange" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Indexing</span>
            <MiniProgress value={source.indexing} colorScheme="purple" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Embedding</span>
            <MiniProgress value={source.embedding} colorScheme="teal" />
          </div>
        </div>
      )}
    </div>
  );
}

export function SourcesTable({ sources, className }: SourcesTableProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Sources Pipeline Status</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Individual progress for each data source
          </p>
        </div>
      </div>

      {/* Mobile: Card layout */}
      <div className="lg:hidden space-y-3">
        {sources.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden lg:block bg-card rounded-2xl border border-border/50 shadow-apple overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Source</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4">Type</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-4">Docs</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4 min-w-[120px]">Discovery</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4 min-w-[120px]">Sync</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4 min-w-[120px]">Processing</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4 min-w-[120px]">Indexing</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-4 min-w-[120px]">Embedding</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source, index) => {
                const Icon = typeIcons[source.type];
                return (
                  <tr 
                    key={source.id} 
                    className={cn(
                      "border-b border-border/50 last:border-0 transition-apple hover:bg-muted/50",
                      index % 2 === 0 && "bg-muted/20"
                    )}
                  >
                    <td className="p-4 font-medium">{source.name}</td>
                    <td className="p-4">
                      <Badge 
                        variant="secondary" 
                        className="gap-1.5 font-normal text-xs bg-secondary/80"
                      >
                        <Icon className="h-3 w-3" />
                        {typeLabels[source.type]}
                      </Badge>
                    </td>
                    <td className="p-4 text-right tabular-nums">
                      {source.documents.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <MiniProgress value={source.discovery} colorScheme="blue" />
                    </td>
                    <td className="p-4">
                      <MiniProgress value={source.sync} colorScheme="green" />
                    </td>
                    <td className="p-4">
                      <MiniProgress value={source.processing} colorScheme="orange" />
                    </td>
                    <td className="p-4">
                      <MiniProgress value={source.indexing} colorScheme="purple" />
                    </td>
                    <td className="p-4">
                      <MiniProgress value={source.embedding} colorScheme="teal" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
