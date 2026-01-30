import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { NewsItem, NewsType } from "./NewsCard";
import { FileText, Scale, BookOpen, Calendar, MessageCircle, Heart } from "lucide-react";

interface NewsCompactCardProps {
  item: NewsItem;
  onClick?: () => void;
  className?: string;
}

const typeConfig: Record<NewsType, { label: string; icon: React.ElementType; color: string; dotColor: string }> = {
  acordao: { label: "Acórdão", icon: Scale, color: "text-apple-blue", dotColor: "bg-apple-blue" },
  sumula: { label: "Súmula", icon: BookOpen, color: "text-apple-purple", dotColor: "bg-apple-purple" },
  normativo: { label: "Normativo", icon: FileText, color: "text-apple-green", dotColor: "bg-apple-green" },
  decisao: { label: "Decisão", icon: Scale, color: "text-apple-orange", dotColor: "bg-apple-orange" },
};

const relationConfig: Record<string, { label: string; color: string }> = {
  revoga: { label: "Revoga", color: "text-red-600 dark:text-red-400" },
  altera: { label: "Altera", color: "text-amber-600 dark:text-amber-400" },
  complementa: { label: "Complementa", color: "text-blue-600 dark:text-blue-400" },
};

export function NewsCompactCard({ item, onClick, className }: NewsCompactCardProps) {
  const config = typeConfig[item.type];
  const Icon = config.icon;

  // Mock engagement numbers
  const likes = Math.floor(Math.random() * 50) + 5;
  const comments = Math.floor(Math.random() * 20) + 1;

  return (
    <article
      onClick={onClick}
      className={cn(
        "group relative flex gap-4 p-4 rounded-2xl cursor-pointer",
        "bg-card/50 backdrop-blur-sm border border-border/50",
        "transition-all duration-300 ease-out",
        "hover:bg-card hover:shadow-apple hover:border-border",
        className
      )}
    >
      {/* Timeline dot - Twitter style */}
      <div className="hidden sm:flex flex-col items-center">
        <div className={cn("w-2.5 h-2.5 rounded-full", config.dotColor)} />
        <div className="w-px flex-1 bg-border/50 mt-2" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-1.5">
          <Icon className={cn("h-4 w-4", config.color)} />
          <span className={cn("text-sm font-semibold", config.color)}>{item.number}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{item.date}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-semibold text-foreground leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>

        {/* Summary */}
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
          {item.summary}
        </p>

        {/* Related docs - Comparativo */}
        {item.relatedDocs && item.relatedDocs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {item.relatedDocs.map((doc, idx) => {
              const relConfig = relationConfig[doc.type];
              return (
                <span key={idx} className={cn("text-[10px] font-medium", relConfig.color)}>
                  {relConfig.label} {doc.reference}
                </span>
              );
            })}
          </div>
        )}

        {/* Footer - Areas + Twitter-style engagement */}
        <div className="flex items-center justify-between">
          {/* Areas */}
          <div className="flex flex-wrap gap-1">
            {item.areas?.slice(0, 2).map((area) => (
              <Badge key={area} variant="secondary" className="text-[10px] h-5 rounded-full">
                {area}
              </Badge>
            ))}
          </div>

          {/* Engagement - Twitter style */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <button className="flex items-center gap-1 hover:text-apple-pink transition-colors">
              <Heart className="h-3.5 w-3.5" />
              <span>{likes}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{comments}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail - if has image */}
      {item.imageUrl && (
        <div className="hidden md:block flex-shrink-0">
          <img
            src={item.imageUrl}
            alt=""
            className="w-24 h-24 rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
    </article>
  );
}
