import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, Tag } from "lucide-react";
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
      <HoverCardContent 
        align="start" 
        className="w-80 bg-popover/95 backdrop-blur-md border-border/50"
      >
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-foreground">{name}</h4>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>

          <div className="space-y-2 text-xs">
            {createdAt && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Criado em: {createdAt.toLocaleDateString("pt-BR")}</span>
              </div>
            )}
            
            {lastUpdated && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Última atualização: {formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
              </div>
            )}
            
            {owner && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{owner}</span>
              </div>
            )}
          </div>

          {tags && tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <Tag className="h-3 w-3 text-muted-foreground" />
              {tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-[10px] px-1.5 py-0 bg-secondary/60"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <p className="text-[10px] text-muted-foreground/70 pt-1 border-t border-border/30">
            Clique para ver detalhes completos
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
