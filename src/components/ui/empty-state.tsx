import { cn } from "@/lib/utils";
import { LucideIcon, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  variant?: "default" | "compact";
}

export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  actionLabel,
  onAction,
  className,
  variant = "default",
}: EmptyStateProps) {
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-6 px-4 text-center",
          className
        )}
      >
        <div className="p-2 rounded-lg bg-muted mb-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{title}</p>
        {actionLabel && onAction && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 mt-1 text-xs"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6 text-center",
        className
      )}
    >
      <div className="p-4 rounded-2xl bg-muted/50 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
