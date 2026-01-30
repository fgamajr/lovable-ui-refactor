import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NewsItem, NewsType } from "./NewsCard";
import { FileText, Scale, BookOpen, Calendar, Building2, ExternalLink, Share2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NewsArticleDialogProps {
  item: NewsItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

// Mock full content - will be replaced by AI-generated content from your backend
const mockFullContent = `
## Resumo Executivo

O presente acórdão analisa irregularidades identificadas em processo de contratação direta de serviços de tecnologia da informação por órgão da administração pública federal, em afronta aos princípios da legalidade, impessoalidade e eficiência previstos no art. 37 da Constituição Federal.

## Contexto e Antecedentes

A fiscalização teve origem em denúncia anônima recebida pela Ouvidoria do TCU, que apontava possíveis irregularidades na contratação de empresa para prestação de serviços de desenvolvimento de software. Após análise preliminar, a unidade técnica competente identificou indícios de:

- **Ausência de planejamento adequado**: Não foram localizados os estudos técnicos preliminares exigidos pela IN SGD/ME nº 1/2019;
- **Fracionamento de despesa**: Identificou-se a divisão artificial do objeto em múltiplos contratos de menor valor;
- **Direcionamento do certame**: Especificações técnicas excessivamente restritivas que limitavam a competitividade.

## Análise Técnica

O Ministro Relator, em seu voto, destacou que a contratação direta sem licitação prévia somente é admitida nas hipóteses taxativamente previstas nos arts. 74 e 75 da Lei nº 14.133/2021, não sendo o caso em análise.

### Fundamentação Legal

> "A dispensa ou inexigibilidade de licitação deve estar devidamente caracterizada e justificada no processo administrativo, não bastando a mera alegação de urgência ou de singularidade do objeto."

O acórdão cita precedentes relevantes:
- Acórdão 1.923/2023-Plenário
- Acórdão 2.156/2022-Plenário
- Acórdão 987/2023-Primeira Câmara

## Determinações

O Tribunal determinou ao órgão fiscalizado:

1. **Anular o contrato** firmado irregularmente, no prazo de 30 dias;
2. **Instaurar tomada de contas especial** para apuração de eventual dano ao erário;
3. **Apurar a responsabilidade** dos agentes públicos envolvidos;
4. **Apresentar plano de ação** para regularização das contratações de TI.

## Impacto e Relevância

Esta decisão reforça a jurisprudência consolidada do TCU sobre a necessidade de observância estrita dos procedimentos licitatórios, especialmente em contratações de tecnologia da informação, área que tem sido objeto de fiscalizações intensificadas nos últimos anos.

### Áreas Afetadas
- Gestores de TI de órgãos públicos
- Áreas de licitações e contratos
- Controles internos das entidades federais
`;

export function NewsArticleDialog({ item, open, onOpenChange }: NewsArticleDialogProps) {
  if (!item) return null;

  const config = typeConfig[item.type];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Hero Image */}
        {item.imageUrl && (
          <div className="relative h-48 sm:h-64 w-full overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          </div>
        )}

        <ScrollArea className="flex-1 h-full max-h-[calc(90vh-16rem)]">
          <div className="p-6 sm:p-8">
            {/* Header */}
            <DialogHeader className="space-y-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={cn("gap-1 font-medium", config.color)}>
                  <Icon className="h-3 w-3" />
                  {config.label}
                </Badge>
                <span className="text-sm font-semibold text-foreground">{item.number}</span>
              </div>

              <DialogTitle className="text-2xl sm:text-3xl font-serif font-bold leading-tight text-foreground">
                {item.title}
              </DialogTitle>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {item.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  {item.organ}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Bookmark className="h-4 w-4" />
                  Salvar
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ExternalLink className="h-4 w-4" />
                  Ver Original
                </Button>
              </div>
            </DialogHeader>

            <Separator className="mb-6" />

            {/* Related docs (Comparativo) */}
            {item.relatedDocs && item.relatedDocs.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-muted/50">
                <h4 className="text-sm font-semibold text-foreground mb-3">📋 Documentos Relacionados</h4>
                <div className="flex flex-wrap gap-2">
                  {item.relatedDocs.map((doc, idx) => {
                    const relConfig = relationConfig[doc.type];
                    return (
                      <Badge key={idx} variant="outline" className={cn("gap-1", relConfig.color)}>
                        {relConfig.label}: {doc.reference}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Lead paragraph */}
            <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-serif italic">
              {item.summary}
            </p>

            {/* Full article content - markdown rendered */}
            <article className="prose prose-sm sm:prose dark:prose-invert max-w-none">
              {item.fullContent ? (
                <div dangerouslySetInnerHTML={{ __html: item.fullContent }} />
              ) : (
                <div className="space-y-4 text-foreground">
                  {mockFullContent.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('## ')) {
                      return <h2 key={idx} className="text-xl font-bold mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                    }
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={idx} className="text-lg font-semibold mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
                    }
                    if (paragraph.startsWith('> ')) {
                      return (
                        <blockquote key={idx} className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                          {paragraph.replace('> ', '')}
                        </blockquote>
                      );
                    }
                    if (paragraph.startsWith('- ')) {
                      return (
                        <ul key={idx} className="list-disc pl-6 space-y-2">
                          {paragraph.split('\n').map((li, liIdx) => (
                            <li key={liIdx} className="text-foreground">{li.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (paragraph.match(/^\d\./)) {
                      return (
                        <ol key={idx} className="list-decimal pl-6 space-y-2">
                          {paragraph.split('\n').map((li, liIdx) => (
                            <li key={liIdx} className="text-foreground">{li.replace(/^\d\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>
                          ))}
                        </ol>
                      );
                    }
                    return <p key={idx} className="leading-relaxed">{paragraph}</p>;
                  })}
                </div>
              )}
            </article>

            {/* Areas/Tags */}
            {item.areas && item.areas.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Áreas Relacionadas</h4>
                <div className="flex flex-wrap gap-2">
                  {item.areas.map((area) => (
                    <Badge key={area} variant="secondary" className="rounded-full">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
