import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, Tag, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SourceNameHoverCardProps {
  name: string;
  description?: string;
  createdAt?: Date;
  lastUpdated?: Date;
  owner?: string;
  tags?: string[];
  children: React.ReactNode;
}

export function SourceNameHoverCard({
  name,
  description,
  createdAt,
  lastUpdated,
  owner,
  tags,
  children,
}: SourceNameHoverCardProps) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-80">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">{name}</h4>
            {description && (
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            )}
          </div>

          {/* Separator */}
          <div className="separator-line" />

          {/* Metadata */}
          <div className="space-y-2.5">
            {createdAt && (
              <div className="flex items-center gap-3 text-xs">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Criado em:</span>
                <span className="ml-auto text-foreground">{createdAt.toLocaleDateString("pt-BR")}</span>
              </div>
            )}
            
            {lastUpdated && (
              <div className="flex items-center gap-3 text-xs">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Atualizado:</span>
                <span className="ml-auto text-foreground">{formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
              </div>
            )}
            
            {owner && (
              <div className="flex items-center gap-3 text-xs">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Owner:</span>
                <span className="ml-auto text-foreground font-mono text-[10px]">{owner}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <>
              <div className="separator-line" />
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-3 w-3 text-muted-foreground" />
                {tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-[10px] px-2 py-0.5 bg-secondary/50 border-0"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </>
          )}

          {/* Footer hint */}
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1">
            <span>Clique para detalhes completos</span>
            <ArrowRight className="h-2.5 w-2.5" />
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
