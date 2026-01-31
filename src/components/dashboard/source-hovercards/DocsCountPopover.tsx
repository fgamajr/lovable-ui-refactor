import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { FileText, AlertCircle, Clock, HardDrive, ExternalLink, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocsBreakdown {
  byStatus: {
    processed: number;
    queued: number;
    errored: number;
  };
  byYear?: Record<string, number>;
  totalSize?: string;
  avgSize?: string;
}

interface DocsCountPopoverProps {
  totalDocs: number;
  breakdown?: DocsBreakdown;
  children: React.ReactNode;
}

export function DocsCountPopover({ totalDocs, breakdown, children }: DocsCountPopoverProps) {
  // Default breakdown if not provided
  const stats = breakdown?.byStatus || {
    processed: Math.floor(totalDocs * 0.88),
    queued: Math.floor(totalDocs * 0.08),
    errored: Math.floor(totalDocs * 0.04),
  };

  const byYear = breakdown?.byYear || {
    "2024": Math.floor(totalDocs * 0.37),
    "2023": Math.floor(totalDocs * 0.41),
    "2022": Math.floor(totalDocs * 0.22),
  };

  const processedPercent = Math.round((stats.processed / totalDocs) * 100);
  const queuedPercent = Math.round((stats.queued / totalDocs) * 100);
  const erroredPercent = Math.round((stats.errored / totalDocs) * 100);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-80 bg-popover/95 backdrop-blur-md border-border/50"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">
              {totalDocs.toLocaleString()} Documentos
            </h4>
          </div>

          {/* Status breakdown */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Por status:</p>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-3 w-3 text-apple-green" />
                  <span>Processados</span>
                </div>
                <span className="tabular-nums text-muted-foreground">
                  {stats.processed.toLocaleString()} ({processedPercent}%)
                </span>
              </div>
              <Progress value={processedPercent} className="h-1.5" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-apple-orange" />
                  <span>Em fila</span>
                </div>
                <span className="tabular-nums text-muted-foreground">
                  {stats.queued.toLocaleString()} ({queuedPercent}%)
                </span>
              </div>
              <Progress value={queuedPercent} className="h-1.5 [&>div]:bg-apple-orange" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="h-3 w-3 text-destructive" />
                  <span>Com erro</span>
                </div>
                <span className="tabular-nums text-muted-foreground">
                  {stats.errored.toLocaleString()} ({erroredPercent}%)
                </span>
              </div>
              <Progress value={erroredPercent} className="h-1.5 [&>div]:bg-destructive" />
            </div>
          </div>

          {/* Year breakdown */}
          <div className="border-t border-border/30 pt-3 space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Por ano:</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {Object.entries(byYear)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([year, count]) => (
                  <div key={year} className="text-center p-2 rounded-md bg-muted/50">
                    <div className="font-medium">{year}</div>
                    <div className="text-muted-foreground tabular-nums">
                      {count.toLocaleString()}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Size info */}
          <div className="border-t border-border/30 pt-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <HardDrive className="h-3 w-3" />
              <span>Total: {breakdown?.totalSize || "3.2 GB"}</span>
            </div>
            <span>Média: {breakdown?.avgSize || "2.6 MB"}/doc</span>
          </div>

          {/* Action */}
          <Button variant="ghost" size="sm" className="w-full text-xs h-8 gap-1.5">
            Ver todos os documentos
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
