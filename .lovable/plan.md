
# Plano de Melhorias UI/UX - Dashboard GABI

## Visao Geral

Este plano aborda as 7 oportunidades de melhoria que voce identificou, priorizando as de alta severidade primeiro. A implementacao mantara o estilo Apple que ja esta no projeto.

---

## Fase 1: Layout Condensado + Quick Status (Prioridade Alta)

### 1.1 Novo Componente QuickStatusBar

Criar uma barra de status compacta no topo do dashboard que mostra o estado geral do sistema em uma linha:

```text
+---------------------------------------------------------------+
| STATUS SYNC              | ELASTICSEARCH           | TEMPO    |
| [*] 12/14 Synced         | [*] Online             | ETA: 28m |
| [.] 2 Pending            | 542K docs indexed      | 12.5K/m  |
| [x] 0 Failed             | Response: 142ms        |          |
+---------------------------------------------------------------+
```

**Arquivos a criar:**
- `src/components/dashboard/QuickStatusBar.tsx`

**Caracteristicas:**
- Cards ultra-compactos com dots coloridos de status
- Layout horizontal em grid (3 colunas no desktop, empilhado no mobile)
- Animacao sutil no dot quando status muda

### 1.2 Refatorar MetricCards para Versao Compacta

Modificar o componente `MetricCard` para ter uma variante `compact`:

**Arquivos a modificar:**
- `src/components/dashboard/MetricCard.tsx`

**Mudancas:**
- Adicionar prop `variant?: "default" | "compact"`
- Versao compact: ~50% menor, sem subtitle, numero + label inline

---

## Fase 2: Dark Mode + Tema (Prioridade Alta)

### 2.1 Implementar Toggle de Tema

O projeto ja tem as variaveis CSS para dark mode definidas em `index.css`. Precisa:

**Arquivos a modificar:**
- `src/components/dashboard/DashboardHeader.tsx` - Tornar o botao Sun/Moon funcional

**Arquivos a criar:**
- `src/hooks/useTheme.ts` - Hook para gerenciar tema (localStorage + class toggle)

**Implementacao:**
```text
1. useTheme hook:
   - Le preferencia do localStorage ou system preference
   - Aplica classe "dark" no documentElement
   - Persiste mudancas

2. DashboardHeader:
   - Importar useTheme
   - Toggle entre Sun/Moon icons
   - Animacao suave na transicao
```

---

## Fase 3: Feedback de Erros (Prioridade Alta)

### 3.1 Componente SystemHealthBanner

Criar banner persistente no topo quando ha problemas de conectividade:

**Arquivos a criar:**
- `src/components/dashboard/SystemHealthBanner.tsx`

```text
+---------------------------------------------------------------+
| [!] ELASTICSEARCH OFFLINE                                      |
|     Search functionality disabled. Last check: 2 min ago       |
|                                        [Retry] [View Details]  |
+---------------------------------------------------------------+
```

**Caracteristicas:**
- Cores semanticas: vermelho (offline), amarelo (degraded), verde (dismiss)
- Botao Retry com loading state
- Auto-dismiss apos reconexao
- Animacao slide-down ao aparecer

### 3.2 Criar Context de Health Status

**Arquivos a criar:**
- `src/contexts/SystemHealthContext.tsx`

**Funcionalidades:**
- Estado centralizado de saude dos servicos
- Polling opcional (desabilitado por padrao, mock para demo)
- Metodos: `checkHealth()`, `dismissAlert()`

---

## Fase 4: Empty States + Tooltips (Prioridade Media)

### 4.1 Componente EmptyState Reutilizavel

**Arquivos a criar:**
- `src/components/ui/empty-state.tsx`

```text
+---------------------------+
|                           |
|     [   Icon   ]          |
|     No Data Yet           |
|     Description text      |
|     [Action Button]       |
|                           |
+---------------------------+
```

**Props:**
- `icon`, `title`, `description`, `action`, `actionLabel`

### 4.2 Adicionar Tooltips nos Status Badges

**Arquivos a modificar:**
- `src/components/dashboard/PipelineStage.tsx`
- `src/components/dashboard/SourcesTable.tsx`
- `src/components/dashboard/RAGStatusWidget.tsx`

**Implementacao:**
- Envolver badges de status com `<Tooltip>`
- Conteudo: explicacao + timestamp (ex: "All documents synced - Last: 2h ago")

