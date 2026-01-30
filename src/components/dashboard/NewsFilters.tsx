import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NewsFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export interface FilterState {
  type: string | null;
  period: string | null;
  organ: string | null;
}

const typeOptions = [
  { value: "acordao", label: "Acórdãos" },
  { value: "sumula", label: "Súmulas" },
  { value: "normativo", label: "Normativos" },
  { value: "decisao", label: "Decisões" },
];

const periodOptions = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 3 meses" },
  { value: "1y", label: "Último ano" },
];

const organOptions = [
  { value: "tcu", label: "TCU" },
  { value: "cgu", label: "CGU" },
  { value: "stf", label: "STF" },
];

export function NewsFilters({ onSearch, onFilterChange, className }: NewsFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    type: null,
    period: null,
    organ: null,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const updateFilter = (key: keyof FilterState, value: string | null) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const cleared: FilterState = { type: null, period: null, organ: null };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número, assunto ou palavra-chave..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 h-11 rounded-xl bg-background/80 border-border/50 focus:border-primary transition-apple"
          />
        </div>
        
        {/* Mobile filter toggle */}
        <Popover open={showMobileFilters} onOpenChange={setShowMobileFilters}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden h-11 w-11 rounded-xl relative"
            >
              <Filter className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4 rounded-xl" align="end">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Filtros</span>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                    Limpar
                  </Button>
                )}
              </div>
              <Select value={filters.type || ""} onValueChange={(v) => updateFilter("type", v || null)}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.period || ""} onValueChange={(v) => updateFilter("period", v || null)}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.organ || ""} onValueChange={(v) => updateFilter("organ", v || null)}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Órgão" />
                </SelectTrigger>
                <SelectContent>
                  {organOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Desktop filters */}
      <div className="hidden lg:flex items-center gap-2 flex-wrap">
        <Select value={filters.type || ""} onValueChange={(v) => updateFilter("type", v || null)}>
          <SelectTrigger className="w-[150px] h-9 rounded-lg text-sm">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.period || ""} onValueChange={(v) => updateFilter("period", v || null)}>
          <SelectTrigger className="w-[160px] h-9 rounded-lg text-sm">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.organ || ""} onValueChange={(v) => updateFilter("organ", v || null)}>
          <SelectTrigger className="w-[120px] h-9 rounded-lg text-sm">
            <SelectValue placeholder="Órgão" />
          </SelectTrigger>
          <SelectContent>
            {organOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Active filters badges (mobile) */}
      {activeFiltersCount > 0 && (
        <div className="flex lg:hidden flex-wrap gap-1.5">
          {filters.type && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {typeOptions.find((t) => t.value === filters.type)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("type", null)} />
            </Badge>
          )}
          {filters.period && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {periodOptions.find((t) => t.value === filters.period)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("period", null)} />
            </Badge>
          )}
          {filters.organ && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {organOptions.find((t) => t.value === filters.organ)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("organ", null)} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
