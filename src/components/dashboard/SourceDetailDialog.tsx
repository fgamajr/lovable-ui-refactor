import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Database,
  Globe,
  FileJson,
  Settings,
  RefreshCcw,
  Pause,
  Trash2,
  Clock,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

type SourceType = "pdf" | "database" | "website" | "api";

interface SyncHistoryItem {
  id: string;
  date: Date;
  status: "success" | "partial" | "failed";
  docsProcessed: number;
  duration: string;
  errors?: number;
}

interface SourceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: {
    id: string;
    name: string;
    type: SourceType;
    documents: number;
    description?: string;
    createdAt?: Date;
    lastUpdated?: Date;
    owner?: string;
    tags?: string[];
    discovery: number;
    sync: number;
    processing: number;
    indexing: number;
    embedding: number;
  };
}

const typeIcons = {
  pdf: FileText,
  database: Database,
  website: Globe,
  api: FileJson,
};

const typeLabels = {
  pdf: "PDF Documents",
  database: "Database",
  website: "Web Crawler",
  api: "REST API",
};

// Mock sync history
const mockSyncHistory: SyncHistoryItem[] = [
  { id: "1", date: new Date(Date.now() - 2 * 60 * 60 * 1000), status: "success", docsProcessed: 1247, duration: "4m 32s" },
  { id: "2", date: new Date(Date.now() - 26 * 60 * 60 * 1000), status: "success", docsProcessed: 1198, duration: "4m 18s" },
  { id: "3", date: new Date(Date.now() - 50 * 60 * 60 * 1000), status: "partial", docsProcessed: 1156, duration: "5m 02s", errors: 3 },
  { id: "4", date: new Date(Date.now() - 74 * 60 * 60 * 1000), status: "success", docsProcessed: 1089, duration: "3m 56s" },
  { id: "5", date: new Date(Date.now() - 98 * 60 * 60 * 1000), status: "failed", docsProcessed: 0, duration: "0m 12s", errors: 1 },
];

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return "Agora mesmo";
  if (diffHours < 24) return `${diffHours}h atrás`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Ontem";
  return `${diffDays} dias atrás`;
}

