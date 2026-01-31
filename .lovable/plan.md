

# Plano: Sneakpeeks Interativos na Sources Pipeline Table

## Visao Geral

Adicionar popups/hovercards informativos em cada elemento clicavel da tabela de sources, transformando-a de uma visualizacao passiva em uma ferramenta de exploracao interativa.

---

## Mapeamento de Cliques e Conteudos

### 1. Clique no Nome da Source (ex: "Product Documentation")

**Tipo de interacao:** HoverCard (aparece ao passar mouse) + Click abre Dialog completo

**Conteudo do HoverCard (preview rapido):**
```text
+----------------------------------------+
| Product Documentation                   |
| ----------------------------------------|
| Descricao: PDFs de manuais de produto  |
| Criado em: 15 Jan 2024                 |
| Ultima atualizacao: 2h atras           |
| Owner: equipe-docs@empresa.com         |
| Tags: [manual] [produto] [v2.0]        |
+----------------------------------------+
```

**Conteudo do Dialog (clique para detalhes):**
- Configuracoes da source (URL, credenciais mascaradas)
- Historico de syncs (ultimos 10)
- Grafico de crescimento de documentos ao longo do tempo
- Botoes: [Editar] [Sync Agora] [Pausar] [Deletar]

---

### 2. Clique no Badge de Tipo (Database, PDF, API, Website)

**Tipo de interacao:** HoverCard informativo

**Conteudo por tipo:**

**Database:**
```text
+----------------------------------------+
| Tipo: Database                          |
| ----------------------------------------|
| Conexao: PostgreSQL                    |
| Host: db.empresa.com:5432              |
| Schema: public                          |
| Tabelas monitoradas: 12                |
| Query padrao: SELECT * FROM docs...    |
| Refresh rate: a cada 15 min            |
+----------------------------------------+
```

**PDF:**
```text
+----------------------------------------+
| Tipo: PDF Documents                     |
| ----------------------------------------|
| Storage: S3 bucket (docs-bucket)       |
| Formatos aceitos: .pdf, .docx          |
| OCR habilitado: Sim                    |
| Idiomas detectados: PT, EN             |
| Tamanho medio: 2.4 MB                  |
+----------------------------------------+
```

**API:**
```text
+----------------------------------------+
| Tipo: REST API                          |
| ----------------------------------------|
| Endpoint: api.tribunal.gov.br/v2       |
| Metodo: GET com paginacao              |
| Auth: Bearer Token (valido)            |
| Rate limit: 100 req/min                |
| Ultimo health check: OK (142ms)        |
+----------------------------------------+
```

**Website:**
```text
+----------------------------------------+
| Tipo: Web Crawler                       |
| ----------------------------------------|
| URL base: docs.empresa.com             |
| Profundidade: 3 niveis                 |
| Paginas descobertas: 523               |
| Robots.txt: Respeitado                 |
| Ultimo crawl: 1h atras                 |
+----------------------------------------+
```

---

### 3. Clique na Contagem de Docs (ex: "1,247")

**Tipo de interacao:** Popover com breakdown

**Conteudo:**
```text
+----------------------------------------+
| 1,247 Documentos                        |
| ----------------------------------------|
| Por status:                             |
|   [====] 1,102 Processados (88%)       |
|   [==  ]   98 Em fila (8%)             |
|   [x   ]   47 Com erro (4%)            |
| ----------------------------------------|
| Por ano:                                |
|   2024: 456 docs                        |
|   2023: 512 docs                        |
|   2022: 279 docs                        |
| ----------------------------------------|
| Tamanho total: 3.2 GB                  |
| Media por doc: 2.6 MB                  |
| ----------------------------------------|
| [Ver todos os documentos ->]           |
+----------------------------------------+
```

---

### 4. Clique em Discovery (barra de progresso)

**Tipo de interacao:** HoverCard com metricas

