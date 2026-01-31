import { cn } from "@/lib/utils";
import { Activity, Database, Clock, TrendingUp, Server } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuickStatusBarProps {
  syncStatus: {
    synced: number;
    total: number;
    pending: number;
    failed: number;
    inProgress: number;
  };
  elasticsearch: {
    status: "online" | "degraded" | "offline";
    docsIndexed: number;
    responseTime: number;
  };
  throughput: {
    rate: string;
    eta: string;
  };
  className?: string;
}

const statusColors = {
  online: "bg-apple-green",
  degraded: "bg-apple-orange",
  offline: "bg-apple-red",
};

const statusLabels = {
  online: "Online",
  degraded: "Degraded",
  offline: "Offline",
};

export function QuickStatusBar({
  syncStatus,
  elasticsearch,
  throughput,
  className,
}: QuickStatusBarProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-3 gap-3",
          className
        )}
      >
        {/* Sync Status Card */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-lg glass-inset bg-apple-blue/10">
              <Database className="h-3.5 w-3.5 text-apple-blue" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Sync Status
            </span>
          </div>
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <span className="w-2 h-2 rounded-full bg-apple-green animate-pulse-dot" />
                  <span className="text-sm font-semibold text-foreground">
                    {syncStatus.synced}/{syncStatus.total} Synced
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>All documents synchronized with sources</p>
              </TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {syncStatus.pending > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1.5 cursor-help">
                      <span className="w-1.5 h-1.5 rounded-full bg-apple-orange" />
                      {syncStatus.pending} Pending
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Waiting to be processed</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {syncStatus.inProgress > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1.5 cursor-help">
                      <span className="w-1.5 h-1.5 rounded-full bg-apple-blue animate-pulse" />
                      {syncStatus.inProgress} In Progress
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Currently syncing</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {syncStatus.failed > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1.5 cursor-help">
                      <span className="w-1.5 h-1.5 rounded-full bg-apple-red" />
                      {syncStatus.failed} Failed
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sync failed - requires attention</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>

        {/* Elasticsearch Status Card */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-lg glass-inset bg-apple-green/10">
              <Server className="h-3.5 w-3.5 text-apple-green" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Elasticsearch
            </span>
          </div>
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      statusColors[elasticsearch.status],
                      elasticsearch.status === "online" && "animate-pulse-dot"
                    )}
                  />
                  <span className="text-sm font-semibold text-foreground">
                    {statusLabels[elasticsearch.status]}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search engine status</p>
              </TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{(elasticsearch.docsIndexed / 1000).toFixed(0)}K indexed</span>
              <span>•</span>
              <span>{elasticsearch.responseTime}ms</span>
            </div>
          </div>
        </div>

        {/* Throughput Card */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-lg glass-inset bg-apple-orange/10">
              <Activity className="h-3.5 w-3.5 text-apple-orange" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Throughput
            </span>
          </div>
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <TrendingUp className="h-3.5 w-3.5 text-apple-green" />
                  <span className="text-sm font-semibold text-foreground">
                    {throughput.rate}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Current processing rate</p>
              </TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>ETA: {throughput.eta}</span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
