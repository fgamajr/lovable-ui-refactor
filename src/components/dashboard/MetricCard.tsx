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
  className,
}: MetricCardProps) {
  const colors = colorSchemes[colorScheme];

  return (
    <div
      className={cn(
        "relative bg-card rounded-2xl p-5 shadow-apple transition-apple",
        "hover:shadow-apple-lg hover:-translate-y-0.5",
        "border border-border/50",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl", colors.iconBg)}>
          <div className={colors.iconColor}>{icon}</div>
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.isPositive
                ? "bg-apple-green/10 text-apple-green"
                : "bg-apple-red/10 text-apple-red"
            )}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div className={cn("h-1.5 rounded-full overflow-hidden", colors.progressBg)}>
            <div
              className={cn("h-full rounded-full transition-all duration-700 ease-out", colors.progressFill)}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {progress.toFixed(1)}% complete
          </p>
        </div>
      )}
    </div>
  );
}