**Conteudo:**
```text
+----------------------------------------+
| Discovery: 100%                         |
| ----------------------------------------|
| O que e: Identificacao de novos docs   |
|          no source original            |
| ----------------------------------------|
| Arquivos encontrados: 1,247            |
| Novos desde ultimo scan: +23           |
| Removidos/movidos: -5                  |
| Proximo scan: em 14 min                |
| ----------------------------------------|
| Metodo: Listagem S3 + delta compare    |
| Tempo do ultimo scan: 12s              |
+----------------------------------------+
```

---

### 5. Clique em Sync (barra de progresso)

**Tipo de interacao:** HoverCard + Progress detalhado

**Conteudo:**
```text
+----------------------------------------+
| Sync: 95%                               |
| ----------------------------------------|
| O que e: Download dos arquivos para    |
|          armazenamento local           |
| ----------------------------------------|
| Sincronizados: 1,184 / 1,247           |
| Pendentes: 63                           |
| Velocidade: 12.5 MB/s                  |
| ETA: ~8 minutos                        |
| ----------------------------------------|
| Erros de sync: 2                        |
|   - doc_4521.pdf (timeout)             |
|   - doc_8832.pdf (404)                 |
| [Retry erros]                          |
+----------------------------------------+
```

---

### 6. Clique em Processing (barra de progresso)

**Tipo de interacao:** HoverCard com detalhes de processamento

**Conteudo:**
```text
+----------------------------------------+
| Processing: 85%                         |
| ----------------------------------------|
| O que e: Extracao de texto, parsing,   |
|          limpeza e chunking            |
| ----------------------------------------|
| Processados: 1,060 / 1,247             |
| Em processamento agora: 12             |
| Na fila: 175                           |
| ----------------------------------------|
| Breakdown por etapa:                    |
|   Extracao texto: 1,180 OK             |
|   OCR aplicado: 342 docs               |
|   Chunking: 1,060 (avg 8 chunks/doc)   |
| ----------------------------------------|
| Erros: 7 docs com parse failed         |
| [Ver erros de processamento]           |
+----------------------------------------+
```

---

### 7. Clique em Indexing (barra de progresso)

**Tipo de interacao:** HoverCard com status Elasticsearch

**Conteudo:**
```text
+----------------------------------------+
| Indexing: 72%                           |
| ----------------------------------------|
| O que e: Insercao no Elasticsearch     |
|          para busca full-text          |
| ----------------------------------------|
| Documentos indexados: 898 / 1,247      |
| Chunks indexados: 7,184                |
| Index: gabi_docs_prod                  |
| ----------------------------------------|
| Performance:                            |
|   Bulk rate: 500 docs/batch            |
|   Tempo medio: 45ms/batch              |
|   Tamanho do index: 892 MB             |
| ----------------------------------------|
| Health: [verde] Cluster OK              |
| [Abrir Elasticsearch Dashboard]        |
+----------------------------------------+
```

---

### 8. Clique em Embedding (barra de progresso)

**Tipo de interacao:** HoverCard com detalhes de vetorizacao

**Conteudo:**
```text
+----------------------------------------+
| Embedding: 68%                          |
| ----------------------------------------|
| O que e: Geracao de vetores para       |
|          busca semantica (RAG)         |
| ----------------------------------------|
| Chunks vetorizados: 5,432 / 7,988      |
| Modelo: text-embedding-ada-002         |
| Dimensoes: 1536                         |
| ----------------------------------------|
| Performance:                            |
|   Rate: 150 chunks/min                 |
|   Custo estimado: $0.12                |
|   ETA: 17 minutos                      |
| ----------------------------------------|
| Vector DB: Qdrant (collection: gabi)   |
| Tamanho: 412 MB                         |
| [Abrir Qdrant Dashboard]               |
+----------------------------------------+
```

---

## Arquivos a Criar

### `src/components/dashboard/SourceDetailDialog.tsx`
Modal completo com todas as informacoes da source, aberto ao clicar no nome.

### `src/components/dashboard/source-hovercards/`
Pasta com componentes de hovercard especializados:
- `SourceNameHoverCard.tsx`
- `SourceTypeHoverCard.tsx`
- `DocsCountPopover.tsx`
- `PipelineStageHoverCard.tsx` (reutilizavel para Discovery, Sync, Processing, Indexing, Embedding)

