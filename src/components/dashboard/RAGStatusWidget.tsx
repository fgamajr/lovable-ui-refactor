import { cn } from "@/lib/utils";
import { Database, Clock, Zap, HardDrive } from "lucide-react";

interface RAGStatusWidgetProps {
  status: "online" | "syncing" | "offline";
  chunks: number;
  lastSync: string;
  vectorSize: string;
  className?: string;
}

const statusConfig = {
  online: {
    label: "Online",
    dotColor: "bg-apple-green",
    textColor: "text-apple-green",
  },
  syncing: {
    label: "Syncing",
    dotColor: "bg-apple-orange",
    textColor: "text-apple-orange",
  },
  offline: {
    label: "Offline",
    dotColor: "bg-apple-red",
    textColor: "text-apple-red",
  },
};

export function RAGStatusWidget({
  status,
  chunks,
  lastSync,
  vectorSize,
  className,
}: RAGStatusWidgetProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "bg-card rounded-2xl p-5 border border-border/50 shadow-apple",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">RAG System</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full animate-pulse-dot", config.dotColor)} />
          <span className={cn("text-xs font-medium", config.textColor)}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="h-3.5 w-3.5" />
            <span className="text-xs">Vector Chunks</span>
          </div>
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {chunks.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground">
            <HardDrive className="h-3.5 w-3.5" />
            <span className="text-xs">Index Size</span>
          </div>
          <span className="text-sm font-semibold text-foreground">
            {vectorSize}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">Last Sync</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {lastSync}
          </span>
        </div>
      </div>
    </div>
  );
}