export function SourceDetailDialog({ open, onOpenChange, source }: SourceDetailDialogProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const Icon = typeIcons[source.type];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const overallProgress = Math.round(
    (source.discovery + source.sync + source.processing + source.indexing + source.embedding) / 5
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl glass-inset">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg">{source.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1.5">
                  <Badge variant="secondary" className="text-xs">
                    {typeLabels[source.type]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {source.documents.toLocaleString()} documentos
                  </span>
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="config">Configuração</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-5">
            {/* Meta info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Criado: {source.createdAt?.toLocaleDateString("pt-BR") || "15/01/2024"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Atualizado: {source.lastUpdated ? formatRelativeDate(source.lastUpdated) : "2h atrás"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="font-mono text-xs">{source.owner || "equipe-docs@empresa.com"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-apple-green animate-pulse-dot" />
                <span className="text-apple-green text-sm font-medium">Ativo</span>
              </div>
            </div>

            {/* Tags */}
            {(source.tags || ["manual", "produto", "v2.0"]).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(source.tags || ["manual", "produto", "v2.0"]).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs rounded-lg">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Pipeline progress */}
            <div className="space-y-4 p-5 rounded-2xl glass-inset">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progresso do Pipeline</span>
                <span className="text-sm font-semibold text-primary">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2.5" />
              
              <div className="separator-line" />
              
              <div className="grid grid-cols-5 gap-3 pt-1">
                {[
                  { label: "Discovery", value: source.discovery, color: "bg-apple-blue" },
                  { label: "Sync", value: source.sync, color: "bg-apple-green" },
                  { label: "Processing", value: source.processing, color: "bg-apple-orange" },
                  { label: "Indexing", value: source.indexing, color: "bg-apple-purple" },
                  { label: "Embedding", value: source.embedding, color: "bg-apple-teal" },
                ].map((stage) => (
                  <div key={stage.label} className="text-center">
                    <div 
                      className={`h-2 rounded-full ${stage.color} mb-2`} 
                      style={{ opacity: 0.3 + (stage.value / 100) * 0.7 }} 
                    />
                    <span className="text-[10px] text-muted-foreground block">{stage.label}</span>
                    <div className="text-xs font-semibold mt-0.5">{stage.value}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button onClick={handleSync} disabled={isSyncing} className="flex-1">
                <RefreshCcw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Sincronizando..." : "Sync Agora"}
              </Button>
              <Button variant="secondary" size="icon">
                <Pause className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Últimas 10 sincronizações</p>
              
              {mockSyncHistory.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl glass-inset transition-all hover:shadow-apple-sm"
                >
                  <div className="flex items-center gap-3">
                    {item.status === "success" && (
                      <div className="p-1.5 rounded-lg bg-apple-green/10">
                        <CheckCircle className="h-4 w-4 text-apple-green" />
                      </div>
                    )}
                    {item.status === "partial" && (
                      <div className="p-1.5 rounded-lg bg-apple-orange/10">
                        <AlertCircle className="h-4 w-4 text-apple-orange" />
                      </div>
                    )}
                    {item.status === "failed" && (
                      <div className="p-1.5 rounded-lg bg-destructive/10">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {item.status === "success" && "Sync completo"}
                        {item.status === "partial" && `Sync parcial (${item.errors} erros)`}
                        {item.status === "failed" && "Sync falhou"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatRelativeDate(item.date)} • {item.duration}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">{item.docsProcessed.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">docs</p>
                  </div>
                </div>
              ))}
              
              <Button variant="ghost" className="w-full mt-2 text-sm gap-2">
                Ver histórico completo
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="config">
            <div className="space-y-4">
              <div className="p-5 rounded-2xl glass-inset space-y-4">
                <h4 className="text-sm font-semibold">Conexão</h4>
                
                {source.type === "database" && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="font-medium">PostgreSQL</span>
                    </div>
                    <div className="separator-line" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Host:</span>
                      <span className="font-mono text-xs bg-secondary/50 px-2 py-1 rounded-lg">db.empresa.com:5432</span>
                    </div>
                    <div className="separator-line" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Schema:</span>
                      <span className="font-medium">public</span>
                    </div>
                    <div className="separator-line" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Credenciais:</span>
                      <span className="text-muted-foreground">••••••••</span>
                    </div>
                  </div>
                )}

                {source.type === "pdf" && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Storage:</span>
                      <span className="font-medium">S3 bucket</span>
                    </div>
                    <div className="separator-line" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Bucket:</span>
                      <span className="font-mono text-xs bg-secondary/50 px-2 py-1 rounded-lg">docs-bucket</span>
                    </div>
                    <div className="separator-line" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">OCR:</span>
                      <span className="text-apple-green font-medium">Habilitado</span>
                    </div>
                  </div>
                )}

                {source.type === "api" && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Endpoint:</span>
                      <span className="font-mono text-xs bg-secondary/50 px-2 py-1 rounded-lg truncate max-w-[200px]">api.tribunal.gov.br/v2</span>
                    </div>
                    <div className="separator-line" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Auth:</span>
                      <span className="font-medium">Bearer Token</span>
                    </div>
                    <div className="separator-line" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Rate Limit:</span>
                      <span className="font-medium">100 req/min</span>
                    </div>
                  </div>
                )}

                {source.type === "website" && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">URL Base:</span>
                      <span className="font-mono text-xs bg-secondary/50 px-2 py-1 rounded-lg">docs.empresa.com</span>
                    </div>
                    <div className="separator-line" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Profundidade:</span>
                      <span className="font-medium">3 níveis</span>
                    </div>
                    <div className="separator-line" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Robots.txt:</span>
                      <span className="text-apple-green font-medium">Respeitado</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 rounded-2xl glass-inset space-y-4">
                <h4 className="text-sm font-semibold">Agendamento</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Frequência:</span>
                    <span className="font-medium">A cada 15 minutos</span>
                  </div>
                  <div className="separator-line" />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Próximo sync:</span>
                    <span className="text-primary font-medium">em 8 min</span>
                  </div>
                  <div className="separator-line" />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Timeout:</span>
                    <span className="font-medium">30 segundos</span>
                  </div>
                </div>
              </div>

              <Button variant="secondary" className="w-full gap-2">
                <Settings className="h-4 w-4" />
                Editar Configurações
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