---

## Arquivos a Modificar

### `src/components/dashboard/SourcesTable.tsx`
- Importar novos componentes de hovercard
- Envolver cada elemento clicavel com o respectivo trigger
- Adicionar estado para controlar Dialog de detalhes

### `src/pages/Index.tsx`
- Expandir mock data com campos adicionais para popular os hovercards

---

## Interface de Dados Expandida

```typescript
interface SourceExtended {
  // Campos existentes
  id: string;
  name: string;
  type: "pdf" | "database" | "website" | "api";
  documents: number;
  discovery: number;
  sync: number;
  processing: number;
  indexing: number;
  embedding: number;
  
  // Novos campos para hovercards
  description?: string;
  createdAt?: Date;
  lastUpdated?: Date;
  owner?: string;
  tags?: string[];
  
  // Config por tipo
  typeConfig?: {
    // Database
    dbType?: string;
    host?: string;
    schema?: string;
    tablesMonitored?: number;
    
    // PDF
    storage?: string;
    ocrEnabled?: boolean;
    avgFileSize?: string;
    
    // API
    endpoint?: string;
    authType?: string;
    rateLimit?: string;
    
    // Website
    baseUrl?: string;
    crawlDepth?: number;
    respectRobots?: boolean;
  };
  
  // Metricas detalhadas por stage
  stageDetails?: {
    discovery?: {
      filesFound: number;
      newSinceLastScan: number;
      removed: number;
      nextScan: string;
      scanDuration: string;
    };
    sync?: {
      synced: number;
      pending: number;
      speed: string;
      eta: string;
      errors: Array<{ file: string; reason: string }>;
    };
    processing?: {
      processed: number;
      inProgress: number;
      queued: number;
      ocrApplied: number;
      avgChunksPerDoc: number;
      errors: number;
    };
    indexing?: {
      indexed: number;
      chunksIndexed: number;
      indexName: string;
      bulkRate: string;
      indexSize: string;
    };
    embedding?: {
      embedded: number;
      totalChunks: number;
      model: string;
      dimensions: number;
      rate: string;
      estimatedCost: string;
      eta: string;
      vectorDbSize: string;
    };
  };
  
  // Docs breakdown
  docsBreakdown?: {
    byStatus: {
      processed: number;
      queued: number;
      errored: number;
    };
    byYear: Record<string, number>;
    totalSize: string;
    avgSize: string;
  };
}
```

---

## Comportamento de Interacao

| Elemento | Hover | Click |
|----------|-------|-------|
| Nome | HoverCard preview | Abre Dialog completo |
| Type Badge | HoverCard config | - |
| Docs Count | - | Popover breakdown |
| Discovery | HoverCard metricas | - |
| Sync | HoverCard metricas | - |
| Processing | HoverCard metricas | - |
| Indexing | HoverCard metricas | - |
| Embedding | HoverCard metricas | - |

---

## Estilo Visual

- Usar `HoverCard` do Radix para previews rapidos (aparecem ao hover)
- Usar `Popover` para docs breakdown (clique necessario, mais conteudo)
- Usar `Dialog` para visao completa da source
- Manter estilo Apple com glassmorphism sutil
- Animacoes suaves de entrada (fade-in, scale)
- Cores consistentes com o color scheme de cada stage

---

## Secao Tecnica

### Componentes Radix UI utilizados
- `HoverCard` - para previews informativos no hover
- `Popover` - para breakdown de docs (clique)
- `Dialog` - para detalhes completos da source

### Performance
- Lazy loading do conteudo dos hovercards
- Delay de 200ms antes de mostrar (evita flicker)
- Portal rendering para evitar overflow issues

### Acessibilidade
- Todos os triggers terao `aria-describedby`
- Conteudo dos hovercards sera lido por screen readers
- Navegacao por teclado funcionara (Tab + Enter)

