import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FileText, Scale, BookOpen, ArrowRight, Calendar, Building2 } from "lucide-react";

export type NewsType = "acordao" | "sumula" | "normativo" | "decisao";

export interface NewsItem {
  id: string;
  type: NewsType;
  number: string;
  title: string;
  summary: string;
  date: string;
  organ: string;
  relevanceScore?: number;
  relatedDocs?: {
    type: "revoga" | "altera" | "complementa";
    reference: string;
  }[];
  areas?: string[];
  imageUrl?: string;
  fullContent?: string;
}

interface NewsCardProps {
  item: NewsItem;
  className?: string;
}

const typeConfig: Record<NewsType, { label: string; icon: React.ElementType; color: string }> = {
  acordao: { label: "Acórdão", icon: Scale, color: "bg-apple-blue/10 text-apple-blue" },
  sumula: { label: "Súmula", icon: BookOpen, color: "bg-apple-purple/10 text-apple-purple" },
  normativo: { label: "Normativo", icon: FileText, color: "bg-apple-green/10 text-apple-green" },
  decisao: { label: "Decisão", icon: Scale, color: "bg-apple-orange/10 text-apple-orange" },
};

const relationConfig: Record<string, { label: string; color: string }> = {
  revoga: { label: "Revoga", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  altera: { label: "Altera", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  complementa: { label: "Complementa", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
};

export function NewsCard({ item, className }: NewsCardProps) {
  const config = typeConfig[item.type];
  const Icon = config.icon;

  return (
    <article
      className={cn(
        "group relative glass rounded-2xl p-4 sm:p-5 transition-apple",
        "hover:shadow-apple hover:scale-[1.01] cursor-pointer",
        "border border-border/50",
        className
      )}
    >
      {/* Timeline dot */}
      <div className="absolute -left-[25px] top-6 hidden lg:block">
        <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Badge className={cn("gap-1 font-medium", config.color)}>
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
          <span className="text-sm font-semibold text-foreground">{item.number}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {item.date}
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {item.organ}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {item.title}
      </h3>

      {/* Summary */}
      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-3">
        {item.summary}
      </p>

      {/* Related docs (Comparativo) */}
      {item.relatedDocs && item.relatedDocs.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {item.relatedDocs.map((doc, idx) => {
            const relConfig = relationConfig[doc.type];
            return (
              <Badge key={idx} variant="outline" className={cn("text-[10px] gap-1", relConfig.color)}>
                {relConfig.label}: {doc.reference}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Areas/Tags */}
      {item.areas && item.areas.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.areas.slice(0, 3).map((area) => (
            <span
              key={area}
              className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
            >
              {area}
            </span>
          ))}
          {item.areas.length > 3 && (
            <span className="text-[10px] text-muted-foreground">+{item.areas.length - 3}</span>
          )}
        </div>
      )}

      {/* Hover arrow */}
      <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-apple" />
    </article>
  );
}
