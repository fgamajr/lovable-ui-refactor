import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  colorScheme?: "blue" | "green" | "orange" | "purple" | "teal";
  showLabel?: boolean;
  className?: string;
}

const colorClasses = {
  blue: "stroke-apple-blue",
  green: "stroke-apple-green",
  orange: "stroke-apple-orange",
  purple: "stroke-apple-purple",
  teal: "stroke-apple-teal",
};

export function ProgressRing({
  progress,
  size = 64,
  strokeWidth = 6,
  colorScheme = "blue",
  showLabel = true,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/50"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-700 ease-out", colorClasses[colorScheme])}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-sm font-semibold text-foreground">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}
