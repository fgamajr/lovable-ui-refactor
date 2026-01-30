import { Bell, Sun, Moon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  className?: string;
}

export function DashboardHeader({ className }: DashboardHeaderProps) {
  return (
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
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground transition-apple"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-apple-red rounded-full" />
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground transition-apple"
        >
          <Sun className="h-4 w-4" />
        </Button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-apple-purple flex items-center justify-center text-xs font-semibold text-primary-foreground shadow-apple flex-shrink-0">
          JD
        </div>
      </div>
    </header>
  );
}