---

## Fase 5: Real-Time Updates (Prioridade Media)

### 5.1 Hook para WebSocket/Polling

**Arquivos a criar:**
- `src/hooks/useRealtimeData.ts`

**Caracteristicas:**
- Suporte a WebSocket (quando disponivel) ou fallback para polling
- Auto-reconnect com backoff exponencial
- Estado: `connected`, `reconnecting`, `disconnected`
- Mock mode para desenvolvimento

### 5.2 Indicador de Conexao em Tempo Real

**Arquivos a modificar:**
- `src/components/dashboard/DashboardHeader.tsx`

**Adicionar:**
- Dot verde/amarelo/vermelho indicando status da conexao real-time
- Tooltip com "Connected" / "Reconnecting..." / "Offline"

---

## Fase 6: Tabelas Responsivas Melhoradas (Prioridade Alta)

### 6.1 Refatorar SourcesTable

A tabela atual ja tem versao mobile (cards), mas precisa:

**Arquivos a modificar:**
- `src/components/dashboard/SourcesTable.tsx`

**Melhorias:**
- Adicionar horizontal scroll indicator no mobile
- Sticky header na versao desktop
- Hover state mais pronunciado
- Opcao de ordenacao por coluna (sort icons)
- Skeleton loading individual por linha

---

## Fase 7: Activity Feed (Nova Feature)

### 7.1 Componente RecentActivityFeed

Criar feed de atividades recentes como mostrado no prototipo:

**Arquivos a criar:**
- `src/components/dashboard/RecentActivityFeed.tsx`

```text
+-- RECENT ACTIVITY ----------------------------------+
| [*] 2h ago   tcu_acordaos   synced 5.2K docs       |
| [@] 15m ago  tcu_normas     syncing...             |
| [!] 45m ago  tcu_sumulas    2 errors (retry)       |
+----------------------------------------------------+
```

**Caracteristicas:**
- Timeline vertical compacta
- Icons/cores por tipo de evento
- Animacao de entrada para novos eventos
- Link para detalhes de cada evento

---

## Estrutura de Arquivos Final

```text
src/
  components/
    dashboard/
      QuickStatusBar.tsx       <- NOVO
      SystemHealthBanner.tsx   <- NOVO
      RecentActivityFeed.tsx   <- NOVO
      MetricCard.tsx           <- MODIFICAR (add compact variant)
      PipelineStage.tsx        <- MODIFICAR (add tooltips)
      SourcesTable.tsx         <- MODIFICAR (melhorias responsivas)
      RAGStatusWidget.tsx      <- MODIFICAR (add tooltips)
      DashboardHeader.tsx      <- MODIFICAR (theme toggle funcional)
    ui/
      empty-state.tsx          <- NOVO
  contexts/
    SystemHealthContext.tsx    <- NOVO
  hooks/
    useTheme.ts                <- NOVO
    useRealtimeData.ts         <- NOVO
  pages/
    Index.tsx                  <- MODIFICAR (integrar novos componentes)
```

---

## Ordem de Implementacao

1. **useTheme + Dark Mode** - Rapido, alto impacto visual
2. **QuickStatusBar** - Condensa informacao, menos scroll
3. **SystemHealthBanner + Context** - Feedback de erros
4. **Empty State component** - Reutilizavel em varios lugares
5. **Tooltips nos badges** - Melhora UX com pouco codigo
6. **RecentActivityFeed** - Nova feature de alto valor
7. **SourcesTable melhorias** - Polimento final
8. **useRealtimeData** - Preparacao para integracao com backend

---

## Secao Tecnica

### Dependencias
Nenhuma nova dependencia necessaria - todas as ferramentas ja estao no projeto:
- `next-themes` (instalado, mas nao usado - alternativa: criar useTheme proprio)
- Radix UI Tooltip (ja instalado)
- Tailwind classes para dark mode (ja configurado)

### Padroes a Seguir
- Manter uso de CSS variables para cores
- Usar `cn()` utility para class merging
- Componentes com `className` prop para customizacao
- Animacoes usando classes `transition-apple` existentes
- Mobile-first: todas as novas features responsivas

### Mock Data
Todos os componentes usarao mock data por padrao, com props opcionais para dados reais quando o backend estiver pronto.
