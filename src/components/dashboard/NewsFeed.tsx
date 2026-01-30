import { useState } from "react";
import { cn } from "@/lib/utils";
import { NewsItem } from "./NewsCard";
import { NewsFilters, FilterState } from "./NewsFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, TrendingUp, Sparkles } from "lucide-react";
import { NewsHeroCard } from "./NewsHeroCard";
import { NewsCompactCard } from "./NewsCompactCard";
import { NewsArticleDialog } from "./NewsArticleDialog";

// Import hero images
import heroImage1 from "@/assets/news-hero-1.jpg";
import heroImage2 from "@/assets/news-hero-2.jpg";
import heroImage3 from "@/assets/news-hero-3.jpg";

// Mock data - substituir por dados reais do seu RAG/Elastic
const mockNews: NewsItem[] = [
  {
    id: "1",
    type: "acordao",
    number: "Acórdão 1234/2024",
    title: "Irregularidades em contratação de serviços de TI sem licitação prévia",
    summary: "O TCU julgou irregular a contratação direta de serviços de tecnologia da informação por órgão federal, determinando a anulação do contrato e a instauração de tomada de contas especial para apuração de responsabilidades.",
    date: "28/01/2024",
    organ: "TCU - Plenário",
    relatedDocs: [
      { type: "altera", reference: "Acórdão 987/2023" },
    ],
    areas: ["Licitações", "TI", "Contratação Direta"],
    imageUrl: heroImage1,
  },
  {
    id: "2",
    type: "sumula",
    number: "Súmula 289",
    title: "Requisitos para dispensa de licitação em situação emergencial",
    summary: "A contratação direta com fundamento em situação emergencial somente é cabível quando caracterizada urgência de atendimento que possa ocasionar prejuízo ou comprometer a segurança de pessoas, obras, serviços ou equipamentos.",
    date: "27/01/2024",
    organ: "TCU",
    areas: ["Licitações", "Emergência"],
    imageUrl: heroImage2,
  },
  {
    id: "3",
    type: "normativo",
    number: "IN TCU 91/2024",
    title: "Atualização das normas sobre fiscalização de obras públicas",
    summary: "Instrução normativa que estabelece novos procedimentos para a fiscalização de obras públicas financiadas com recursos federais, incluindo critérios de amostragem e metodologia de análise.",
    date: "25/01/2024",
    organ: "TCU",
    relatedDocs: [
      { type: "revoga", reference: "IN TCU 72/2020" },
      { type: "complementa", reference: "IN TCU 84/2022" },
    ],
    areas: ["Obras Públicas", "Fiscalização"],
    imageUrl: heroImage3,
  },
  {
    id: "4",
    type: "acordao",
    number: "Acórdão 1198/2024",
    title: "Responsabilidade de gestores em convênios com entidades privadas",
    summary: "Condenação de ex-gestor ao ressarcimento de valores por ausência de comprovação de despesas em convênio celebrado com organização da sociedade civil.",
    date: "24/01/2024",
    organ: "TCU - 1ª Câmara",
    areas: ["Convênios", "Prestação de Contas", "OSC"],
  },
  {
    id: "5",
    type: "decisao",
    number: "Decisão 45/2024",
    title: "Medida cautelar suspende pregão eletrônico",
    summary: "Determinada a suspensão de pregão eletrônico para aquisição de equipamentos médicos devido a indícios de direcionamento nas especificações técnicas do edital.",
    date: "23/01/2024",
    organ: "TCU",
    areas: ["Pregão", "Cautelar", "Saúde"],
  },
  {
    id: "6",
    type: "normativo",
    number: "Resolução 350/2024",
    title: "Novas diretrizes para transparência em contratos administrativos",
    summary: "Estabelece requisitos mínimos de publicidade e transparência para contratos administrativos acima de R$ 1 milhão, incluindo divulgação de aditivos e termos de ajuste.",
    date: "22/01/2024",
    organ: "TCU",
    areas: ["Transparência", "Contratos"],
  },
];

interface NewsFeedProps {
  className?: string;
}

export function NewsFeed({ className }: NewsFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    type: null,
    period: null,
    organ: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  // Simular busca - conectar ao seu backend RAG/Elastic
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Integrar com RAG/Elastic Search
    console.log("Search query:", query);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // TODO: Integrar com backend
    console.log("Filters:", newFilters);
  };

  // Filtrar mock data localmente (substituir por chamada API)
  const filteredNews = mockNews.filter((item) => {
    if (filters.type && item.type !== filters.type) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.number.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Separate hero (first with image) from rest
  const heroArticle = filteredNews.find(item => item.imageUrl);
  const restArticles = filteredNews.filter(item => item.id !== heroArticle?.id);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header - NYT style */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-apple-orange to-apple-pink flex items-center justify-center shadow-apple">
              <Newspaper className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">Novidades da Semana</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Curadoria inteligente de acórdãos, súmulas e normas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-apple-green" />
            <span>{filteredNews.length} publicações encontradas</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <NewsFilters onSearch={handleSearch} onFilterChange={handleFilterChange} />

      {/* Editorial Feed */}
      {isLoading ? (
        // Loading skeletons
        <div className="space-y-4">
          <Skeleton className="w-full h-64 rounded-3xl" />
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-card/50">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <Skeleton className="w-24 h-24 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="space-y-6">
          {/* Hero Article - NYT style */}
          {heroArticle && (
            <NewsHeroCard 
              item={heroArticle} 
              onClick={() => setSelectedArticle(heroArticle)}
            />
          )}

          {/* Secondary articles grid */}
          {restArticles.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Mais publicações
              </h3>
              <div className="grid gap-3">
                {restArticles.map((item) => (
                  <NewsCompactCard
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedArticle(item)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Empty state
        <div className="glass rounded-2xl p-8 text-center">
          <Newspaper className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-sm font-medium text-foreground mb-1">
            Nenhum resultado encontrado
          </h3>
          <p className="text-xs text-muted-foreground">
            Tente ajustar os filtros ou termos de busca
          </p>
        </div>
      )}

      {/* Article Dialog */}
      <NewsArticleDialog
        item={selectedArticle}
        open={!!selectedArticle}
        onOpenChange={(open) => !open && setSelectedArticle(null)}
      />
    </div>
  );
}
