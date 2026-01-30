import { cn } from "@/lib/utils";
import { AlertTriangle, X, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSystemHealth, ServiceHealth } from "@/contexts/SystemHealthContext";

interface SystemHealthBannerProps {
  className?: string;
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function ServiceRow({ service, onDismiss }: { service: ServiceHealth; onDismiss: () => void }) {
  const statusConfig = {
    online: { color: "text-apple-green", bg: "bg-apple-green/10" },
    degraded: { color: "text-apple-orange", bg: "bg-apple-orange/10" },
    offline: { color: "text-apple-red", bg: "bg-apple-red/10" },
  };

  const config = statusConfig[service.status];

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <span className={cn("w-2 h-2 rounded-full", config.bg.replace("/10", ""))} />
        <div>
          <span className="text-sm font-medium text-foreground">{service.name}</span>
          {service.message && (
            <p className="text-xs text-muted-foreground">{service.message}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          Last check: {formatTimeAgo(service.lastCheck)}
        </span>
        {service.status !== "online" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={onDismiss}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function SystemHealthBanner({ className }: SystemHealthBannerProps) {
  const { services, overallStatus, dismissedAlerts, checkHealth, dismissAlert, isLoading } =
    useSystemHealth();
  const [expanded, setExpanded] = useState(false);

  // Filter out dismissed and online services for the banner
  const problematicServices = services.filter(
    (s) => s.status !== "online" && !dismissedAlerts.has(s.name)
  );

  // If all services are online or dismissed, don't show banner
  if (problematicServices.length === 0 && overallStatus === "online") {
    return null;
  }

  const bannerConfig = {
    online: {
      bg: "bg-apple-green/10",
      border: "border-apple-green/20",
      icon: "text-apple-green",
    },
    degraded: {
      bg: "bg-apple-orange/10",
      border: "border-apple-orange/20",
      icon: "text-apple-orange",
    },
    offline: {
      bg: "bg-apple-red/10",
      border: "border-apple-red/20",
      icon: "text-apple-red",
    },
  };

  const config = bannerConfig[overallStatus];
  const mainService = problematicServices[0];

  if (!mainService) return null;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 animate-fade-in",
        config.bg,
        config.border,
        className
      )}
    >
      {/* Main banner content */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className={cn("h-5 w-5 mt-0.5 flex-shrink-0", config.icon)} />
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              {mainService.name} {mainService.status === "offline" ? "Offline" : "Degraded"}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {mainService.message || "Service is experiencing issues"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={checkHealth}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
            Retry
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => dismissAlert(mainService.name)}
          >
            Dismiss
          </Button>
          {problematicServices.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Expanded services list */}
      {expanded && problematicServices.length > 1 && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
          {problematicServices.slice(1).map((service) => (
            <ServiceRow
              key={service.name}
              service={service}
              onDismiss={() => dismissAlert(service.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
