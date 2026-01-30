import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type ActivityType = "sync_complete" | "syncing" | "error" | "pending" | "retry";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  source: string;
  message: string;
  timestamp: Date;
  details?: string;
}

interface RecentActivityFeedProps {
  activities: ActivityItem[];
  onRetry?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  className?: string;
}

const activityConfig: Record<
  ActivityType,
  { icon: React.ReactNode; color: string; bgColor: string }
> = {
  sync_complete: {
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    color: "text-apple-green",
    bgColor: "bg-apple-green/10",
  },
  syncing: {
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
    color: "text-apple-blue",
    bgColor: "bg-apple-blue/10",
  },
  error: {
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    color: "text-apple-red",
    bgColor: "bg-apple-red/10",
  },
  pending: {
    icon: <Clock className="h-3.5 w-3.5" />,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  retry: {
    icon: <RefreshCw className="h-3.5 w-3.5" />,
    color: "text-apple-orange",
    bgColor: "bg-apple-orange/10",
  },
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ActivityRow({
  activity,
  onRetry,
  isLast,
}: {
  activity: ActivityItem;
  onRetry?: (id: string) => void;
  isLast: boolean;
}) {
  const config = activityConfig[activity.type];

  return (
    <div className="relative flex gap-3 pb-4">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border/50" />
      )}

      {/* Icon */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0",
          config.bgColor
        )}
      >
        <span className={config.color}>{config.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatTimeAgo(activity.timestamp)}
              </span>
              <FileText className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium text-foreground truncate">
                {activity.source}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {activity.message}
            </p>
          </div>

          {activity.type === "error" && onRetry && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-apple-orange hover:text-apple-orange flex-shrink-0"
              onClick={() => onRetry(activity.id)}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function RecentActivityFeed({
  activities,
  onRetry,
  className,
}: RecentActivityFeedProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border/50 p-4 shadow-apple-sm",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        <span className="text-xs text-muted-foreground">
          {activities.length} events
        </span>
      </div>

      <div className="space-y-0">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </p>
        ) : (
          activities.map((activity, index) => (
            <ActivityRow
              key={activity.id}
              activity={activity}
              onRetry={onRetry}
              isLast={index === activities.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}
