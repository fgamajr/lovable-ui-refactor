import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Database, FileText, Globe, FileJson, Server, HardDrive, Languages, Gauge, Clock, Link, ShieldCheck } from "lucide-react";

type SourceType = "pdf" | "database" | "website" | "api";

interface TypeConfig {
  // Database
  dbType?: string;
  host?: string;
  schema?: string;
  tablesMonitored?: number;
  refreshRate?: string;
  
  // PDF
  storage?: string;
  formats?: string[];
  ocrEnabled?: boolean;
  languages?: string[];
  avgFileSize?: string;
  
  // API
  endpoint?: string;
  method?: string;
  authType?: string;
  rateLimit?: string;
  lastHealthCheck?: string;
  responseTime?: number;
  
  // Website
  baseUrl?: string;
  crawlDepth?: number;
  pagesDiscovered?: number;
  respectRobots?: boolean;
  lastCrawl?: string;
}

interface SourceTypeHoverCardProps {
  type: SourceType;
  config?: TypeConfig;
  children: React.ReactNode;
}

const typeInfo: Record<SourceType, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  pdf: { label: "PDF Documents", icon: FileText },
  database: { label: "Database", icon: Database },
  website: { label: "Web Crawler", icon: Globe },
  api: { label: "REST API", icon: FileJson },
};

function DatabaseContent({ config }: { config?: TypeConfig }) {
  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Server className="h-3 w-3 flex-shrink-0" />
        <span>Conexão: {config?.dbType || "PostgreSQL"}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Link className="h-3 w-3 flex-shrink-0" />
        <span className="truncate">Host: {config?.host || "db.empresa.com:5432"}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <HardDrive className="h-3 w-3 flex-shrink-0" />
        <span>Schema: {config?.schema || "public"}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Database className="h-3 w-3 flex-shrink-0" />
        <span>Tabelas monitoradas: {config?.tablesMonitored || 12}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="h-3 w-3 flex-shrink-0" />
        <span>Refresh rate: {config?.refreshRate || "a cada 15 min"}</span>
      </div>
    </div>
  );
}

function PDFContent({ config }: { config?: TypeConfig }) {
  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center gap-2 text-muted-foreground">
        <HardDrive className="h-3 w-3 flex-shrink-0" />
        <span>Storage: {config?.storage || "S3 bucket (docs-bucket)"}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <FileText className="h-3 w-3 flex-shrink-0" />
        <span>Formatos: {config?.formats?.join(", ") || ".pdf, .docx"}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Gauge className="h-3 w-3 flex-shrink-0" />
        <span>OCR habilitado: {config?.ocrEnabled !== false ? "Sim" : "Não"}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Languages className="h-3 w-3 flex-shrink-0" />
        <span>Idiomas: {config?.languages?.join(", ") || "PT, EN"}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <HardDrive className="h-3 w-3 flex-shrink-0" />
        <span>Tamanho médio: {config?.avgFileSize || "2.4 MB"}</span>
      </div>
    </div>
  );
}

function APIContent({ config }: { config?: TypeConfig }) {
  const isHealthy = config?.responseTime ? config.responseTime < 500 : true;
  
  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Link className="h-3 w-3 flex-shrink-0" />
        <span className="truncate">Endpoint: {config?.endpoint || "api.tribunal.gov.br/v2"}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <FileJson className="h-3 w-3 flex-shrink-0" />
        <span>Método: {config?.method || "GET com paginação"}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <ShieldCheck className="h-3 w-3 flex-shrink-0" />
        <span>Auth: {config?.authType || "Bearer Token (válido)"}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Gauge className="h-3 w-3 flex-shrink-0" />
        <span>Rate limit: {config?.rateLimit || "100 req/min"}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
        <span className={isHealthy ? "text-apple-green" : "text-apple-orange"}>
          Health check: {isHealthy ? "OK" : "Lento"} ({config?.responseTime || 142}ms)
        </span>
      </div>
    </div>
  );
}

function WebsiteContent({ config }: { config?: TypeConfig }) {
  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Link className="h-3 w-3 flex-shrink-0" />
        <span className="truncate">URL base: {config?.baseUrl || "docs.empresa.com"}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Globe className="h-3 w-3 flex-shrink-0" />
        <span>Profundidade: {config?.crawlDepth || 3} níveis</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <FileText className="h-3 w-3 flex-shrink-0" />
        <span>Páginas descobertas: {config?.pagesDiscovered || 523}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <ShieldCheck className="h-3 w-3 flex-shrink-0" />
        <span>Robots.txt: {config?.respectRobots !== false ? "Respeitado" : "Ignorado"}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="h-3 w-3 flex-shrink-0" />
        <span>Último crawl: {config?.lastCrawl || "1h atrás"}</span>
      </div>
    </div>
  );
}

export function SourceTypeHoverCard({ type, config, children }: SourceTypeHoverCardProps) {
  const { label, icon: Icon } = typeInfo[type];

  const contentMap: Record<SourceType, React.ReactNode> = {
    database: <DatabaseContent config={config} />,
    pdf: <PDFContent config={config} />,
    api: <APIContent config={config} />,
    website: <WebsiteContent config={config} />,
  };

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-72">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">Tipo: {label}</h4>
          </div>

          {/* Separator */}
          <div className="separator-line" />

          {/* Content */}
          {contentMap[type]}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
