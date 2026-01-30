import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, AlertCircle, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type StageStatus = "complete" | "processing" | "pending" | "error";

interface PipelineStageProps {
  name: string;
  status: StageStatus;
  progress: number;
  items?: { current: number; total: number };
  colorScheme: "blue" | "green" | "orange" | "purple" | "teal";
  lastUpdated?: string;
  className?: string;
}

const statusIcons: Record<StageStatus, React.ReactNode> = {
  complete: <CheckCircle2 className="h-4 w-4" />,
  processing: <Loader2 className="h-4 w-4 animate-spin" />,
  pending: <Clock className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4" />,
};

const statusLabels: Record<StageStatus, string> = {
  complete: "Complete",
  processing: "Processing",
  pending: "Pending",
  error: "Error",
};

const statusTooltips: Record<StageStatus, string> = {
  complete: "All items have been processed successfully",
  processing: "Currently processing items",
  pending: "Waiting to start processing",
  error: "An error occurred during processing",
};

const colorSchemes = {
  blue: {
    bg: "bg-apple-blue/10",
    fill: "bg-gradient-to-r from-apple-blue to-apple-blue/80",
    text: "text-apple-blue",
    badge: "bg-apple-blue/10 text-apple-blue",
  },
  green: {
    bg: "bg-apple-green/10",
    fill: "bg-gradient-to-r from-apple-green to-apple-green/80",
    text: "text-apple-green",
    badge: "bg-apple-green/10 text-apple-green",
  },
  orange: {
    bg: "bg-apple-orange/10",
    fill: "bg-gradient-to-r from-apple-orange to-apple-orange/80",
    text: "text-apple-orange",
    badge: "bg-apple-orange/10 text-apple-orange",
  },
  purple: {
    bg: "bg-apple-purple/10",
    fill: "bg-gradient-to-r from-apple-purple to-apple-purple/80",
    text: "text-apple-purple",
    badge: "bg-apple-purple/10 text-apple-purple",
  },
  teal: {
    bg: "bg-apple-teal/10",
    fill: "bg-gradient-to-r from-apple-teal to-apple-teal/80",
    text: "text-apple-teal",
    badge: "bg-apple-teal/10 text-apple-teal",
  },
};

export function PipelineStage({
  name,
  status,
  progress,
  items,
  colorScheme,
  lastUpdated = "Just now",
  className,
}: PipelineStageProps) {
  const colors = colorSchemes[colorScheme];

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "bg-card rounded-xl p-4 border border-border/50 shadow-apple-sm transition-apple",
          "hover:shadow-apple",
          className
        )}
      >
        {/* Header: name + status badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className={cn("font-medium text-sm truncate", colors.text)}>{name}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  "flex-shrink-0 flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap cursor-help",
                  status === "complete" && "bg-apple-green/10 text-apple-green",
                  status === "processing" && colors.badge,
                  status === "pending" && "bg-muted text-muted-foreground",
                  status === "error" && "bg-apple-red/10 text-apple-red"
                )}
              >
                {statusIcons[status]}
                <span className="hidden sm:inline">{statusLabels[status]}</span>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{statusTooltips[status]}</p>
              <p className="text-xs text-muted-foreground mt-1">Last updated: {lastUpdated}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        {/* Items count */}
        {items && (
          <div className="text-[11px] text-muted-foreground mb-2">
            {items.current.toLocaleString()}/{items.total.toLocaleString()}
          </div>
        )}

        <div className={cn("h-2 rounded-full overflow-hidden", colors.bg)}>
          <div
            className={cn("h-full rounded-full transition-all duration-500 ease-out", colors.fill)}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-end mt-2">
          <span className={cn("text-xs font-medium", colors.text)}>{progress}%</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
