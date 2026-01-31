import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Search, RefreshCcw, Cog, Database, Sparkles,
  FileText, Clock, AlertCircle, Zap, HardDrive,
  ExternalLink, RotateCcw
} from "lucide-react";

type PipelineStage = "discovery" | "sync" | "processing" | "indexing" | "embedding";

interface StageDetails {
  // Discovery
  filesFound?: number;
  newSinceLastScan?: number;
  removed?: number;
  nextScan?: string;
  scanDuration?: string;
  scanMethod?: string;
  
  // Sync
  synced?: number;
  pending?: number;
  speed?: string;
  eta?: string;
  errors?: Array<{ file: string; reason: string }>;
  
  // Processing
  processed?: number;
  inProgress?: number;
  queued?: number;
  ocrApplied?: number;
  avgChunksPerDoc?: number;
  parseErrors?: number;
  
  // Indexing
  indexed?: number;
  chunksIndexed?: number;
  indexName?: string;
  bulkRate?: string;
  avgBatchTime?: string;
  indexSize?: string;
  clusterHealth?: "green" | "yellow" | "red";
  
  // Embedding
  embedded?: number;
  totalChunks?: number;
  model?: string;
  dimensions?: number;
  rate?: string;
  estimatedCost?: string;
  vectorDb?: string;
  vectorDbSize?: string;
}

interface PipelineStageHoverCardProps {
  stage: PipelineStage;
  progress: number;
  totalDocs: number;
  details?: StageDetails;
  children: React.ReactNode;
}

