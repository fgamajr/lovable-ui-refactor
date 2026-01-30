import { Bell, Sun, Moon, Search, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  className?: string;
  connectionStatus?: "connected" | "reconnecting" | "disconnected";
}

const connectionConfig = {
  connected: {
    icon: Wifi,
    color: "text-apple-green",
    label: "Connected",
  },
  reconnecting: {
    icon: Wifi,
    color: "text-apple-orange animate-pulse",
    label: "Reconnecting...",
  },
  disconnected: {
    icon: WifiOff,
    color: "text-apple-red",
    label: "Offline",
  },
};

export function DashboardHeader({ className, connectionStatus = "connected" }: DashboardHeaderProps) {
  const { toggleTheme, isDark } = useTheme();
  const connConfig = connectionConfig[connectionStatus];
  const ConnIcon = connConfig.icon;

  return (
    <TooltipProvider delayDuration={200}>
      <header
        className={cn(
          "flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-border/50",
          "bg-background/80 backdrop-blur-xl sticky top-0 z-10",
          className
        )}
      >
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            Monitor your RAG pipeline and data sources
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Connection Status Indicator */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/50">
                <ConnIcon className={cn("h-3.5 w-3.5", connConfig.color)} />
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {connConfig.label}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Real-time connection: {connConfig.label}</p>
            </TooltipContent>
          </Tooltip>

          {/* Search - hidden on mobile, shown on sm+ */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-48 lg:w-64 pl-9 h-9 bg-secondary/50 border-border/50 focus:bg-background transition-apple"
            />
          </div>

          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden h-9 w-9 text-muted-foreground hover:text-foreground transition-apple"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 text-muted-foreground hover:text-foreground transition-apple"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-apple-red rounded-full" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground transition-apple"
                onClick={toggleTheme}
              >
                {isDark ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDark ? "Switch to light mode" : "Switch to dark mode"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-apple-purple flex items-center justify-center text-xs font-semibold text-primary-foreground shadow-apple flex-shrink-0">
            JD
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
