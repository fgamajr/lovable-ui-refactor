import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { NewsItem, NewsType } from "./NewsCard";
import { FileText, Scale, BookOpen, Calendar, Building2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface NewsHeroCardProps {
  item: NewsItem;
  onClick?: () => void;
  className?: string;
}

const typeConfig: Record<NewsType, { label: string; icon: React.ElementType; color: string }> = {
  acordao: { label: "Acórdão", icon: Scale, color: "bg-apple-blue text-white" },
  sumula: { label: "Súmula", icon: BookOpen, color: "bg-apple-purple text-white" },
  normativo: { label: "Normativo", icon: FileText, color: "bg-apple-green text-white" },
  decisao: { label: "Decisão", icon: Scale, color: "bg-apple-orange text-white" },
};

export function NewsHeroCard({ item, onClick, className }: NewsHeroCardProps) {
  const config = typeConfig[item.type];
  const Icon = config.icon;

  return (
    <article
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-3xl cursor-pointer",
        "transition-all duration-500 ease-out",
        "hover:shadow-2xl hover:scale-[1.01]",
        className
      )}
    >
      {/* Background image with gradient overlay */}
      <AspectRatio ratio={16 / 9}>
        <div className="absolute inset-0">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20" />
          )}
          {/* Gradient overlays for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 lg:p-10">
          {/* Badge row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className={cn("gap-1 font-semibold shadow-lg", config.color)}>
              <Icon className="h-3.5 w-3.5" />
              {config.label}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0">
              {item.number}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0">
              DESTAQUE
            </Badge>
          </div>

          {/* Title - NYT style large serif */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white leading-tight mb-3 line-clamp-3 group-hover:underline decoration-2 underline-offset-4">
            {item.title}
          </h2>

          {/* Summary */}
          <p className="text-sm sm:text-base text-white/80 line-clamp-2 mb-4 max-w-3xl">
            {item.summary}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {item.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              {item.organ}
            </span>
            {item.areas && item.areas.length > 0 && (
              <div className="flex gap-1.5">
                {item.areas.slice(0, 2).map((area) => (
                  <span key={area} className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm">
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </AspectRatio>
    </article>
  );
}