const stageInfo: Record<PipelineStage, { 
  label: string; 
  description: string; 
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = {
  discovery: {
    label: "Discovery",
    description: "Identificação de novos documentos no source original",
    icon: Search,
    color: "text-apple-blue",
  },
  sync: {
    label: "Sync",
    description: "Download dos arquivos para armazenamento local",
    icon: RefreshCcw,
    color: "text-apple-green",
  },
  processing: {
    label: "Processing",
    description: "Extração de texto, parsing, limpeza e chunking",
    icon: Cog,
    color: "text-apple-orange",
  },
  indexing: {
    label: "Indexing",
    description: "Inserção no Elasticsearch para busca full-text",
    icon: Database,
    color: "text-apple-purple",
  },
  embedding: {
    label: "Embedding",
    description: "Geração de vetores para busca semântica (RAG)",
    icon: Sparkles,
    color: "text-apple-teal",
  },
};

function DiscoveryContent({ details, totalDocs }: { details?: StageDetails; totalDocs: number }) {
  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <FileText className="h-3 w-3" />
          <span>Arquivos encontrados:</span>
        </div>
        <span className="tabular-nums">{(details?.filesFound || totalDocs).toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Novos desde último scan:</span>
        <span className="text-apple-green tabular-nums">+{details?.newSinceLastScan || 23}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Removidos/movidos:</span>
        <span className="text-destructive tabular-nums">-{details?.removed || 5}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Próximo scan:</span>
        </div>
        <span>{details?.nextScan || "em 14 min"}</span>
      </div>
      <div className="border-t border-border/30 pt-2 mt-2 space-y-1.5">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Método:</span>
          <span className="text-foreground">{details?.scanMethod || "Listagem S3 + delta compare"}</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Tempo do último scan:</span>
          <span className="text-foreground">{details?.scanDuration || "12s"}</span>
        </div>
      </div>
    </div>
  );
}

function SyncContent({ details, totalDocs, progress }: { details?: StageDetails; totalDocs: number; progress: number }) {
  const synced = details?.synced || Math.floor(totalDocs * (progress / 100));
  const pending = details?.pending || totalDocs - synced;
  const errors = details?.errors || [];

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Sincronizados:</span>
        <span className="tabular-nums">{synced.toLocaleString()} / {totalDocs.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Pendentes:</span>
        <span className="tabular-nums">{pending.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Zap className="h-3 w-3" />
          <span>Velocidade:</span>
        </div>
        <span>{details?.speed || "12.5 MB/s"}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>ETA:</span>
        </div>
        <span>{details?.eta || "~8 minutos"}</span>
      </div>
      
      {errors.length > 0 && (
        <div className="border-t border-border/30 pt-2 mt-2 space-y-1.5">
          <div className="flex items-center gap-1.5 text-destructive">
            <AlertCircle className="h-3 w-3" />
            <span>Erros de sync: {errors.length}</span>
          </div>
          {errors.slice(0, 2).map((err, i) => (
            <div key={i} className="text-muted-foreground pl-4 text-[10px]">
              - {err.file} ({err.reason})
            </div>
          ))}
          <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 w-full mt-1">
            <RotateCcw className="h-2.5 w-2.5" />
            Retry erros
          </Button>
        </div>
      )}
    </div>
  );
}

function ProcessingContent({ details, totalDocs, progress }: { details?: StageDetails; totalDocs: number; progress: number }) {
  const processed = details?.processed || Math.floor(totalDocs * (progress / 100));

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Processados:</span>
        <span className="tabular-nums">{processed.toLocaleString()} / {totalDocs.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Em processamento agora:</span>
        <span className="tabular-nums">{details?.inProgress || 12}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Na fila:</span>
        <span className="tabular-nums">{details?.queued || (totalDocs - processed - 12)}</span>
      </div>
      
      <div className="border-t border-border/30 pt-2 mt-2 space-y-1.5">
        <p className="text-muted-foreground font-medium">Breakdown por etapa:</p>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Extração texto:</span>
          <span>{(processed + 120).toLocaleString()} OK</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">OCR aplicado:</span>
          <span>{details?.ocrApplied || 342} docs</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Chunking:</span>
          <span>{processed.toLocaleString()} (avg {details?.avgChunksPerDoc || 8} chunks/doc)</span>
        </div>
      </div>

      {(details?.parseErrors || 7) > 0 && (
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-destructive">
            <AlertCircle className="h-3 w-3" />
            <span>Erros:</span>
          </div>
          <Button variant="ghost" size="sm" className="h-5 text-[10px] px-2">
            {details?.parseErrors || 7} docs com parse failed
          </Button>
        </div>
      )}
    </div>
  );
}

function IndexingContent({ details, totalDocs, progress }: { details?: StageDetails; totalDocs: number; progress: number }) {
  const indexed = details?.indexed || Math.floor(totalDocs * (progress / 100));
  const clusterHealth = details?.clusterHealth || "green";
  const healthColor = {
    green: "text-apple-green",
    yellow: "text-apple-orange",
    red: "text-destructive",
  }[clusterHealth];

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Documentos indexados:</span>
        <span className="tabular-nums">{indexed.toLocaleString()} / {totalDocs.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Chunks indexados:</span>
        <span className="tabular-nums">{(details?.chunksIndexed || indexed * 8).toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Index:</span>
        <span className="font-mono text-[10px]">{details?.indexName || "gabi_docs_prod"}</span>
      </div>
      
      <div className="border-t border-border/30 pt-2 mt-2 space-y-1.5">
        <p className="text-muted-foreground font-medium">Performance:</p>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Bulk rate:</span>
          <span>{details?.bulkRate || "500 docs/batch"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Tempo médio:</span>
          <span>{details?.avgBatchTime || "45ms/batch"}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <HardDrive className="h-3 w-3" />
            <span>Tamanho do index:</span>
          </div>
          <span>{details?.indexSize || "892 MB"}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-muted-foreground">Health:</span>
        <div className="flex items-center gap-1.5">
          <div className={`h-2 w-2 rounded-full ${healthColor} bg-current`} />
          <span className={healthColor}>Cluster OK</span>
        </div>
      </div>

      <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 w-full mt-1">
        <ExternalLink className="h-2.5 w-2.5" />
        Abrir Elasticsearch Dashboard
      </Button>
    </div>
  );
}

function EmbeddingContent({ details, totalDocs, progress }: { details?: StageDetails; totalDocs: number; progress: number }) {
  const totalChunks = details?.totalChunks || totalDocs * 8;
  const embedded = details?.embedded || Math.floor(totalChunks * (progress / 100));

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Chunks vetorizados:</span>
        <span className="tabular-nums">{embedded.toLocaleString()} / {totalChunks.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Modelo:</span>
        <span className="font-mono text-[10px]">{details?.model || "text-embedding-ada-002"}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Dimensões:</span>
        <span className="tabular-nums">{details?.dimensions || 1536}</span>
      </div>
      
      <div className="border-t border-border/30 pt-2 mt-2 space-y-1.5">
        <p className="text-muted-foreground font-medium">Performance:</p>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Rate:</span>
          <span>{details?.rate || "150 chunks/min"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Custo estimado:</span>
          <span className="text-apple-green">{details?.estimatedCost || "$0.12"}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>ETA:</span>
          </div>
          <span>{details?.eta || "17 minutos"}</span>
        </div>
      </div>

      <div className="border-t border-border/30 pt-2 mt-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Vector DB:</span>
          <span>{details?.vectorDb || "Qdrant (collection: gabi)"}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <HardDrive className="h-3 w-3" />
            <span>Tamanho:</span>
          </div>
          <span>{details?.vectorDbSize || "412 MB"}</span>
        </div>
      </div>

      <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 w-full mt-1">
        <ExternalLink className="h-2.5 w-2.5" />
        Abrir Qdrant Dashboard
      </Button>
    </div>
  );
}

export function PipelineStageHoverCard({ 
  stage, 
  progress, 
  totalDocs, 
  details, 
  children 
}: PipelineStageHoverCardProps) {
  const { label, description, icon: Icon, color } = stageInfo[stage];

  const contentMap: Record<PipelineStage, React.ReactNode> = {
    discovery: <DiscoveryContent details={details} totalDocs={totalDocs} />,
    sync: <SyncContent details={details} totalDocs={totalDocs} progress={progress} />,
    processing: <ProcessingContent details={details} totalDocs={totalDocs} progress={progress} />,
    indexing: <IndexingContent details={details} totalDocs={totalDocs} progress={progress} />,
    embedding: <EmbeddingContent details={details} totalDocs={totalDocs} progress={progress} />,
  };

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        align="center" 
        className="w-80 bg-popover/95 backdrop-blur-md border-border/50"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <h4 className="text-sm font-semibold text-foreground">{label}: {progress}%</h4>
            </div>
          </div>

          <div className="pb-2">
            <Progress value={progress} className="h-1.5" />
          </div>

          <div className="border-t border-border/30 pt-2">
            <p className="text-[10px] text-muted-foreground mb-3 italic">
              {description}
            </p>
            {contentMap[stage]}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
