import { useState } from "react";
import {
  DashboardSidebar,
  DashboardHeader,
  MetricCard,
  PipelineStage,
  SourcesTable,
  RAGStatusWidget,
  NewsFeed,
  QuickStatusBar,
  SystemHealthBanner,
  RecentActivityFeed,
} from "@/components/dashboard";
import { SystemHealthProvider } from "@/contexts/SystemHealthContext";
import { FileText, Database, Activity, Layers } from "lucide-react";
import type { ActivityItem } from "@/components/dashboard/RecentActivityFeed";

// Mock data with extended fields for hovercards
const mockSources = [
  {
    id: "1",
    name: "Product Documentation",
    type: "pdf" as const,
    documents: 1247,
    discovery: 100,
    sync: 100,
    processing: 85,
    indexing: 72,
    embedding: 68,
    description: "Manuais de produto, guias de usuário e documentação técnica em PDF",
    createdAt: new Date("2024-01-15"),
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
    owner: "equipe-docs@empresa.com",
    tags: ["manual", "produto", "v2.0"],
  },
  {
    id: "2",
    name: "Customer Database",
    type: "database" as const,
    documents: 8432,
    discovery: 100,
    sync: 95,
    processing: 90,
    indexing: 88,
    embedding: 85,
    description: "Base de dados de clientes com histórico de interações e tickets",
    createdAt: new Date("2023-11-20"),
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000),
    owner: "data-team@empresa.com",
    tags: ["clientes", "crm", "suporte"],
  },
  {
    id: "3",
    name: "Knowledge Base",
    type: "website" as const,
    documents: 523,
    discovery: 100,
    sync: 100,
    processing: 100,
    indexing: 100,
    embedding: 100,
    description: "Base de conhecimento interna com artigos e FAQs",
    createdAt: new Date("2024-02-01"),
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000),
    owner: "kb-admin@empresa.com",
    tags: ["faq", "interno", "suporte"],
  },
  {
    id: "4",
    name: "External API Feed",
    type: "api" as const,
    documents: 2156,
    discovery: 78,
    sync: 65,
    processing: 45,
    indexing: 32,
    embedding: 28,
    description: "Feed de dados externos do TCU via API REST com paginação",
    createdAt: new Date("2024-03-10"),
    lastUpdated: new Date(Date.now() - 45 * 60 * 1000),
    owner: "integracao@empresa.com",
    tags: ["tcu", "api", "externo"],
  },
];

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "sync_complete",
    source: "tcu_acordaos",
    message: "Synced 5.2K documents successfully",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
  },
  {
    id: "2",
    type: "syncing",
    source: "tcu_normas",
    message: "Syncing in progress...",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15m ago
  },
  {
    id: "3",
    type: "error",
    source: "tcu_sumulas",
    message: "2 errors occurred during sync",
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45m ago
    details: "Connection timeout after 30s",
  },
  {
    id: "4",
    type: "sync_complete",
    source: "Product Documentation",
    message: "Indexed 1,247 PDF documents",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3h ago
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleRetry = (id: string) => {
    console.log("Retrying activity:", id);
  };

  const renderContent = () => {
    if (activeTab === "news") {
      return <NewsFeed />;
    }

    // Overview content (default)
    return (
      <>
        {/* System Health Banner */}
        <SystemHealthBanner className="mb-4" />

        {/* Quick Status Bar */}
        <QuickStatusBar
          syncStatus={{
            synced: 12,
            total: 14,
            pending: 2,
            failed: 0,
            inProgress: 1,
          }}
          elasticsearch={{
            status: "online",
            docsIndexed: 542000,
            responseTime: 142,
          }}
          throughput={{
            rate: "12.5K/min",
            eta: "28 minutes",
          }}
          className="mb-6"
        />

        {/* Metrics Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger-children">
          <MetricCard
            title="Total Documents"
            value="12,358"
            subtitle="Across all sources"
            icon={<FileText className="h-5 w-5" />}
            trend={{ value: 12.5, isPositive: true }}
            colorScheme="blue"
          />
          <MetricCard
            title="RAG Indexed"
            value="10,847"
            subtitle="Ready for queries"
            icon={<Database className="h-5 w-5" />}
            progress={87.8}
            colorScheme="green"
          />
          <MetricCard
            title="Processing Rate"
            value="2.4k/hr"
            subtitle="Current throughput"
            icon={<Activity className="h-5 w-5" />}
            trend={{ value: 8.3, isPositive: true }}
            colorScheme="orange"
          />
          <MetricCard
            title="Active Sources"
            value="4"
            subtitle="Connected & syncing"
            icon={<Layers className="h-5 w-5" />}
            colorScheme="purple"
          />
        </section>

        {/* Pipeline & RAG Status */}
        <section className="space-y-4">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-sm font-semibold text-foreground">
              Processing Pipeline
            </h2>
            <span className="text-xs text-muted-foreground">
              Overall: 78.4% complete
            </span>
          </div>
          
          {/* Pipeline Grid - responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <PipelineStage
              name="Discovery"
              status="complete"
              progress={100}
              items={{ current: 4, total: 4 }}
              colorScheme="blue"
              lastUpdated="2 hours ago"
            />
            <PipelineStage
              name="Sync"
              status="complete"
              progress={95}
              items={{ current: 11892, total: 12358 }}
              colorScheme="green"
              lastUpdated="15 minutes ago"
            />
            <PipelineStage
              name="Processing"
              status="processing"
              progress={82}
              items={{ current: 10134, total: 12358 }}
              colorScheme="orange"
              lastUpdated="Just now"
            />
            <PipelineStage
              name="Indexing"
              status="processing"
              progress={74}
              items={{ current: 9145, total: 12358 }}
              colorScheme="purple"
              lastUpdated="Just now"
            />
            <PipelineStage
              name="Embedding"
              status="processing"
              progress={68}
              items={{ current: 8403, total: 12358 }}
              colorScheme="teal"
              lastUpdated="Just now"
            />
          </div>
          
          {/* RAG Status + Activity Feed Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RAGStatusWidget
              status="syncing"
              chunks={847293}
              lastSync="2 minutes ago"
              vectorSize="4.2 GB"
            />
            <RecentActivityFeed
              activities={mockActivities}
              onRetry={handleRetry}
            />
          </div>
        </section>

        {/* Sources Table */}
        <section>
          <SourcesTable sources={mockSources} />
        </section>
      </>
    );
  };

  return (
    <SystemHealthProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar */}
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <DashboardHeader connectionStatus="connected" />

          <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
            <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SystemHealthProvider>
  );
};

export default Index;
