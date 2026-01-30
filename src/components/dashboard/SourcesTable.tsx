import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FileText, Database, Globe, FileJson, ChevronDown, ArrowUpDown } from "lucide-react";
import { useState, forwardRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  lastSync?: string;
}

interface SourcesTableProps {
  sources: Source[];
  isLoading?: boolean;
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

type SortField = "name" | "documents" | "discovery" | "sync" | "processing" | "indexing" | "embedding";
type SortDirection = "asc" | "desc";

interface MiniProgressProps {
  value: number;
  colorScheme: string;
}

const MiniProgressInner = forwardRef<HTMLDivElement, MiniProgressProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ value, colorScheme, ...props }, ref) => {
    const colors: Record<string, { bg: string; fill: string }> = {
      blue: { bg: "bg-apple-blue/20", fill: "bg-apple-blue" },
      green: { bg: "bg-apple-green/20", fill: "bg-apple-green" },
      orange: { bg: "bg-apple-orange/20", fill: "bg-apple-orange" },
      purple: { bg: "bg-apple-purple/20", fill: "bg-apple-purple" },
      teal: { bg: "bg-apple-teal/20", fill: "bg-apple-teal" },
    };
    const c = colors[colorScheme] || colors.blue;

    return (
      <div ref={ref} className="flex items-center gap-1.5 min-w-0 cursor-help" {...props}>
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
);
MiniProgressInner.displayName = "MiniProgressInner";

function MiniProgress({ value, colorScheme }: MiniProgressProps) {
  const statusLabel = value === 100 ? "Complete" : value > 0 ? "In progress" : "Pending";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <MiniProgressInner value={value} colorScheme={colorScheme} />
      </TooltipTrigger>
      <TooltipContent>
        <p>{statusLabel} - {value}%</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Loading skeleton for table rows
function SourceRowSkeleton() {
  return (
    <tr className="border-b border-border/50">
      <td className="p-4"><Skeleton className="h-4 w-32" /></td>
      <td className="p-4"><Skeleton className="h-5 w-16" /></td>
      <td className="p-4 text-right"><Skeleton className="h-4 w-12 ml-auto" /></td>
      <td className="p-4"><Skeleton className="h-2 w-full" /></td>
      <td className="p-4"><Skeleton className="h-2 w-full" /></td>
      <td className="p-4"><Skeleton className="h-2 w-full" /></td>
      <td className="p-4"><Skeleton className="h-2 w-full" /></td>
      <td className="p-4"><Skeleton className="h-2 w-full" /></td>
    </tr>
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
        <TooltipProvider delayDuration={200}>
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
        </TooltipProvider>
      )}
    </div>
  );
}

// Sortable header component
function SortableHeader({ 
  label, 
  field, 
  currentSort, 
  currentDirection, 
  onSort 
}: { 
  label: string; 
  field: SortField; 
  currentSort: SortField; 
  currentDirection: SortDirection;
  onSort: (field: SortField) => void;
}) {
  const isActive = currentSort === field;
  
  return (
    <th 
      className="text-left text-xs font-medium text-muted-foreground p-4 min-w-[120px] cursor-pointer hover:text-foreground transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={cn(
          "h-3 w-3",
          isActive ? "text-primary" : "text-muted-foreground/50"
        )} />
      </div>
    </th>
  );
}

export function SourcesTable({ sources, isLoading = false, className }: SourcesTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedSources = [...sources].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const modifier = sortDirection === "asc" ? 1 : -1;
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue) * modifier;
    }
    return ((aValue as number) - (bValue as number)) * modifier;
  });

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
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border/50 p-4">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))
        ) : (
          sortedSources.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))
        )}
      </div>

      {/* Desktop: Table layout with sticky header */}
      <div className="hidden lg:block bg-card rounded-2xl border border-border/50 shadow-apple overflow-hidden">
        <div className="overflow-x-auto relative">
          {/* Scroll indicator gradient on right */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none z-10" />
          
          <TooltipProvider delayDuration={200}>
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-20">
                <tr className="border-b border-border/50 bg-muted/30 backdrop-blur-sm">
                  <SortableHeader label="Source" field="name" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort} />
                  <th className="text-left text-xs font-medium text-muted-foreground p-4">Type</th>
                  <SortableHeader label="Docs" field="documents" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader label="Discovery" field="discovery" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader label="Sync" field="sync" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader label="Processing" field="processing" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader label="Indexing" field="indexing" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader label="Embedding" field="embedding" currentSort={sortField} currentDirection={sortDirection} onSort={handleSort} />
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <SourceRowSkeleton key={i} />
                  ))
                ) : (
                  sortedSources.map((source, index) => {
                    const Icon = typeIcons[source.type];
                    return (
                      <tr 
                        key={source.id} 
                        className={cn(
                          "border-b border-border/50 last:border-0 transition-apple",
                          "hover:bg-muted/70",
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
                  })
                )}
              </tbody>
            </table>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
