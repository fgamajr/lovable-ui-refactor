import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  progress?: number;
  colorScheme?: "blue" | "green" | "orange" | "purple" | "teal";
  variant?: "default" | "compact";
  className?: string;
}

const colorSchemes = {
  blue: {
    iconBg: "bg-gradient-to-br from-apple-blue/20 to-apple-blue/10",
    iconColor: "text-apple-blue",
    progressBg: "bg-apple-blue/20",
    progressFill: "bg-apple-blue",
  },
  green: {
    iconBg: "bg-gradient-to-br from-apple-green/20 to-apple-green/10",
    iconColor: "text-apple-green",
    progressBg: "bg-apple-green/20",
    progressFill: "bg-apple-green",
  },
  orange: {
    iconBg: "bg-gradient-to-br from-apple-orange/20 to-apple-orange/10",
    iconColor: "text-apple-orange",
    progressBg: "bg-apple-orange/20",
    progressFill: "bg-apple-orange",
  },
  purple: {
    iconBg: "bg-gradient-to-br from-apple-purple/20 to-apple-purple/10",
    iconColor: "text-apple-purple",
    progressBg: "bg-apple-purple/20",
    progressFill: "bg-apple-purple",
  },
  teal: {
    iconBg: "bg-gradient-to-br from-apple-teal/20 to-apple-teal/10",
    iconColor: "text-apple-teal",
    progressBg: "bg-apple-teal/20",
    progressFill: "bg-apple-teal",
  },
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  progress,
  colorScheme = "blue",
  variant = "default",
  className,
}: MetricCardProps) {
  const colors = colorSchemes[colorScheme];

  // Compact variant - smaller, inline layout
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "relative glass rounded-xl p-3 transition-apple",
          "hover:shadow-apple hover:-translate-y-0.5",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl flex-shrink-0 glass-inset", colors.iconBg)}>
            <div className={colors.iconColor}>{icon}</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground truncate">{title}</p>
              {trend && (
                <span
                  className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-lg flex-shrink-0",
                    trend.isPositive
                      ? "bg-apple-green/10 text-apple-green"
                      : "bg-apple-red/10 text-apple-red"
                  )}
                >
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              )}
            </div>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              {value}
            </p>
          </div>
        </div>
        {progress !== undefined && (
          <div className="mt-3">
            <div className={cn("h-1.5 rounded-full overflow-hidden glass-inset")}>
              <div
                className={cn("h-full rounded-full transition-all duration-700 ease-out", colors.progressFill)}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        "relative glass rounded-2xl p-4 sm:p-5 transition-apple",
        "hover:shadow-apple-lg hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={cn("p-2.5 sm:p-3 rounded-xl glass-inset", colors.iconBg)}>
          <div className={colors.iconColor}>{icon}</div>
        </div>
        {trend && (
          <span
            className={cn(
              "text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1 rounded-lg",
              trend.isPositive
                ? "bg-apple-green/15 text-apple-green"
                : "bg-apple-red/15 text-apple-red"
            )}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>

      <div className="space-y-0.5 sm:space-y-1">
        <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
        <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {value}
        </p>
        {subtitle && (
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-4 sm:mt-5">
          <div className={cn("h-2 rounded-full overflow-hidden glass-inset")}>
            <div
              className={cn("h-full rounded-full transition-all duration-700 ease-out", colors.progressFill)}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
            {progress.toFixed(1)}% complete
          </p>
        </div>
      )}
    </div>
  );
}
