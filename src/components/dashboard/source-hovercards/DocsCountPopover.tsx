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
      <PopoverContent align="end" className="w-80">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">
              {totalDocs.toLocaleString()} Documentos
            </h4>
          </div>

          {/* Separator */}
          <div className="separator-line" />

          {/* Status breakdown */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Por status</p>
            
            <div className="space-y-2.5">
              {/* Processed */}
              <div className="glass-inset rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-apple-green" />
                    <span className="text-foreground">Processados</span>
                  </div>
                  <span className="tabular-nums text-muted-foreground">
                    {stats.processed.toLocaleString()} ({processedPercent}%)
                  </span>
                </div>
                <Progress value={processedPercent} className="h-1.5" />
              </div>

              {/* Queued */}
              <div className="glass-inset rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-apple-orange" />
                    <span className="text-foreground">Em fila</span>
                  </div>
                  <span className="tabular-nums text-muted-foreground">
                    {stats.queued.toLocaleString()} ({queuedPercent}%)
                  </span>
                </div>
                <Progress value={queuedPercent} className="h-1.5 [&>div]:bg-apple-orange" />
              </div>

              {/* Errored */}
              <div className="glass-inset rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                    <span className="text-foreground">Com erro</span>
                  </div>
                  <span className="tabular-nums text-muted-foreground">
                    {stats.errored.toLocaleString()} ({erroredPercent}%)
                  </span>
                </div>
                <Progress value={erroredPercent} className="h-1.5 [&>div]:bg-destructive" />
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="separator-line" />

          {/* Year breakdown */}
          <div className="space-y-2.5">
            <p className="text-xs font-medium text-muted-foreground">Por ano</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(byYear)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([year, count]) => (
                  <div key={year} className="text-center p-2.5 rounded-xl glass-inset">
                    <div className="text-xs font-medium text-foreground">{year}</div>
                    <div className="text-[10px] text-muted-foreground tabular-nums mt-0.5">
                      {count.toLocaleString()}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Separator */}
          <div className="separator-line" />

          {/* Size info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <HardDrive className="h-3.5 w-3.5" />
              <span>Total: {breakdown?.totalSize || "3.2 GB"}</span>
            </div>
            <span>Média: {breakdown?.avgSize || "2.6 MB"}/doc</span>
          </div>

          {/* Action */}
          <Button variant="secondary" size="sm" className="w-full text-xs h-9 gap-2 rounded-xl">
            Ver todos os documentos
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
