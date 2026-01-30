import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { NewsItem, NewsType } from "./NewsCard";
import { FileText, Scale, BookOpen, Calendar, Building2, Clock } from "lucide-react";

interface NewsFrontPageProps {
  articles: NewsItem[];
  onArticleClick: (article: NewsItem) => void;
  className?: string;
}

const typeConfig: Record<NewsType, { label: string; icon: React.ElementType; color: string }> = {
  acordao: { label: "Acórdão", icon: Scale, color: "text-apple-blue" },
  sumula: { label: "Súmula", icon: BookOpen, color: "text-apple-purple" },
  normativo: { label: "Normativo", icon: FileText, color: "text-apple-green" },
  decisao: { label: "Decisão", icon: Scale, color: "text-apple-orange" },
};

// Small headline item (left column)
function HeadlineItem({ item, onClick }: { item: NewsItem; onClick: () => void }) {
  const config = typeConfig[item.type];
  
  return (
    <article 
      onClick={onClick}
      className="group cursor-pointer py-4 border-b border-border last:border-b-0"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-apple-red text-[10px] font-bold uppercase tracking-wide">AO VIVO</span>
        <span className="text-muted-foreground text-[10px]">5min atrás</span>
      </div>
      <h3 className="font-serif text-base font-bold leading-tight text-foreground group-hover:text-apple-blue transition-colors mb-2">
        {item.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-2">
        {item.summary}
      </p>
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <Clock className="h-3 w-3" />
        5 min de leitura
      </span>
    </article>
  );
}

// Main hero article (center)
function HeroArticle({ item, onClick }: { item: NewsItem; onClick: () => void }) {
  return (
    <article 
      onClick={onClick}
      className="group cursor-pointer"
    >
      {item.imageUrl && (
        <div className="relative overflow-hidden mb-3">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <p className="text-[10px] text-muted-foreground mt-1.5 italic">
            Imagem ilustrativa / TCU
          </p>
        </div>
      )}
      <h2 className="font-serif text-2xl lg:text-3xl font-bold leading-tight text-foreground group-hover:text-apple-blue transition-colors">
        {item.title}
      </h2>
    </article>
  );
}

// Medium article with image (right column)
function MediumArticle({ item, onClick }: { item: NewsItem; onClick: () => void }) {
  return (
    <article 
      onClick={onClick}
      className="group cursor-pointer"
    >
      {item.imageUrl && (
        <div className="relative overflow-hidden mb-2">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <p className="text-[10px] text-muted-foreground mt-1 italic text-right">
            Arquivo / TCU
          </p>
        </div>
      )}
      <h3 className="font-serif text-lg font-bold leading-tight text-foreground group-hover:text-apple-blue transition-colors mb-2">
        {item.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-2">
        {item.summary}
      </p>
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <Clock className="h-3 w-3" />
        6 min de leitura
      </span>
    </article>
  );
}

// Small text-only article
function SmallArticle({ item, onClick }: { item: NewsItem; onClick: () => void }) {
  const config = typeConfig[item.type];
  
  return (
    <article 
      onClick={onClick}
      className="group cursor-pointer py-3 border-b border-border last:border-b-0"
    >
      <Badge variant="outline" className={cn("mb-2 text-[10px]", config.color)}>
        {config.label}
      </Badge>
      <h4 className="font-serif text-sm font-bold leading-tight text-foreground group-hover:text-apple-blue transition-colors">
        {item.title}
      </h4>
    </article>
  );
}

export function NewsFrontPage({ articles, onArticleClick, className }: NewsFrontPageProps) {
  // Distribute articles across the layout
  const heroArticle = articles[0]; // Main center hero
  const leftColumnArticles = articles.slice(1, 3); // 2 articles for left
  const rightMainArticle = articles[3]; // Right column main with image
  const rightSmallArticles = articles.slice(4); // Rest for right column small items

  return (
    <div className={cn("", className)}>
      {/* Main 3-column grid - NYT style */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column - Headlines */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <div className="divide-y divide-border">
            {leftColumnArticles.map((item) => (
              <HeadlineItem 
                key={item.id} 
                item={item} 
                onClick={() => onArticleClick(item)} 
              />
            ))}
          </div>
        </div>

        {/* Center Column - Hero */}
        <div className="lg:col-span-5 order-1 lg:order-2 border-b lg:border-b-0 lg:border-x border-border pb-6 lg:pb-0 lg:px-6">
          {heroArticle && (
            <HeroArticle 
              item={heroArticle} 
              onClick={() => onArticleClick(heroArticle)} 
            />
          )}
        </div>

        {/* Right Column - Mixed */}
        <div className="lg:col-span-4 order-3 space-y-4">
          {rightMainArticle && (
            <MediumArticle 
              item={rightMainArticle} 
              onClick={() => onArticleClick(rightMainArticle)} 
            />
          )}
          
          {rightSmallArticles.length > 0 && (
            <div className="border-t border-border pt-4">
              {rightSmallArticles.map((item) => (
                <SmallArticle 
                  key={item.id} 
                  item={item} 
                  onClick={() => onArticleClick(item)} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
