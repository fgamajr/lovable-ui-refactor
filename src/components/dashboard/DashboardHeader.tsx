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
        "flex items-center justify-between px-6 py-4 border-b border-border/50",
        "bg-background/80 backdrop-blur-xl sticky top-0 z-10",
        className
      )}
    >
      <div>
        <h1 className="text-xl font-semibold text-foreground tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor your RAG pipeline and data sources
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 pl-9 h-9 bg-secondary/50 border-border/50 focus:bg-background transition-apple"
          />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground transition-apple"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-apple-red rounded-full" />
        </Button>

        {/* Theme toggle placeholder */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground transition-apple"
        >
          <Sun className="h-4 w-4" />
        </Button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-apple-purple flex items-center justify-center text-xs font-semibold text-primary-foreground shadow-apple">
          JD
        </div>
      </div>
    </header>
  );
}
