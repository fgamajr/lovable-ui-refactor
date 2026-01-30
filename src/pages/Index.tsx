import { useState } from "react";
import {
  DashboardSidebar,
  DashboardHeader,
  MetricCard,
  PipelineStage,
  SourcesTable,
  RAGStatusWidget,
} from "@/components/dashboard";
import { FileText, Database, Activity, Layers } from "lucide-react";

// Mock data
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
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            {/* Metrics Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
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
            <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Pipeline Stages */}
              <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">
                    Processing Pipeline
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    Overall: 78.4% complete
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 stagger-children">
                  <PipelineStage
                    name="Discovery"
                    status="complete"
                    progress={100}
                    items={{ current: 4, total: 4 }}
                    colorScheme="blue"
                  />
                  <PipelineStage
                    name="Database Sync"
                    status="complete"
                    progress={95}
                    items={{ current: 11892, total: 12358 }}
                    colorScheme="green"
                  />
                  <PipelineStage
                    name="Processing"
                    status="processing"
                    progress={82}
                    items={{ current: 10134, total: 12358 }}
                    colorScheme="orange"
                  />
                  <PipelineStage
                    name="Search Index"
                    status="processing"
                    progress={74}
                    items={{ current: 9145, total: 12358 }}
                    colorScheme="purple"
                  />
                  <PipelineStage
                    name="Vector Embed"
                    status="processing"
                    progress={68}
                    items={{ current: 8403, total: 12358 }}
                    colorScheme="teal"
                  />
                </div>
              </div>

              {/* RAG Status Widget */}
              <div className="lg:col-span-1">
                <RAGStatusWidget
                  status="syncing"
                  chunks={847293}
                  lastSync="2 minutes ago"
                  vectorSize="4.2 GB"
                />
              </div>
            </section>

            {/* Sources Table */}
            <section>
              <SourcesTable sources={mockSources} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
