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
import {
  SourceNameHoverCard,
  SourceTypeHoverCard,
  DocsCountPopover,
  PipelineStageHoverCard,
} from "./source-hovercards";
import { SourceDetailDialog } from "./SourceDetailDialog";

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
  // Extended fields for hovercards
  description?: string;
  createdAt?: Date;
  lastUpdated?: Date;
  owner?: string;
  tags?: string[];
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
    const colors: Record<string, { fill: string }> = {
      blue: { fill: "bg-apple-blue" },
      green: { fill: "bg-apple-green" },
      orange: { fill: "bg-apple-orange" },
      purple: { fill: "bg-apple-purple" },
      teal: { fill: "bg-apple-teal" },
    };
    const c = colors[colorScheme] || colors.blue;

    return (
      <div ref={ref} className="flex items-center gap-2 min-w-0 cursor-help" {...props}>
        <div className="flex-1 h-2 rounded-full overflow-hidden min-w-[40px] glass-inset">
          <div
            className={cn("h-full rounded-full transition-all duration-300", c.fill)}
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-[11px] font-medium text-muted-foreground w-8 text-right tabular-nums flex-shrink-0">
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
function SourceCard({ source, onOpenDetail }: { source: Source; onOpenDetail: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = typeIcons[source.type];

  return (
    <div className="glass rounded-xl p-4">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <SourceTypeHoverCard type={source.type}>
            <Badge 
              variant="secondary" 
              className="gap-1 font-normal text-[10px] bg-secondary/80 px-1.5 py-0.5 flex-shrink-0 cursor-help"
            >
              <Icon className="h-3 w-3" />
              {typeLabels[source.type]}
            </Badge>
          </SourceTypeHoverCard>
          <SourceNameHoverCard
            name={source.name}
            description={source.description}
            createdAt={source.createdAt}
            lastUpdated={source.lastUpdated}
            owner={source.owner}
            tags={source.tags}
          >
            <span 
              className="font-medium text-sm truncate hover:text-primary transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail();
              }}
            >
              {source.name}
            </span>
          </SourceNameHoverCard>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <DocsCountPopover totalDocs={source.documents}>
            <span 
              className="text-xs text-muted-foreground tabular-nums hover:text-primary cursor-pointer transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {source.documents.toLocaleString()} docs
            </span>
          </DocsCountPopover>
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
              <PipelineStageHoverCard stage="discovery" progress={source.discovery} totalDocs={source.documents}>
                <div><MiniProgressInner value={source.discovery} colorScheme="blue" /></div>
              </PipelineStageHoverCard>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Sync</span>
              <PipelineStageHoverCard stage="sync" progress={source.sync} totalDocs={source.documents}>
                <div><MiniProgressInner value={source.sync} colorScheme="green" /></div>
              </PipelineStageHoverCard>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Processing</span>
              <PipelineStageHoverCard stage="processing" progress={source.processing} totalDocs={source.documents}>
                <div><MiniProgressInner value={source.processing} colorScheme="orange" /></div>
              </PipelineStageHoverCard>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Indexing</span>
              <PipelineStageHoverCard stage="indexing" progress={source.indexing} totalDocs={source.documents}>
                <div><MiniProgressInner value={source.indexing} colorScheme="purple" /></div>
              </PipelineStageHoverCard>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Embedding</span>
              <PipelineStageHoverCard stage="embedding" progress={source.embedding} totalDocs={source.documents}>
                <div><MiniProgressInner value={source.embedding} colorScheme="teal" /></div>
              </PipelineStageHoverCard>
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
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleOpenDetail = (source: Source) => {
    setSelectedSource(source);
    setDialogOpen(true);
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
            <SourceCard 
              key={source.id} 
              source={source} 
              onOpenDetail={() => handleOpenDetail(source)}
            />
          ))
        )}
      </div>

      {/* Desktop: Table layout with sticky header */}
      <div className="hidden lg:block glass rounded-2xl overflow-hidden">
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
                        <td className="p-4">
                          <SourceNameHoverCard
                            name={source.name}
                            description={source.description}
                            createdAt={source.createdAt}
                            lastUpdated={source.lastUpdated}
                            owner={source.owner}
                            tags={source.tags}
                          >
                            <span 
                              className="font-medium hover:text-primary transition-colors cursor-pointer"
                              onClick={() => handleOpenDetail(source)}
                            >
                              {source.name}
                            </span>
                          </SourceNameHoverCard>
                        </td>
                        <td className="p-4">
                          <SourceTypeHoverCard type={source.type}>
                            <Badge 
                              variant="secondary" 
                              className="gap-1.5 font-normal text-xs bg-secondary/80 cursor-help"
                            >
                              <Icon className="h-3 w-3" />
                              {typeLabels[source.type]}
                            </Badge>
                          </SourceTypeHoverCard>
                        </td>
                        <td className="p-4 text-right">
                          <DocsCountPopover totalDocs={source.documents}>
                            <span className="tabular-nums hover:text-primary cursor-pointer transition-colors">
                              {source.documents.toLocaleString()}
                            </span>
                          </DocsCountPopover>
                        </td>
                        <td className="p-4">
                          <PipelineStageHoverCard stage="discovery" progress={source.discovery} totalDocs={source.documents}>
                            <div><MiniProgressInner value={source.discovery} colorScheme="blue" /></div>
                          </PipelineStageHoverCard>
                        </td>
                        <td className="p-4">
                          <PipelineStageHoverCard stage="sync" progress={source.sync} totalDocs={source.documents}>
                            <div><MiniProgressInner value={source.sync} colorScheme="green" /></div>
                          </PipelineStageHoverCard>
                        </td>
                        <td className="p-4">
                          <PipelineStageHoverCard stage="processing" progress={source.processing} totalDocs={source.documents}>
                            <div><MiniProgressInner value={source.processing} colorScheme="orange" /></div>
                          </PipelineStageHoverCard>
                        </td>
                        <td className="p-4">
                          <PipelineStageHoverCard stage="indexing" progress={source.indexing} totalDocs={source.documents}>
                            <div><MiniProgressInner value={source.indexing} colorScheme="purple" /></div>
                          </PipelineStageHoverCard>
                        </td>
                        <td className="p-4">
                          <PipelineStageHoverCard stage="embedding" progress={source.embedding} totalDocs={source.documents}>
                            <div><MiniProgressInner value={source.embedding} colorScheme="teal" /></div>
                          </PipelineStageHoverCard>
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

      {/* Detail Dialog */}
      {selectedSource && (
        <SourceDetailDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          source={selectedSource}
        />
      )}
    </div>
  );
}
