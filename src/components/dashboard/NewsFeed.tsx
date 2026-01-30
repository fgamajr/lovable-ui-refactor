import { useState } from "react";
import { cn } from "@/lib/utils";
import { NewsCard, NewsItem } from "./NewsCard";
import { NewsFilters, FilterState } from "./NewsFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, TrendingUp } from "lucide-react";

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

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-apple-orange to-apple-pink flex items-center justify-center shadow-apple">
            <Newspaper className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Novidades da Semana</h2>
            <p className="text-xs text-muted-foreground">Acórdãos, súmulas e normas recentes</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5 text-apple-green" />
          <span>{filteredNews.length} publicações encontradas</span>
        </div>
      </div>

      {/* Filters & Search */}
      <NewsFilters onSearch={handleSearch} onFilterChange={handleFilterChange} />

      {/* Timeline Feed */}
      <div className="relative">
        {/* Timeline line (desktop only) */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border hidden lg:block ml-3" />

        {/* News items */}
        <div className="space-y-4 lg:pl-10">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-12 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
              </div>
            ))
          ) : filteredNews.length > 0 ? (
            filteredNews.map((item) => <NewsCard key={item.id} item={item} />)
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
        </div>
      </div>
    </div>
  );
}
